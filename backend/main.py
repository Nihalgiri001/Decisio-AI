from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import FastAPI
from fastapi.responses import JSONResponse

try:
    from backend.ai_platform import MemoryStore, MockKnowledge, PlannerAgent, KnowledgeBase
except ModuleNotFoundError:  # pragma: no cover - container fallback
    from ai_platform import MemoryStore, MockKnowledge, PlannerAgent, KnowledgeBase

app = FastAPI(
    title="Nexora Studio",
    description="Agentic Decision Intelligence platform demo with planner orchestration, evidence, human-in-the-loop, and memory.",
)

memory_store = MemoryStore()
try:
    knowledge = KnowledgeBase()
except Exception:
    knowledge = MockKnowledge()
planner = PlannerAgent(knowledge=knowledge, memory=memory_store)


@app.get("/")
def root():
    return {
        "name": "Nexora Studio",
        "status": "running",
        "experience": "agentic decision intelligence",
    }


@app.get("/ollama/health")
def ollama_health() -> JSONResponse:
    """Debug endpoint for host/container Ollama connectivity."""
    return JSONResponse(content=planner.refresh_llm_health())


def _to_jsonable(obj: Any) -> Any:
    # Dataclasses have __dict__ but nested dataclasses/lists need recursion.
    if hasattr(obj, "__dict__") and not isinstance(obj, (str, int, float, bool, dict, list)):
        return _to_jsonable(obj.__dict__)
    if isinstance(obj, dict):
        return {k: _to_jsonable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_to_jsonable(v) for v in obj]
    return obj


@app.post("/workflow/start")
def workflow_start(payload: Dict[str, Any]) -> JSONResponse:
    """Ingest an interaction + gather org context + produce next-best actions.

    Accepts flexible input:
    - `interaction_text` (raw)
    - Email: `email_subject`, `email_from`, `email_body`
    - Meeting notes: `meeting_date`, `meeting_context`, `meeting_notes`
    - Transcript: `transcript` (Speaker: line format)

    Human review gate: returned actions are *proposed* and not executed.
    """
    if "customer_id" not in payload:
        return JSONResponse(
            status_code=400,
            content={"error": "Missing required fields", "missing": ["customer_id"]},
        )

    text_fields = (
        "interaction_text",
        "email_body",
        "meeting_notes",
        "transcript",
    )
    if not any(payload.get(f) for f in text_fields):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Missing interaction content",
                "hint": "Provide interaction_text, email_body, meeting_notes, or transcript",
            },
        )

    result = planner.run_workflow(payload)
    return JSONResponse(content=_to_jsonable(result))


@app.post("/workflow/review")
def workflow_review(payload: Dict[str, Any]) -> JSONResponse:
    """Human-in-the-loop decision."""
    required = ["review_id", "status"]
    missing_fields = [f for f in required if f not in payload]
    if missing_fields:
        return JSONResponse(
            status_code=400,
            content={"error": "Missing required fields", "missing": missing_fields},
        )

    review_id = str(payload["review_id"])
    status = str(payload["status"]).lower()
    if status not in ("approved", "rejected"):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid status", "allowed": ["approved", "rejected"]},
        )

    reviewer_notes = payload.get("reviewer_notes")

    memory_store.update_review(
        review_id=review_id,
        status=status,
        reviewer_notes=reviewer_notes,
    )

    # Learn from outcome (bias future recommendations).
    # We need customer_id/domain/run_id; easiest: scan stored runs.
    learned = False
    for run in memory_store._runs.values():  # type: ignore[attr-defined]
        hr = run.human_review
        if hr.review_id == review_id:
            memory_store.learn_from_outcome(
                customer_id=run.customer_id,
                domain=run.domain,
                run_id=run.run_id,
                review_status=status,
                reviewer_notes=reviewer_notes,
            )
            learned = True
            break

    return JSONResponse(
        content={
            "review_id": review_id,
            "status": status,
            "learned_from_outcome": learned,
            "reviewed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.post("/workflow/feedback")
def workflow_feedback(payload: Dict[str, Any]) -> JSONResponse:
    """Capture feedback on a specific action step and write it to memory."""
    required = ["customer_id", "domain", "action_title", "feedback_status"]
    missing_fields = [f for f in required if f not in payload]
    if missing_fields:
        return JSONResponse(
            status_code=400,
            content={"error": "Missing required fields", "missing": missing_fields},
        )

    customer_id = str(payload["customer_id"])
    domain = str(payload["domain"])
    action_title = str(payload["action_title"])
    feedback_status = str(payload["feedback_status"]).lower()

    if feedback_status not in ("approved", "rejected"):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid status", "allowed": ["approved", "rejected"]},
        )

    memory_store.learn_action_feedback(
        customer_id=customer_id,
        domain=domain,
        action_title=action_title,
        feedback_status=feedback_status
    )

    return JSONResponse(
        content={
            "status": "success",
            "action_title": action_title,
            "feedback_status": feedback_status,
            "recorded_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.get("/memory/{customer_id}")
def get_memory(customer_id: str) -> JSONResponse:
    return JSONResponse(content=memory_store.get_memory(customer_id))


# Back-compat demo endpoint (frontend currently calls this).
@app.get("/planner/run")
def planner_run() -> Dict[str, Any]:
    # Provide deterministic mock payload so the old UI still shows something.
    payload = {
        "customer_id": "CUST-1001",
        "domain": "saas_sales",
        "source_type": "meeting_notes",
        "interaction_text": "We have a problem with slow reporting and unclear champion. The customer is asking for faster updates.",
    }
    result = planner.run_workflow(payload)
    data = _to_jsonable(result)

    # Convert into legacy UI schema (recommendation/headline/reason/timeline/pillars).
    # Keep it human-ish rather than raw agent output.
    nba0 = data["next_best_actions"][0]
    analysis = data["analysis"]
    headline = nba0.get("title")
    reason = nba0.get("summary")
    timeline = [
        analysis["opportunities"][0] if analysis.get("opportunities") else "Start with discovery.",
        nba0.get("evidence", [{}])[0].get("excerpt", "Use enterprise evidence to ground decisions."),
        nba0.get("recommended_next_questions", ["Confirm constraints and stakeholders."])[0],
    ]
    pillars = [
        {"title": "Opportunity", "copy": (analysis.get("opportunities") or [""])[0]},
        {"title": "Risk", "copy": (analysis.get("risks") or [""])[0]},
        {"title": "Next", "copy": nba0.get("recommended_next_questions", [""])[0]},
    ]

    return {
        "recommendation": headline,
        "confidence": float(nba0.get("confidence", 0.8)),
        "reason": reason,
        "moment": "Proposed next step (provisional until approved).",
        "next_step": nba0.get("title"),
        "spark": data["explanation_bundle"]["natural_language_summary"],
        "headline": headline,
        "description": nba0.get("summary"),
        "focus": "Evidence-backed next best action",
        "timeline": timeline,
        "pillars": pillars,
        "mood": "Human-first planning",
        "accent": "Evidence & review",
        "signal": "next-best-action",
        "signal_label": "Needs review",
    }


@app.post("/evaluate")
def evaluate_scenarios(payload: Dict[str, Any]) -> JSONResponse:
    """Runs multiple simulated scenarios for a customer/domain and aggregates KPIs and metrics."""
    domain = payload.get("domain", "saas_sales")
    customer_id = payload.get("customer_id", "CUST-EVAL-101")
    num_scenarios = int(payload.get("num_scenarios", 5))
    
    scenarios = {
        "saas_sales": [
            "VP Ops at NexaCorp wants a customized reporting dashboard. High pricing friction, competitor active. IT is demanding SSO.",
            "Sales rep needs a mutual action plan (MAP). The economic buyer is onboard but we have no champion in security yet.",
            "Priya Shah says pricing is too high compared to alternatives. Contract length negotiation. Need discount approval.",
            "Alex (Customer) sent security requirements. Data retention policy questions. GDPR compliance requested.",
            "Discovery email: Priya says their current solution takes 4 hours to run reports. They want it down to 10 minutes."
        ],
        "customer_success": [
            "Taylor at St. Jude Hospital says their reporting module has been failing. Adoption is down 20%. Yellow health score.",
            "Critical bug reported by Morgan. Custom reporting dashboard throws 500 internal server error. Renewal is in 3 months.",
            "Jordan Lee wants an Executive Business Review (EBR) meeting scheduled. Customer is highly satisfied with current performance.",
            "Usage drop of 40% over the last 30 days. No champion activity. Need emergency success plan.",
            "Integration request: Priya asks if we support direct sync with Jira and ServiceNow."
        ],
        "staffing": [
            "Urgent open req for Registered Nurse (RN) at St. Jude Hospital. Need submittals by Friday. Compliance verification pending.",
            "Software Engineer contract req. Budget cap is $90/hr. Candidate background check is delayed.",
            "Placement proposal for Accountant. Background checks complete, client interviewing tomorrow.",
            "Time-to-fill for physical therapist role is exceeding SLA of 20 days. Need pipeline boost.",
            "Successful hire: Candidate started yesterday. Client requested net new requisition for data analyst."
        ],
        "energy": [
            "Grid storage optimization request: PowerGrid Corp asks for battery capacity dispatch schedule.",
            "Microgrid solar output down by 15%. Inverter maintenance scheduled. Outage risk is mixed.",
            "EV fleet charging schedule optimization. Peak load management required between 5pm and 9pm.",
            "Wind turbine downtime report. Vibration sensor flagged anomaly. Need technician dispatch workflow.",
            "Demand response event triggered. Load reduction requested from commercial buildings."
        ]
    }
    
    scenarios_list = scenarios.get(domain, scenarios["saas_sales"])
    selected_scenarios = scenarios_list[:min(len(scenarios_list), num_scenarios)]
    
    results = []
    total_conf = 0.0
    approved_count = 0
    kpi_snapshots = []
    
    for i, sc in enumerate(selected_scenarios):
        run_payload = {
            "customer_id": customer_id,
            "domain": domain,
            "interaction_text": sc
        }
        
        # Run workflow
        run_result = planner.run_workflow(run_payload)
        
        # Calculate average confidence
        conf = 0.0
        if run_result.next_best_actions:
            conf = sum(nba.confidence for nba in run_result.next_best_actions) / len(run_result.next_best_actions)
        
        total_conf += conf
        
        # Simulate review decision (heuristics based: approve if conf >= 0.72)
        is_approved = conf >= 0.72
        status = "approved" if is_approved else "rejected"
        reviewer_notes = "Evaluator: Quality threshold met." if is_approved else "Evaluator: Underperforming confidence."
        
        if is_approved:
            approved_count += 1
            if run_result.success_metrics:
                kpi_snapshots.append(run_result.success_metrics)
                
        # Persist outcomes in SQLite closed-loop
        memory_store.update_review(
            review_id=run_result.human_review.review_id,
            status=status,
            reviewer_notes=reviewer_notes
        )
        memory_store.learn_from_outcome(
            customer_id=customer_id,
            domain=domain,
            run_id=run_result.run_id,
            review_status=status,
            reviewer_notes=reviewer_notes
        )
        
        results.append({
            "scenario_index": i + 1,
            "scenario_text": sc,
            "run_id": run_result.run_id,
            "review_id": run_result.human_review.review_id,
            "average_confidence": round(conf, 2),
            "simulated_review": status,
            "success_metrics": run_result.success_metrics
        })
        
    # Aggregate KPIs
    import re
    def get_number(val: Any) -> float:
        if not val:
            return 0.0
        if isinstance(val, (int, float)):
            return float(val)
        match = re.search(r'[-+]?\d+', str(val))
        return float(match.group()) if match else 0.0
        
    kpi_improvements = {}
    if domain == "saas_sales":
        total_win_prob = 0.0
        total_win_lift = 0.0
        total_days_saved = 0.0
        for snap in kpi_snapshots:
            wp = snap.get("win_probability", {})
            total_win_prob += get_number(wp.get("current_estimate"))
            total_win_lift += get_number(wp.get("estimated_impact"))
            
            tc = snap.get("time_to_champion", {})
            total_days_saved += abs(get_number(tc.get("estimated_impact")))
            
        kpi_improvements = {
            "average_win_probability": f"{round(total_win_prob / len(kpi_snapshots), 1)}%" if kpi_snapshots else "0.0%",
            "average_win_probability_lift": f"+{round(total_win_lift / len(kpi_snapshots), 1)}%" if kpi_snapshots else "+0.0%",
            "average_time_to_champion_reduction": f"-{round(total_days_saved / len(kpi_snapshots), 1)} days" if kpi_snapshots else "0 days"
        }
    elif domain == "customer_success":
        total_churn_risk = 0.0
        total_churn_reduction = 0.0
        total_health_lift = 0.0
        for snap in kpi_snapshots:
            cr = snap.get("churn_risk", {})
            total_churn_risk += get_number(cr.get("current_estimate"))
            total_churn_reduction += abs(get_number(cr.get("estimated_impact")))
            
            hs = snap.get("health_score", {})
            total_health_lift += get_number(hs.get("estimated_impact"))
            
        kpi_improvements = {
            "average_churn_risk": f"{round(total_churn_risk / len(kpi_snapshots), 1)}%" if kpi_snapshots else "0.0%",
            "average_churn_reduction": f"-{round(total_churn_reduction / len(kpi_snapshots), 1)}%" if kpi_snapshots else "-0.0%",
            "average_health_score_lift": f"+{round(total_health_lift / len(kpi_snapshots), 1)} pts" if kpi_snapshots else "+0 pts"
        }
    else:
        total_dq = 0.0
        for snap in kpi_snapshots:
            dq = snap.get("decision_quality", {})
            total_dq += get_number(dq.get("current_estimate"))
        kpi_improvements = {
            "average_decision_quality": f"{round(total_dq / len(kpi_snapshots), 1)}%" if kpi_snapshots else "0.0%"
        }
        
    acceptance_rate = round(approved_count / len(selected_scenarios), 2) if selected_scenarios else 0.0
    avg_confidence = round(total_conf / len(selected_scenarios), 2) if selected_scenarios else 0.0
    
    return JSONResponse(content={
        "domain": domain,
        "customer_id": customer_id,
        "total_scenarios": len(selected_scenarios),
        "acceptance_rate": acceptance_rate,
        "average_confidence": avg_confidence,
        "kpi_improvements": kpi_improvements,
        "scenarios": results
    })


@app.post("/execute")
@app.post("/workflow/execute")
def workflow_execute(payload: Dict[str, Any]) -> JSONResponse:
    """Trigger simulated downstream system stubs after approval."""
    run_id = payload.get("run_id")
    if not run_id:
        return JSONResponse(
            status_code=400,
            content={"error": "Missing required field", "missing": ["run_id"]}
        )
        
    import json
    cursor = memory_store.conn.cursor()
    cursor.execute("SELECT data FROM runs WHERE run_id = ?", (run_id,))
    row = cursor.fetchone()
    if not row:
        return JSONResponse(
            status_code=404,
            content={"error": "Run not found", "run_id": run_id}
        )
        
    run_data = json.loads(row[0])
    domain = run_data.get("domain", "saas_sales")
    customer_id = run_data.get("customer_id", "CUST-1001")
    
    hr_dict = run_data.get("human_review", {})
    status = hr_dict.get("status", "pending")
    
    if status != "approved":
        return JSONResponse(
            status_code=400,
            content={
                "error": "Run cannot be executed",
                "status": status,
                "hint": "Run must be approved before execution."
            }
        )
        
    execution_logs = []
    next_actions = run_data.get("next_best_actions", [])
    top_action_title = next_actions[0].get("title") if next_actions else "Follow up action"
    
    execution_logs.append({
        "action": "draft_email",
        "status": "Draft Email Generated",
        "details": f"Generated email draft for '{top_action_title}' customized for customer {customer_id}."
    })
    
    success_metrics = run_data.get("success_metrics", {})
    if domain == "saas_sales":
        wp = success_metrics.get("win_probability", {})
        est_val = wp.get("current_estimate", "50%")
        execution_logs.append({
            "action": "crm_update",
            "status": "CRM Updated",
            "details": f"Updated deal win probability in CRM system to {est_val} based on playbook compliance."
        })
    elif domain == "customer_success":
        cr = success_metrics.get("churn_risk", {})
        est_val = cr.get("current_estimate", "20%")
        execution_logs.append({
            "action": "crm_update",
            "status": "CRM Updated",
            "details": f"Logged recovery plan, updating customer churn risk to {est_val} in CRM account page."
        })
    else:
        execution_logs.append({
            "action": "crm_update",
            "status": "CRM Updated",
            "details": f"Logged action compliance for customer {customer_id} in SQLite CRM database."
        })
        
    execution_logs.append({
        "action": "calendar_invite",
        "status": "Calendar Invite Created",
        "details": f"Created placeholder calendar invite for discovery and review cadence with {customer_id}."
    })
    
    return JSONResponse(content={
        "run_id": run_id,
        "executed": True,
        "execution_logs": execution_logs
    })


