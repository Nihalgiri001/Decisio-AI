const http = require('http');
const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Decisio-AI • Enterprise Decision Intelligence</title>
    <!-- Premium Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
      :root {
        color-scheme: dark;
        
        /* Premium Cinematic Theme Variables */
        --bg: #0b0f19;
        --bg-alt: #111827;
        --surface: #1e293b;
        --surface-hover: #334155;
        --surface-card: rgba(30, 41, 59, 0.7);
        --text: #f8fafc;
        --text-muted: #94a3b8;
        --text-muted-2: #64748b;
        --border: #334155;
        --border-hover: #475569;
        --border-glow: rgba(59, 130, 246, 0.15);
        --shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.1);
        --radius-xl: 20px;
        --radius-lg: 16px;
        --radius-md: 12px;
        --radius-sm: 8px;

        /* Core Accents - Tailored HSL colors */
        --accent-primary: #a8cfaa; /* Sage Green */
        --accent-success: #10b981;
        --accent-success-rgb: 16, 185, 129;
        --accent-info: #3b82f6;
        --accent-info-rgb: 59, 130, 246;
        --accent-warning: #f59e0b;
        --accent-warning-rgb: 245, 158, 11;
        --accent-danger: #f43f5e;
        --accent-danger-rgb: 244, 63, 94;
        --accent-purple: #8b5cf6;
        --accent-purple-rgb: 139, 92, 246;

        --glass-bg: rgba(15, 23, 42, 0.7);
        --glass-border: rgba(255, 255, 255, 0.08);
        --font: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
        --font-mono: 'JetBrains Mono', monospace;
      }

      .light-mode {
        color-scheme: light;
        --bg: #f8fafc;
        --bg-alt: #f1f5f9;
        --surface: #ffffff;
        --surface-hover: #f1f5f9;
        --surface-card: rgba(255, 255, 255, 0.85);
        --text: #0f172a;
        --text-muted: #475569;
        --text-muted-2: #64748b;
        --border: #e2e8f0;
        --border-hover: #cbd5e1;
        --border-glow: rgba(59, 130, 246, 0.05);
        --shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        --shadow-glow: 0 0 15px rgba(59, 130, 246, 0.04);
        --glass-bg: rgba(255, 255, 255, 0.85);
        --glass-border: rgba(15, 23, 42, 0.06);
      }

      * {
        box-sizing: border-box;
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      }

      body {
        margin: 0;
        font-family: var(--font);
        background-color: var(--bg);
        background-image: 
          radial-gradient(at 10% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
          radial-gradient(at 90% 10%, rgba(168, 207, 170, 0.08) 0px, transparent 50%);
        background-attachment: fixed;
        color: var(--text);
        min-height: 100vh;
        padding: 24px;
        line-height: 1.5;
      }

      /* Premium Glassmorphism Layout */
      .app {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Alert Banners */
      .alert-banner {
        padding: 14px 20px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        font-weight: 500;
        border-left: 4px solid;
        animation: fadeIn 0.3s ease;
      }
      .alert-banner.error {
        background: rgba(var(--accent-danger-rgb), 0.1);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
      }
      .alert-banner.warn {
        background: rgba(var(--accent-warning-rgb), 0.1);
        border-color: var(--accent-warning);
        color: var(--accent-warning);
      }
      .alert-banner.info {
        background: rgba(var(--accent-info-rgb), 0.1);
        border-color: var(--accent-info);
        color: var(--accent-info);
      }

      /* Header Bar */
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-icon {
        width: 38px;
        height: 38px;
        background: linear-gradient(135deg, var(--accent-primary, #a8cfaa) 0%, var(--accent-info) 100%);
        border-radius: var(--radius-md);
        position: relative;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
      }
      .logo-icon::after {
        content: '';
        position: absolute;
        inset: 3px;
        background: var(--bg);
        border-radius: calc(var(--radius-md) - 3px);
      }
      .logo-icon::before {
        content: 'D';
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 18px;
        color: var(--text);
        z-index: 2;
      }

      .brand-title h1 {
        margin: 0;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .brand-title p {
        margin: 2px 0 0 0;
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      /* Status Badges */
      .pill-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border);
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
      .dot-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--accent-success);
        box-shadow: 0 0 0 0 rgba(var(--accent-success-rgb), 0.7);
        animation: pulse 1.6s infinite;
      }
      .dot-pulse.orange {
        background-color: var(--accent-warning);
        box-shadow: 0 0 0 0 rgba(var(--accent-warning-rgb), 0.7);
      }
      .dot-pulse.red {
        background-color: var(--accent-danger);
        box-shadow: 0 0 0 0 rgba(var(--accent-danger-rgb), 0.7);
      }

      /* Premium Buttons */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--surface-card);
        color: var(--text);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      .btn:hover {
        border-color: var(--border-hover);
        background: var(--surface-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-glow);
      }
      .btn:active {
        transform: translateY(0);
      }
      .btn.primary {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
        border-color: var(--accent-info);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      .btn.primary:hover {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.25);
      }
      .btn.success {
        border-color: var(--accent-success);
        background: rgba(var(--accent-success-rgb), 0.08);
      }
      .btn.success:hover {
        background: rgba(var(--accent-success-rgb), 0.15);
      }
      .btn.danger {
        border-color: var(--accent-danger);
        background: rgba(var(--accent-danger-rgb), 0.08);
        color: var(--accent-danger);
      }
      .btn.danger:hover {
        background: rgba(var(--accent-danger-rgb), 0.15);
      }
      .btn.ghost {
        background: transparent;
        border-color: transparent;
      }
      .btn.ghost:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      /* Story Preset Launch Pad */
      .presets-bar {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        padding: 12px 20px;
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .presets-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: var(--text-muted);
        font-weight: 700;
      }
      .presets-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      /* Responsive Layout Grids */
      .main-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 24px;
      }
      @media (max-width: 1100px) {
        .main-grid {
          grid-template-columns: 1fr;
        }
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      @media (max-width: 900px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Panel Cards styling */
      .panel {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 24px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border);
        padding-bottom: 14px;
        margin-bottom: 4px;
      }
      .panel-title {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 8px;
        letter-spacing: -0.2px;
      }
      .panel-title span.number {
        background: var(--border);
        color: var(--text-muted);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
      }
      .panel-subtitle {
        font-size: 12px;
        color: var(--text-muted);
        margin: 0;
      }

      /* Workspace Ingestion Tabs */
      .tabs {
        display: flex;
        background: rgba(0, 0, 0, 0.2);
        border-radius: var(--radius-md);
        padding: 4px;
        border: 1px solid var(--border);
      }
      .tab-btn {
        flex: 1;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        border: none;
        background: transparent;
        color: var(--text-muted);
        font-family: var(--font);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: center;
        white-space: nowrap;
      }
      .tab-btn:hover {
        color: var(--text);
      }
      .tab-btn.active {
        background: var(--surface);
        color: var(--text);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }

      /* Form Elements */
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .form-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
      }
      .form-row-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .input-text, .select-input, .textarea-input {
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        color: var(--text);
        font-family: var(--font);
        font-size: 13px;
        outline: none;
        width: 100%;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .input-text:focus, .select-input:focus, .textarea-input:focus {
        border-color: var(--accent-info);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }
      .textarea-input {
        resize: vertical;
        min-height: 110px;
      }

      /* Enrichment Cards */
      .enrich-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .enrich-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .enrich-card.full-width {
        grid-column: span 2;
      }
      .enrich-card-title {
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border);
        border-radius: 99px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .tag.editable {
        cursor: pointer;
      }
      .tag.editable:hover {
        background: rgba(244, 63, 94, 0.1);
        border-color: var(--accent-danger);
        text-decoration: line-through;
      }
      .tag.add-new {
        background: transparent;
        border-style: dashed;
        color: var(--accent-info);
        cursor: pointer;
      }
      .tag.add-new:hover {
        background: rgba(59, 130, 246, 0.08);
      }

      .sentiment-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 99px;
        font-size: 12px;
        font-weight: 700;
        width: fit-content;
      }
      .sentiment-pill.positive {
        background: rgba(16, 185, 129, 0.1);
        color: var(--accent-success);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      .sentiment-pill.neutral {
        background: rgba(245, 158, 11, 0.1);
        color: var(--accent-warning);
        border: 1px solid rgba(245, 158, 11, 0.3);
      }
      .sentiment-pill.mixed {
        background: rgba(139, 92, 246, 0.1);
        color: var(--accent-purple);
        border: 1px solid rgba(139, 92, 246, 0.3);
      }
      .sentiment-pill.negative {
        background: rgba(244, 63, 94, 0.1);
        color: var(--accent-danger);
        border: 1px solid rgba(244, 63, 94, 0.3);
      }

      .checklist-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 12px;
      }
      .checklist-item input[type="checkbox"] {
        margin-top: 3px;
        cursor: pointer;
      }

      /* Workflow Nodes graph visualizer */
      .wf-flow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        overflow-x: auto;
        padding: 12px 6px;
        background: rgba(0, 0, 0, 0.15);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
      }
      .wf-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        position: relative;
        flex: 1;
        min-width: 76px;
      }
      .wf-node-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--bg-alt);
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted);
        transition: all 0.3s ease;
      }
      .wf-node.active .wf-node-icon {
        border-color: var(--accent-success);
        color: var(--accent-success);
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
      }
      .wf-node.current .wf-node-icon {
        border-color: var(--accent-info);
        color: var(--accent-info);
        background: rgba(59, 130, 246, 0.1);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        animation: pulse-node 1.6s infinite;
      }
      .wf-node-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        text-align: center;
      }
      .wf-node.active .wf-node-label, .wf-node.current .wf-node-label {
        color: var(--text);
      }
      .wf-arrow {
        color: var(--text-muted-2);
        font-weight: 800;
        font-size: 14px;
        user-select: none;
      }

      /* Agent Trace Explorer */
      .trace-exp-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
      .trace-exp-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 250px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .trace-card {
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .trace-meta {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
      }
      .trace-decision {
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
      }
      .trace-reason {
        font-size: 12px;
        color: var(--text-muted);
        line-height: 1.4;
      }

      /* Executive SVG Gauges & Dashboards */
      .gauge-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 16px;
        position: relative;
        flex: 1;
        min-width: 120px;
      }
      .gauge-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        text-align: center;
      }
      .gauge-subtext {
        font-size: 10px;
        color: var(--text-muted-2);
        text-align: center;
        margin-top: -4px;
      }

      /* Recommendation Workspace cards */
      .nba-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .nba-card {
        background: var(--surface-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        position: relative;
        box-shadow: var(--shadow);
        border-left: 5px solid var(--accent-info);
      }
      .nba-card.best {
        border-left-color: var(--accent-success);
      }
      .nba-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .nba-title-area h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: -0.2px;
        cursor: pointer;
      }
      .nba-title-area h4:hover {
        text-decoration: underline;
      }
      .nba-confidence {
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 99px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        color: var(--accent-info);
      }
      .nba-card.best .nba-confidence {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        color: var(--accent-success);
      }
      .nba-summary {
        font-size: 13px;
        line-height: 1.5;
        color: var(--text);
      }
      .nba-section {
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .nba-section-title {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
      }
      .nba-section-content {
        font-size: 12px;
        line-height: 1.45;
        color: var(--text-muted);
      }

      /* Evidence Explorer Cards */
      .evidence-card {
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .evidence-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .evidence-source {
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.05);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid var(--border);
      }
      .relevance-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
      }
      .relevance-bar {
        width: 60px;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 9px;
        overflow: hidden;
      }
      .relevance-bar-fill {
        height: 100%;
        background: var(--accent-info);
      }
      .evidence-excerpt {
        font-size: 12px;
        line-height: 1.45;
        color: var(--text-muted);
        border-left: 2px solid var(--border);
        padding-left: 8px;
        font-style: italic;
      }

      /* Human Review console */
      .review-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .review-status-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        padding: 12px 16px;
        border-radius: var(--radius-md);
      }
      .review-badge {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 99px;
      }
      .review-badge.pending {
        background: rgba(245, 158, 11, 0.1);
        color: var(--accent-warning);
        border: 1px solid rgba(245, 158, 11, 0.3);
      }
      .review-badge.approved {
        background: rgba(16, 185, 129, 0.1);
        color: var(--accent-success);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      .review-badge.rejected {
        background: rgba(244, 63, 94, 0.1);
        color: var(--accent-danger);
        border: 1px solid rgba(244, 63, 94, 0.3);
      }
      .review-badge.modified {
        background: rgba(139, 92, 246, 0.1);
        color: var(--accent-purple);
        border: 1px solid rgba(139, 92, 246, 0.3);
      }

      .review-history {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 180px;
        overflow-y: auto;
      }
      .review-history-item {
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 10px;
        font-size: 12px;
      }

      /* Clarifying Questions styling */
      .clarifying-box {
        background: rgba(245, 158, 11, 0.05);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: var(--radius-lg);
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .clarifying-q {
        font-size: 13px;
        font-weight: 700;
        color: var(--accent-warning);
      }

      /* Skeletons loader */
      .skeleton {
        animation: skeleton-glow 1.5s ease-in-out infinite;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-sm);
      }
      .skeleton-title {
        height: 20px;
        width: 60%;
        margin-bottom: 12px;
      }
      .skeleton-line {
        height: 12px;
        width: 90%;
        margin-bottom: 8px;
      }
      .skeleton-line.short {
        width: 45%;
      }

      /* Switch toggle for Dark/Light Mode */
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 22px;
      }
      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: var(--border);
        border-radius: 34px;
        transition: 0.2s;
      }
      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: var(--text);
        border-radius: 50%;
        transition: 0.2s;
      }
      input:checked + .toggle-slider {
        background-color: var(--accent-info);
      }
      input:checked + .toggle-slider:before {
        transform: translateX(18px);
      }

      /* Animations */
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(var(--accent-success-rgb), 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 8px rgba(var(--accent-success-rgb), 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(var(--accent-success-rgb), 0);
        }
      }
      @keyframes pulse-node {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
      @keyframes skeleton-glow {
        0%, 100% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.2;
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body>
    <div class="app">
      <!-- Error Notification Center -->
      <div id="alertContainer" style="display:none; flex-direction:column; gap:10px;"></div>

      <!-- Topbar Header -->
      <div class="topbar">
        <div class="brand">
          <div class="logo-icon"></div>
          <div class="brand-title">
            <h1>Decisio-AI</h1>
            <p>Enterprise Decision Intelligence Orchestration Platform</p>
          </div>
        </div>
        <div class="topbar-actions">
          <div class="pill-badge" id="ollamaPill" style="display: none;">
            <span class="dot-pulse orange" id="ollamaDot"></span>
            <span id="ollamaStatusText">Ollama Health Check</span>
          </div>
          <div class="pill-badge">
            <span class="dot-pulse" id="statusDot"></span>
            <span id="statusText">Ready</span>
          </div>
          <!-- Dark/Light Toggle -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Light Mode</span>
            <label class="toggle-switch">
              <input type="checkbox" id="themeToggle" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Presets Launchpad -->
      <div class="presets-bar">
        <div class="presets-title">One-Click Demo Presets</div>
        <div class="presets-list">
          <button class="btn" id="presetSaaSDicov">SaaS Discovery Notes</button>
          <button class="btn" id="presetPricing">Pricing Request Email</button>
          <button class="btn" id="presetSecurity">Security Audit Meeting</button>
          <button class="btn" id="presetCS">CS Ticket Transcript</button>
          <button class="btn" id="presetCSFollowup">Adoption Declining Email</button>
          <button class="btn" id="presetStaffing">Staffing Placement Opportunity</button>
        </div>
      </div>

      <!-- Main Columns Grid -->
      <div class="main-grid">
        <!-- Left: Input Workspace & Ingestion Center -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Workspace panel -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">1</span>Enterprise Input Workspace</h3>
                <p class="panel-subtitle">Ingest interactions from various business touchpoints</p>
              </div>
              <div style="display:flex; gap:8px;">
                <div class="form-group" style="flex-direction:row; align-items:center; gap:6px;">
                  <label class="form-label" style="margin:0;">Domain</label>
                  <select id="domainSelect" class="select-input" style="padding:6px 10px; width:150px;">
                    <option value="saas_sales">SaaS Sales</option>
                    <option value="customer_success">Customer Success</option>
                    <option value="staffing">Staffing Placement</option>
                    <option value="energy">Energy & Infra</option>
                  </select>
                </div>
                <div class="form-group" style="flex-direction:row; align-items:center; gap:6px;">
                  <label class="form-label" style="margin:0;">Customer ID</label>
                  <input type="text" id="customerIdInput" class="input-text" value="CUST-1001" style="padding:6px 10px; width:110px;" />
                </div>
              </div>
            </div>

            <!-- Workspace Tabs -->
            <div class="tabs">
              <button class="tab-btn active" data-tab="notes">Meeting Notes</button>
              <button class="tab-btn" data-tab="email">Email</button>
              <button class="tab-btn" data-tab="transcript">Sales Call Transcript</button>
              <button class="tab-btn" data-tab="crm">CRM Note</button>
              <button class="tab-btn" data-tab="conversation">General Conversation</button>
            </div>

            <!-- Dynamic Form Ingestion Fields -->
            <div id="dynamicFormContainer" style="display:flex; flex-direction:column; gap:14px;">
              <!-- Handled dynamically by JS -->
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:6px;">
              <div class="form-group" style="flex-direction:row; align-items:center; gap:8px;">
                <input type="file" id="fileInput" accept=".txt,.json" style="display:none;" />
                <button type="button" class="btn" onclick="document.getElementById('fileInput').click()">
                  📂 Load Ingestion File
                </button>
                <span id="fileUploadName" style="font-size:11px; color:var(--text-muted);"></span>
              </div>
              <button class="btn primary" id="executeBtn" style="padding:12px 24px; font-size:14px;">
                🚀 Execute Agent Orchestrator
              </button>
            </div>
          </div>

          <!-- AI Enrichment panel -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">2</span>AI Enrichment Panel</h3>
                <p class="panel-subtitle">Ingestion preprocessing and intent categorization</p>
              </div>
            </div>
            <div class="enrich-grid" id="enrichmentContainer">
              <!-- Handled dynamically by JS -->
              <div style="grid-column: span 2; text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">
                Execute the orchestrator to view preprocessed AI insights.
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Orchestration Trace & Recommendation Cards -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- State Machine Node Visualization -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">3</span>Workflow Engine State</h3>
                <p class="panel-subtitle">Visualizing real-time specialized agent orchestration</p>
              </div>
            </div>
            <div class="wf-flow" id="workflowFlowContainer">
              <!-- Handled dynamically by JS -->
            </div>

            <!-- Collapsible Agent Trace Explorer -->
            <div class="trace-card" style="border-style:dashed;">
              <div class="trace-exp-header" id="traceToggleBtn">
                <span class="form-label" style="display:flex; align-items:center; gap:6px;">
                  📋 Agent Trace Explorer <span id="traceRouteBadge" style="font-size:9px; background:var(--accent-info-glow); color:var(--accent-info); padding:2px 6px; border-radius:4px; font-weight:700;">No Run</span>
                </span>
                <span id="traceToggleChevron" style="font-size:12px;">▼</span>
              </div>
              <div class="trace-exp-content" id="traceExplContainer" style="display:none; margin-top:10px;">
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 10px;">
                  No active trace logs. Start the engine to review records.
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendation Workspace -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">4</span>Recommendation Workspace</h3>
                <p class="panel-subtitle">Curated next best actions grounded in enterprise knowledge</p>
              </div>
            </div>
            <div class="nba-list" id="recommendationContainer">
              <!-- Handled dynamically by JS -->
              <div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 40px 20px;">
                No recommendations calculated. Submit context in the workspace to begin.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle: Dynamic Gaps & Questions -->
      <div id="clarifyingQuestionsContainer" style="display:none;" class="clarifying-box animate">
        <!-- Rendered dynamically -->
      </div>

      <!-- Lower: Evidence, Review & Dashboards -->
      <div class="dashboard-grid">
        <!-- Left Column: Evidence Explorer & Memory timeline -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Evidence Explorer -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">5</span>Evidence Explorer</h3>
                <p class="panel-subtitle">Playbook articles and historical CRM record verification</p>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;" id="evidenceContainer">
              <!-- Handled dynamically by JS -->
              <div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">
                Evidence logs will display here when recommendations are generated.
              </div>
            </div>
          </div>

          <!-- Organizational Memory Dashboard -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">6</span>Organizational Memory Dashboard</h3>
                <p class="panel-subtitle">Continual learning feedback loop based on past approvals</p>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <!-- Stats summary -->
              <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; text-align:center;">
                <div style="background:rgba(0,0,0,0.15); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px;">
                  <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Runs Analyzed</div>
                  <div style="font-size:20px; font-weight:800; margin-top:4px;" id="memTotalRuns">0</div>
                </div>
                <div style="background:rgba(0,0,0,0.15); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px;">
                  <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Approval Rate</div>
                  <div style="font-size:20px; font-weight:800; color:var(--accent-success); margin-top:4px;" id="memApprovalRate">0%</div>
                </div>
                <div style="background:rgba(0,0,0,0.15); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px;">
                  <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Learned Insights</div>
                  <div style="font-size:20px; font-weight:800; color:var(--accent-purple); margin-top:4px;" id="memInsightsCount">0</div>
                </div>
              </div>

              <!-- Insights log -->
              <div class="form-label" style="margin-top:6px;">Learned Insights Timeline</div>
              <div id="memoryTimeline" style="display:flex; flex-direction:column; gap:8px; max-height: 200px; overflow-y:auto; padding-right:4px;">
                <!-- Handled dynamically by JS -->
                <div style="font-size:12px; color:var(--text-muted); font-style:italic;">No records loaded yet.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Human Review Gate & Executive KPIs -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Human Review Center -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">7</span>Human Review Center</h3>
                <p class="panel-subtitle">Review, modify, or reject recommended workflows</p>
              </div>
            </div>
            <div class="review-card">
              <div class="review-status-header">
                <div>
                  <div style="font-size:13px; font-weight:700;" id="reviewTitle">Awaiting Run</div>
                  <div style="font-size:11px; color:var(--text-muted);" id="reviewIdLabel">Run ID: None</div>
                </div>
                <div class="review-badge pending" id="reviewBadge">No Session</div>
              </div>

              <div class="form-group">
                <label class="form-label">Reviewer Notes</label>
                <textarea id="reviewNotesInput" class="textarea-input" style="min-height:70px;" placeholder="Capture details of your decision context (e.g., specific constraints, approval caveats)..."></textarea>
              </div>

              <div style="display:flex; gap:10px;">
                <button class="btn success" id="btnApproveRun" style="flex:1;" disabled>👍 Approve Run</button>
                <button class="btn" id="btnModifyRun" style="flex:1; border-color:var(--accent-purple); color:var(--accent-purple); background:rgba(139,92,246,0.05);" disabled>✍️ Modify & Rerun</button>
                <button class="btn danger" id="btnRejectRun" style="flex:1;" disabled>👎 Reject Run</button>
              </div>

              <!-- Local Review History -->
              <div class="form-label" style="margin-top:6px;">Approval Audit Trail</div>
              <div class="review-history" id="reviewHistoryLogs">
                <div style="font-size:12px; color:var(--text-muted); font-style:italic; text-align:center; padding:10px;">Audit logs are empty.</div>
              </div>
            </div>
          </div>

          <!-- Executive Dashboard -->
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title"><span class="number">8</span>Executive KPI Analytics</h3>
                <p class="panel-subtitle">Gauging dynamic metric impact and confidence benchmarks</p>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:14px;">
              <!-- Gauges Container -->
              <div style="display:flex; flex-wrap:wrap; gap:14px;" id="executiveGaugesContainer">
                <!-- Initial Gauges -->
                <div class="gauge-container">
                  <div class="gauge-label">Impact Metric</div>
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="var(--border)" stroke-width="8" fill="none" />
                  </svg>
                  <div class="gauge-subtext">Waiting for Run</div>
                </div>
                <div class="gauge-container">
                  <div class="gauge-label">Confidence</div>
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="var(--border)" stroke-width="8" fill="none" />
                  </svg>
                  <div class="gauge-subtext">Waiting for Run</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- UI Logic Scripts -->
    <script>
      // Global App State
      const state = {
        activeTab: 'notes',
        currentData: null,
        currentAnswers: {},
        traceExpanded: false,
        theme: 'dark',
        reviewHistory: JSON.parse(localStorage.getItem('review_history') || '[]'),
        editableActions: {}, // stores inline overrides
        addedTopics: []
      };

      // Scenario presets data
      const presets = {
        notes: {
          domain: 'saas_sales',
          customerId: 'CUST-1001',
          date: '2026-06-28',
          context: 'Acme Corp discovery call regarding manual reporting pain',
          attendees: 'Jordan Lee (VP Ops), Priya Shah (IT Security), Sales team',
          notes: \`Attendees: Jordan Lee (VP Ops), Priya Shah(IT Security), Sales team.

- VP Ops confirmed manual reporting takes 4 hours per week.Wants time - to - report under 15 minutes.
- No internal champion identified yet; Jordan is interested but not the signer.
- Priya raised SSO and SOC2 review requirements before pilot.
- Competitor X mentioned as incumbent for analytics.

Action items:
  - Send MAP draft within 48 hours
    - Follow up with security packet for Priya\`
        },
        pricing: {
          domain: 'saas_sales',
          customerId: 'CUST-1020',
          subject: 'Pricing proposal and subscription plans',
          from: 'Taylor Vance <taylor.vance@vanguard-retail.com>',
          body: \`Hi team, we reviewed the initial discovery notes.Can you share detailed pricing options for 50 + seats ? We need to know if there's a volume discount and what the contract length is.

We also need to clarify support SLAs, as our operations team runs 24 / 7.

Thanks,
  Taylor\`
        },
        security: {
          domain: 'saas_sales',
          customerId: 'CUST-1001',
          date: '2026-06-25',
          context: 'IT Security deep-dive and Okta integration',
          attendees: 'Priya Shah (IT Security), Security Architect, Decisio Team',
          notes: \`Attendees: Priya Shah(IT Security), Security Architect.

- Priya requested SOC2 Type II report and SSO integration guides.
- Stated security review usually takes 2 - 3 weeks, but we can expedite if pre - packaged security folder is provided.
- SSO must support Okta.

Open Questions:
- Do you store PII in your database ?
  - What is the data retention policy ? \`
        },
        cs_transcript: {
          domain: 'customer_success',
          customerId: 'CUST-2042',
          transcript: \`CSM: Thanks for joining — I wanted to check in on adoption.

  Alex(Customer): Honestly we're frustrated. Support tickets are up 40% and usage dropped the last two weeks.

CSM: Which workflows are breaking for your team ?

  Alex(Customer) : Finance users can't get reports out on time. When does the renewal conversation start? We're at - risk if this continues.

    CSM: Action item — schedule a recovery working session this week.

      Alex(Customer): Who from product can join to review the failing workflow ? \`
        },
        cs_followup: {
          domain: 'customer_success',
          customerId: 'CUST-2005',
          subject: 'Urgent: Declining engagement and reporting errors',
          from: 'Morgan Drake, Director of CS <morgan.drake@innovatech.com>',
          body: \`Hello team, we are seeing recurring errors in the reporting module since the last release.Several team members have stopped logging in, and our usage has declined by 20 %.

We need this fixed before our QBR next month.Can we set up a call with your engineering leads to resolve this issue ?

  Regards,
  Morgan\`
        },
        staffing_conv: {
          domain: 'staffing',
          customerId: 'CUST-STAFF-01',
          text: \`Urgent open req for RN(Registered Nurse) at St.Jude Hospital.Need submittals by Friday.Compliance verification pending.Competitor active on the account.\`
        }
      };

      // Form layouts per tab
      const formLayouts = {
        notes: \`
  < div class="form-row-grid" >
            <div class="form-group">
              <label class="form-label">Meeting Date</label>
              <input type="text" id="meetDate" class="input-text" placeholder="YYYY-MM-DD" />
            </div>
            <div class="form-group">
              <label class="form-label">Attendees</label>
              <input type="text" id="meetAttendees" class="input-text" placeholder="Attendee names..." />
            </div>
          </div >
          <div class="form-group">
            <label class="form-label">Meeting Context</label>
            <input type="text" id="meetContext" class="input-text" placeholder="e.g. Discovery call..." />
          </div>
          <div class="form-group">
            <label class="form-label">Meeting Notes</label>
            <textarea id="meetNotes" class="textarea-input" placeholder="Paste meeting notes here..."></textarea>
          </div>
\`,
        email: \`
  < div class="form-row-grid" >
            <div class="form-group">
              <label class="form-label">Email From</label>
              <input type="text" id="emailFrom" class="input-text" placeholder="Sender name and email..." />
            </div>
            <div class="form-group">
              <label class="form-label">Email Subject</label>
              <input type="text" id="emailSubject" class="input-text" placeholder="Subject..." />
            </div>
          </div >
  <div class="form-group">
    <label class="form-label">Email Body</label>
    <textarea id="emailBody" class="textarea-input" placeholder="Paste email content here..."></textarea>
  </div>
\`,
        transcript: \`
  < div class="form-group" >
            <label class="form-label">Speaker transcript</label>
            <textarea id="transcriptText" class="textarea-input" style="min-height:160px;" placeholder="CSM: Hello...\\nCustomer: Hi..."></textarea>
          </div >
  \`,
        crm: \`
  < div class="form-group" >
            <label class="form-label">CRM Activity / Log Note</label>
            <textarea id="crmNotes" class="textarea-input" style="min-height:160px;" placeholder="Log notes about CRM opportunities or customer complaints..."></textarea>
          </div >
  \`,
        conversation: \`
  < div class="form-group" >
            <label class="form-label">Raw Interaction Text</label>
            <textarea id="generalText" class="textarea-input" style="min-height:160px;" placeholder="Type or paste any general unstructured conversation logs here..."></textarea>
          </div >
  \`
      };

      // Initialization on Load
      document.addEventListener('DOMContentLoaded', () => {
        setupTabListeners();
        renderActiveForm();
        setupAlertHandling();
        setupThemeToggle();
        setupPresetListeners();
        setupTraceToggle();
        setupReviewActions();
        loadSystemHealth();
        renderReviewHistory();
        
        // Load default preset on startup
        loadPreset('notes', presets.notes);
      });

      // Dark/Light Theme Switching
      function setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        toggle.addEventListener('change', () => {
          if (toggle.checked) {
            document.body.classList.add('light-mode');
            state.theme = 'light';
          } else {
            document.body.classList.remove('light-mode');
            state.theme = 'dark';
          }
        });
      }

      // Check System Connectivity & Ollama health
      async function loadSystemHealth() {
        try {
          const res = await fetch('/ollama/health');
          const data = await res.json();
          const dot = document.getElementById('ollamaDot');
          const text = document.getElementById('ollamaStatusText');
          
          if (data.ok) {
            if (dot) dot.className = 'dot-pulse';
            if (text) text.innerHTML = \`Ollama Connected (\${data.model || 'llama3.2'})\`;
          } else {
            if (dot) dot.className = 'dot-pulse orange';
            if (text) text.innerHTML = \`Ollama Offline (Deterministic Fallback active)\`;
          }
        } catch (e) {
          const dot = document.getElementById('ollamaDot');
          const text = document.getElementById('ollamaStatusText');
          if (dot) dot.className = 'dot-pulse red';
          if (text) text.innerHTML = 'Backend Connection Error';
          triggerAlert('error', 'Backend Unreachable', 'Could not establish connection to the Decisio-AI backend server at ' + backendUrl + '. Please make sure the backend container is running.');
        }
      }

      // Alert Banner Controller
      function setupAlertHandling() {
        window.triggerAlert = (type, title, message) => {
          const container = document.getElementById('alertContainer');
          container.style.display = 'flex';
          
          const banner = document.createElement('div');
          banner.className = \`alert-banner \${type}\`;
          banner.innerHTML = \`
            <span style="font-size:16px;">\${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <div>
              <strong style="display:block;">\${escapeHtml(title)}</strong>
              <span>\${escapeHtml(message)}</span>
            </div>
            <button class="btn ghost" style="margin-left:auto; padding:4px 8px; border:none;" onclick="this.parentElement.remove()">✕</button>
          \`;
          container.appendChild(banner);
          
          // Auto remove after 10 seconds
          setTimeout(() => banner.remove(), 10000);
        };
      }

      // Tab switcher management
      function setupTabListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeTab = btn.getAttribute('data-tab');
            renderActiveForm();
          });
        });
      }

      // Renders selected workspace tab inputs
      function renderActiveForm() {
        const container = document.getElementById('dynamicFormContainer');
        container.innerHTML = formLayouts[state.activeTab];

        // Bind file loader change triggers for manual uploads
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          document.getElementById('fileUploadName').textContent = file.name;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target.result;
            if (file.name.endsWith('.json')) {
              try {
                const parsed = JSON.parse(content);
                // Prefill fields if structured json is provided
                if (parsed.customer_id) document.getElementById('customerIdInput').value = parsed.customer_id;
                if (parsed.domain) document.getElementById('domainSelect').value = parsed.domain;
                
                if (parsed.meeting_notes || parsed.meeting_date) {
                  switchTab('notes');
                  setTimeout(() => {
                    if (document.getElementById('meetDate')) document.getElementById('meetDate').value = parsed.meeting_date || '';
                    if (document.getElementById('meetContext')) document.getElementById('meetContext').value = parsed.meeting_context || '';
                    if (document.getElementById('meetAttendees')) document.getElementById('meetAttendees').value = parsed.participants ? parsed.participants.join(', ') : '';
                    if (document.getElementById('meetNotes')) document.getElementById('meetNotes').value = parsed.meeting_notes || '';
                  }, 50);
                } else if (parsed.email_body || parsed.email_subject) {
                  switchTab('email');
                  setTimeout(() => {
                    if (document.getElementById('emailFrom')) document.getElementById('emailFrom').value = parsed.email_from || '';
                    if (document.getElementById('emailSubject')) document.getElementById('emailSubject').value = parsed.email_subject || '';
                    if (document.getElementById('emailBody')) document.getElementById('emailBody').value = parsed.email_body || '';
                  }, 50);
                } else if (parsed.transcript) {
                  switchTab('transcript');
                  setTimeout(() => {
                    if (document.getElementById('transcriptText')) document.getElementById('transcriptText').value = parsed.transcript || '';
                  }, 50);
                } else if (parsed.interaction_text) {
                  switchTab('conversation');
                  setTimeout(() => {
                    if (document.getElementById('generalText')) document.getElementById('generalText').value = parsed.interaction_text || '';
                  }, 50);
                }
              } catch (err) {
                // If parsing fails, dump raw text into the current tab text area
                fillCurrentAreaText(content);
              }
            } else {
              fillCurrentAreaText(content);
            }
          };
          reader.readAsText(file);
        });
      }

      function switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
          if (btn.getAttribute('data-tab') === tabId) {
            btn.click();
          }
        });
      }

      function fillCurrentAreaText(txt) {
        const area = document.querySelector('.textarea-input');
        if (area) area.value = txt;
      }

      // Presets logic binding
      function setupPresetListeners() {
        document.getElementById('presetSaaSDicov').addEventListener('click', () => {
          switchTab('notes');
          loadPreset('notes', presets.notes);
          executeOrchestrator();
        });
        document.getElementById('presetPricing').addEventListener('click', () => {
          switchTab('email');
          loadPreset('email', presets.pricing);
          executeOrchestrator();
        });
        document.getElementById('presetSecurity').addEventListener('click', () => {
          switchTab('notes');
          loadPreset('notes', presets.security);
          executeOrchestrator();
        });
        document.getElementById('presetCS').addEventListener('click', () => {
          switchTab('transcript');
          loadPreset('transcript', presets.cs_transcript);
          executeOrchestrator();
        });
        document.getElementById('presetCSFollowup').addEventListener('click', () => {
          switchTab('email');
          loadPreset('email', presets.cs_followup);
          executeOrchestrator();
        });
        document.getElementById('presetStaffing').addEventListener('click', () => {
          switchTab('conversation');
          loadPreset('conversation', presets.staffing_conv);
          executeOrchestrator();
        });
      }

      function loadPreset(tab, data) {
        document.getElementById('domainSelect').value = data.domain;
        document.getElementById('customerIdInput').value = data.customerId || 'CUST-1001';
        
        if (tab === 'notes') {
          if (document.getElementById('meetDate')) document.getElementById('meetDate').value = data.date || '';
          if (document.getElementById('meetContext')) document.getElementById('meetContext').value = data.context || '';
          if (document.getElementById('meetAttendees')) document.getElementById('meetAttendees').value = data.attendees || '';
          if (document.getElementById('meetNotes')) document.getElementById('meetNotes').value = data.notes || '';
        } else if (tab === 'email') {
          if (document.getElementById('emailFrom')) document.getElementById('emailFrom').value = data.from || '';
          if (document.getElementById('emailSubject')) document.getElementById('emailSubject').value = data.subject || '';
          if (document.getElementById('emailBody')) document.getElementById('emailBody').value = data.body || '';
        } else if (tab === 'transcript') {
          if (document.getElementById('transcriptText')) document.getElementById('transcriptText').value = data.transcript || '';
        } else if (tab === 'conversation') {
          if (document.getElementById('generalText')) document.getElementById('generalText').value = data.text || '';
        }
      }

      // Collect form data and structure it to backend format
      function compilePayload() {
        const customerId = document.getElementById('customerIdInput').value.trim() || 'CUST-1001';
        const domain = document.getElementById('domainSelect').value;
        const payload = { customer_id: customerId, domain: domain };

        if (state.activeTab === 'notes') {
          payload.source_type = 'meeting_notes';
          payload.meeting_date = document.getElementById('meetDate')?.value || '';
          payload.meeting_context = document.getElementById('meetContext')?.value || '';
          payload.meeting_notes = document.getElementById('meetNotes')?.value || '';
        } else if (state.activeTab === 'email') {
          payload.source_type = 'email';
          payload.email_from = document.getElementById('emailFrom')?.value || '';
          payload.email_subject = document.getElementById('emailSubject')?.value || '';
          payload.email_body = document.getElementById('emailBody')?.value || '';
        } else if (state.activeTab === 'transcript') {
          payload.source_type = 'transcript';
          payload.transcript = document.getElementById('transcriptText')?.value || '';
        } else if (state.activeTab === 'crm') {
          payload.source_type = 'crm_notes';
          payload.interaction_text = document.getElementById('crmNotes')?.value || '';
        } else {
          payload.source_type = 'conversation';
          payload.interaction_text = document.getElementById('generalText')?.value || '';
        }

        return payload;
      }

      // Execute button listener
      document.getElementById('executeBtn').addEventListener('click', () => {
        executeOrchestrator();
      });

      // Main Orchestration Fetch trigger
      async function executeOrchestrator(extraData = {}) {
        showLoadingState();
        try {
          const payload = { ...compilePayload(), ...extraData };
          const response = await fetch('/workflow/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            const errBody = await response.json();
            throw new Error(errBody.error || 'Server ingestion error');
          }
          
          const data = await response.json();
          state.currentData = data;
          state.editableActions = {}; // reset inline overrides
          state.addedTopics = [];
          
          renderAllComponents();
          
        } catch (e) {
          console.error(e);
          resetStateText('Error occurred');
          // triggerAlert('error', 'Execution Failed', e.message || 'Unable to connect to the backend server. Verify docker-compose services.');
        }
      }

      // Skeletons Loader and wait screen logic
      function showLoadingState() {
        document.getElementById('statusText').textContent = 'Orchestrating...';
        document.getElementById('statusDot').className = 'dot-pulse orange';

        // Skeletons for AI Enrichment
        document.getElementById('enrichmentContainer').innerHTML = \`
          <div class="enrich-card skeleton-card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div></div>
          <div class="enrich-card skeleton-card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div></div>
          <div class="enrich-card full-width"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div>
        \`;

        // Skeletons for Recommendation list
        document.getElementById('recommendationContainer').innerHTML = \`
          <div class="nba-card" style="border-left-color:var(--border);"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div>
          <div class="nba-card" style="border-left-color:var(--border);"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div>
        \`;

        // Skeletons for Evidence
        document.getElementById('evidenceContainer').innerHTML = \`
          <div class="evidence-card"><div class="skeleton skeleton-title" style="width:30%"></div><div class="skeleton skeleton-line"></div></div>
        \`;

        // Clean nodes flow
        document.getElementById('workflowFlowContainer').innerHTML = \`
          <div class="wf-node current"><div class="wf-node-icon">PA</div><div class="wf-node-label">Planner</div></div>
          <div class="wf-arrow">→</div>
          <div class="wf-node"><div class="wf-node-icon">...</div><div class="wf-node-label">Queued</div></div>
        \`;
      }

      function resetStateText(text = 'Ready') {
        document.getElementById('statusText').textContent = text;
        document.getElementById('statusDot').className = 'dot-pulse';
      }

      // Renders all UI boards when data is received
      function renderAllComponents() {
        if (!state.currentData) return;
        const d = state.currentData;

        resetStateText('Analysis Completed');
        document.getElementById('statusDot').className = 'dot-pulse';

        // 1. Render AI Ingestion Enrichment
        renderEnrichmentPanel();

        // 2. Render Workflow node graph & Agent Trace Explorer
        renderWorkflowVisualization();

        // 3. Render Recommendation cards
        renderRecommendationCards();

        // 4. Render Evidence Explorer
        renderEvidenceExplorer();

        // 5. Render Clarifying Questions (if gaps detected)
        renderClarifyingQuestions();

        // 6. Render Human Review Center status
        setHumanReviewUI();

        // 7. Render dashboards (Memory and Executive)
        renderDashboards();
      }

      // Ingestion Enrichment Panel Rendering
      function renderEnrichmentPanel() {
        const container = document.getElementById('enrichmentContainer');
        const enrichment = state.currentData.explanation_bundle.ingestion_enrichment || {};
        
        const detectedFormat = enrichment.detected_format || 'unstructured';
        const sentiment = enrichment.sentiment || 'neutral';
        const topics = [...(enrichment.topics || []), ...state.addedTopics];
        const participants = enrichment.participants || [];
        const actionItems = enrichment.action_items_mentioned || [];
        const openQuestions = enrichment.open_questions || [];

        // Build HTML
        let html = \`
          <!-- Detected Format & Source -->
          <div class="enrich-card">
            <div class="enrich-card-title">📁 Ingestion Category</div>
            <div style="font-size:16px; font-weight:800; text-transform:capitalize;">\${detectedFormat} Ingest</div>
            <div style="font-size:11px; color:var(--text-muted);">Source Type: \${enrichment.source_type || 'General'}</div>
          </div>

          <!-- Sentiment Enrichment -->
          <div class="enrich-card">
            <div class="enrich-card-title">🎭 Ingestion Sentiment</div>
            <div style="margin-top:4px;">
              <span class="sentiment-pill \${sentiment}">
                \${sentiment === 'positive' ? '🟢 Positive' : sentiment === 'mixed' ? '🟣 Mixed' : sentiment === 'negative' ? '🔴 Negative' : '🟡 Neutral'}
              </span>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Inferred from context heuristics</div>
          </div>

          <!-- Topics tag cloud (with editable tags) -->
          <div class="enrich-card full-width">
            <div class="enrich-card-title">🏷️ Topics Detected (Click to remove)</div>
            <div class="tag-cloud" style="margin-top:6px;">
              \${topics.map(t => \`<span class="tag editable" onclick="removeTopic('\${escapeQuote(t)}')"># \${escapeHtml(t)} ✕</span>\`).join('')}
              <span class="tag add-new" onclick="addNewTopic()">+ Add Topic</span>
            </div>
          </div>

          <!-- Participants -->
          <div class="enrich-card full-width">
            <div class="enrich-card-title">👥 Participants Identified</div>
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">
              \${participants.length > 0 
                ? participants.map(p => \`
                    <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
                      <div style="width:24px; height:24px; border-radius:50%; background:var(--accent-info-glow); color:var(--accent-info); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:10px;">
                        \${getInitials(p)}
                      </div>
                      <span style="font-weight:600;">\${escapeHtml(p)}</span>
                    </div>
                  \`).join('')
                : '<span style="font-size:12px; color:var(--text-muted); font-style:italic;">No named participants extracted</span>'
              }
            </div>
          </div>

          <!-- Action Items Checklist -->
          <div class="enrich-card full-width">
            <div class="enrich-card-title">✅ Transcribed Action Items</div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
              \${actionItems.length > 0
                ? actionItems.map((item, i) => \`
                    <label class="checklist-item">
                      <input type="checkbox" checked />
                      <span>\${escapeHtml(item)}</span>
                    </label>
                  \`).join('')
                : '<span style="font-size:12px; color:var(--text-muted); font-style:italic;">No direct action items identified in text</span>'
              }
            </div>
          </div>
        \`;
        container.innerHTML = html;
      }

      function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      }

      // Clickable tag cloud updates
      window.removeTopic = (topicName) => {
        const enrichment = state.currentData.explanation_bundle.ingestion_enrichment || {};
        if (enrichment.topics && enrichment.topics.includes(topicName)) {
          enrichment.topics = enrichment.topics.filter(t => t !== topicName);
        }
        state.addedTopics = state.addedTopics.filter(t => t !== topicName);
        renderEnrichmentPanel();
      };

      window.addNewTopic = () => {
        const name = prompt("Enter new topic tag:");
        if (name && name.trim()) {
          state.addedTopics.push(name.trim());
          renderEnrichmentPanel();
        }
      };

      function escapeQuote(str) {
        return str.replace(/'/g, "\\'");
      }

      // Workflow state nodes rendering
      function renderWorkflowVisualization() {
        const flowContainer = document.getElementById('workflowFlowContainer');
        const trace = state.currentData.explanation_bundle.agent_trace || [];
        const orch = state.currentData.explanation_bundle.orchestration || {};
        
        // Dynamic route display badge
        const badge = document.getElementById('traceRouteBadge');
        badge.textContent = \`Route: \${(orch.route || 'standard').toUpperCase()} workflow\`;

        // Predefined full pipeline stages
        const stagesList = [
          { key: 'planner', label: 'Planner', abbr: 'PA' },
          { key: 'analyzer', label: 'Analyzer', abbr: 'AA' },
          { key: 'staffing_domain', label: 'Domain', abbr: 'DA' },
          { key: 'retriever', label: 'Retriever', abbr: 'RA' },
          { key: 'memory', label: 'Memory', abbr: 'MA' },
          { key: 'recommender', label: 'Recommender', abbr: 'REC' },
          { key: 'explainer', label: 'Explainer', abbr: 'EA' }
        ];

        // Filter stages based on current execution trace (only show executing agents or standard fallback path)
        const traceNames = trace.map(t => t.agent_name);
        // Include staffing agent or memory depending on domain
        const activeStages = stagesList.filter(stage => {
          if (stage.key === 'planner') return true;
          // If the agent was recorded in the execution trace, include it
          if (traceNames.includes(stage.key)) return true;
          // If route is fast_faq, skip analyzer, memory, recommender
          if (orch.route === 'fast_faq' && ['analyzer', 'memory', 'recommender', 'staffing_domain'].includes(stage.key)) return false;
          // If staffing domain is not run, exclude it
          if (stage.key === 'staffing_domain' && state.currentData.domain !== 'staffing') return false;
          
          return true;
        });

        let flowHtml = '';
        activeStages.forEach((stage, idx) => {
          // Check if this agent is in trace
          let isActive = false;
          let isCurrent = false;
          
          if (stage.key === 'planner') {
            isActive = true;
          } else {
            const index = traceNames.indexOf(stage.key);
            if (index !== -1) {
              isActive = true;
              if (index === traceNames.length - 1) isCurrent = true;
            }
          }

          flowHtml += \`
            <div class="wf-node \${isActive ? 'active' : ''} \${isCurrent ? 'current' : ''}" onclick="focusTraceAgent('\${stage.key}')">
              <div class="wf-node-icon">\${stage.abbr}</div>
              <div class="wf-node-label">\${stage.label}</div>
            </div>
          \`;

          if (idx < activeStages.length - 1) {
            flowHtml += '<div class="wf-arrow">→</div>';
          }
        });
        flowContainer.innerHTML = flowHtml;

        // Render Trace list cards
        renderTraceList();
      }

      // Trace logs listing
      function renderTraceList() {
        const container = document.getElementById('traceExplContainer');
        const trace = state.currentData.explanation_bundle.agent_trace || [];
        
        if (trace.length === 0) {
          container.innerHTML = \`<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 10px;">No trace logs recorded.</div>\`;
          return;
        }

        container.innerHTML = trace.map(entry => {
          const tools = (entry.tool_usage || []).map(t => t.tool_name).join(', ');
          const hasError = !!entry.errors;
          return \`
            <div class="trace-card" id="trace-card-\${entry.agent_name}" style="\${hasError ? 'border-color:var(--accent-danger);' : ''}">
              <div class="trace-meta">
                <span>Agent: \${escapeHtml(entry.agent_name).toUpperCase()}</span>
                <span>⏱️ \${entry.duration_ms} ms</span>
              </div>
              <div class="trace-decision">Decision: \${escapeHtml(entry.decision || 'No Decision')}</div>
              <div class="trace-reason"><strong>Reason:</strong> \${escapeHtml(entry.reason)}</div>
              \${entry.confidence != null ? \`<div style="font-size:11px; font-weight:700;">Confidence: \${Math.round(entry.confidence * 100)}%</div>\` : ''}
              \${tools ? \`<div style="font-size:11px; color:var(--accent-purple);">Tools Used: \${escapeHtml(tools)}</div>\` : ''}
              \${entry.errors ? \`<div style="font-size:11px; color:var(--accent-danger); font-weight:bold;">Errors: \${escapeHtml(entry.errors)}</div>\` : ''}
            </div>
          \`;
        }).join('');
      }

      // Allow clicking nodes to focus/scroll to details
      window.focusTraceAgent = (agentKey) => {
        toggleTrace(true);
        const card = document.getElementById('trace-card-' + agentKey);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          card.style.borderColor = 'var(--accent-info)';
          setTimeout(() => card.style.borderColor = '', 1500);
        }
      };

      // Trace Panel Accordion Toggle
      function setupTraceToggle() {
        const toggleBtn = document.getElementById('traceToggleBtn');
        toggleBtn.addEventListener('click', () => {
          toggleTrace(!state.traceExpanded);
        });
      }

      function toggleTrace(expand) {
        state.traceExpanded = expand;
        const cont = document.getElementById('traceExplContainer');
        const chev = document.getElementById('traceToggleChevron');
        if (state.traceExpanded) {
          cont.style.display = 'flex';
          chev.textContent = '▲';
        } else {
          cont.style.display = 'none';
          chev.textContent = '▼';
        }
      }

      // Recommendation business cards rendering
      function renderRecommendationCards() {
        const container = document.getElementById('recommendationContainer');
        const actions = state.currentData.next_best_actions || [];
        const customerId = state.currentData.customer_id;
        const domain = state.currentData.domain;

        if (actions.length === 0) {
          container.innerHTML = \`<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">No recommendations found.</div>\`;
          return;
        }

        container.innerHTML = actions.map((action, idx) => {
          const overrides = state.editableActions[action.action_id] || {};
          const displayTitle = overrides.title || action.title;
          const displaySummary = overrides.summary || action.summary;
          const isBest = idx === 0;

          // Deduplicate and pull unique sources for this card
          const sources = (action.evidence || []).map(e => e.source.split(':').pop());
          const uniqueSources = [...new Set(sources)];

          return \`
            <div class="nba-card \${isBest ? 'best' : ''}">
              <div class="nba-header">
                <div class="nba-title-area">
                  <span class="form-label" style="color: \${isBest ? 'var(--accent-success)' : 'var(--accent-info)'}">Recommendation Step \${idx + 1} \${isBest ? '★ Top Action' : ''}</span>
                  <h4 onclick="editCardInline('\${action.action_id}')" title="Click to edit action title inline">
                    \${escapeHtml(displayTitle)} ✏️
                  </h4>
                </div>
                <div class="nba-confidence">\${Math.round(action.confidence * 100)}% Match</div>
              </div>

              <div class="nba-summary" onclick="editCardInline('\${action.action_id}')" title="Click to edit action summary inline">
                \${escapeHtml(displaySummary)}
              </div>

              <!-- Metrics impact summary -->
              <div style="font-size:11px; font-weight:700; color:var(--accent-primary); display:flex; align-items:center; gap:4px;">
                🎯 Business Impact: Estimated to improve outcome parameters with Playbook alignment
              </div>

              <!-- Scaffolding Rationale -->
              <div class="nba-section" style="border-left:3px solid var(--accent-primary);">
                <div class="nba-section-title">Scaffolding Rationale & Citations</div>
                <div class="nba-section-content">\${escapeHtml(action.rationale)}</div>
                \${uniqueSources.length > 0 ? \`<div style="font-size:10px; font-weight:700; margin-top:4px;">Grounded Sources: \${uniqueSources.join(', ')}</div>\` : ''}
              </div>

              <!-- Recommended next questions -->
              \${action.recommended_next_questions && action.recommended_next_questions.length > 0 
                ? \`
                  <div class="nba-section">
                    <div class="nba-section-title">Recommended Next Discovery Questions</div>
                    <ul style="margin:4px 0 0 0; padding-left:16px; font-size:12px; color:var(--text-muted);">
                      \${action.recommended_next_questions.map(q => \`<li>\${escapeHtml(q)}</li>\`).join('')}
                    </ul>
                  </div>
                \`
                : ''
              }

              <!-- Step feedback button group -->
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; margin-top:4px;">
                <span id="step-fb-msg-\${idx}" style="font-size:11px; color:var(--text-muted-2);">Was this recommendation step helpful?</span>
                <div style="display:flex; gap:8px;">
                  <button class="btn" style="padding:6px 12px; font-size:11px;" onclick="submitStepFeedback('\${customerId}', '\${domain}', '\${escapeQuote(displayTitle)}', 'approved', \${idx})">👍 Yes</button>
                  <button class="btn" style="padding:6px 12px; font-size:11px;" onclick="submitStepFeedback('\${customerId}', '\${domain}', '\${escapeQuote(displayTitle)}', 'rejected', \${idx})">👎 No</button>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      }

      // Inline recommendation editing for Premium review
      window.editCardInline = (actionId) => {
        const action = state.currentData.next_best_actions.find(a => a.action_id === actionId);
        if (!action) return;

        const currentOverrides = state.editableActions[actionId] || {};
        const titleVal = currentOverrides.title || action.title;
        const summaryVal = currentOverrides.summary || action.summary;

        const newTitle = prompt("Edit Recommendation Title:", titleVal);
        if (newTitle === null) return; // cancel
        const newSummary = prompt("Edit Recommendation Summary:", summaryVal);
        if (newSummary === null) return;

        state.editableActions[actionId] = {
          title: newTitle.trim() || action.title,
          summary: newSummary.trim() || action.summary
        };

        renderRecommendationCards();
        triggerAlert('info', 'Recommendation Edited', 'You adjusted the recommendation text. Click "Approve Run" in the Review Center to save outcome.');
      };

      // Step feedback API trigger
      window.submitStepFeedback = async (customerId, domain, actionTitle, status, idx) => {
        const textLabel = document.getElementById('step-fb-msg-' + idx);
        textLabel.textContent = 'Saving feedback...';
        
        try {
          const response = await fetch('/workflow/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_id: customerId,
              domain: domain,
              action_title: actionTitle,
              feedback_status: status
            })
          });
          
          if (response.ok) {
            textLabel.textContent = 'Feedback stored in Memory! ✔️';
            textLabel.style.color = 'var(--accent-success)';
            
            // Reload memory dashboard metrics
            await loadMemoryDashboard(customerId);
          } else {
            textLabel.textContent = 'Error saving feedback';
          }
        } catch (e) {
          console.error(e);
          textLabel.textContent = 'Network error';
        }
      };

      // Evidence Explorer Card rendering
      function renderEvidenceExplorer() {
        const container = document.getElementById('evidenceContainer');
        const actions = state.currentData.next_best_actions || [];

        // Collect all evidence items from all actions
        const items = [];
        actions.forEach(a => {
          (a.evidence || []).forEach(e => {
            // Check if already in list to avoid duplicates
            if (!items.some(it => it.source === e.source && it.excerpt === e.excerpt)) {
              items.push(e);
            }
          });
        });

        if (items.length === 0) {
          container.innerHTML = \`<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">No grounded evidence needed for this query.</div>\`;
          return;
        }

        container.innerHTML = items.map((e, idx) => {
          const relPercent = Math.round((e.relevance || 1.0) * 100);
          return \`
            <div class="evidence-card">
              <div class="evidence-header">
                <span class="evidence-source">\${escapeHtml(e.source)}</span>
                <div class="relevance-indicator" title="Relevance match rating">
                  <span>Relevance: \${relPercent}%</span>
                  <div class="relevance-bar">
                    <div class="relevance-bar-fill" style="width: \${relPercent}%"></div>
                  </div>
                </div>
              </div>
              <div style="font-size:12px; font-weight:700; color:var(--text);">\${escapeHtml(e.label)}</div>
              
              <!-- Collapsible excerpt details -->
              <details>
                <summary style="font-size:11px; color:var(--accent-info); cursor:pointer; font-weight:700;">Show Enterprise Excerpt Document</summary>
                <p class="evidence-excerpt" style="margin-top:6px;">"\${escapeHtml(e.excerpt)}"</p>
              </details>
            </div>
          \`;
        }).join('');
      }

      // Clarifying Questions panel rendering
      function renderClarifyingQuestions() {
        const container = document.getElementById('clarifyingQuestionsContainer');
        const analysis = state.currentData.analysis || {};
        const missing = analysis.missing_information || [];

        if (missing.length === 0) {
          container.style.display = 'none';
          container.innerHTML = '';
          return;
        }

        container.style.display = 'flex';
        let html = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">❓</span>
            <div>
              <strong style="font-size:14px; color:var(--accent-warning);">Clarifying Questions Required</strong>
              <p style="margin:2px 0 0 0; font-size:11px; color:var(--text-muted);">The Agent detected information gaps needed to maximize confidence. Answer below to resubmit.</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
        \`;

        missing.forEach((q, idx) => {
          const prevAnswer = state.currentAnswers[q] || '';
          html += \`
            <div class="form-group">
              <label class="clarifying-q">Question \${idx + 1}: \${escapeHtml(q)}</label>
              <input type="text" class="input-text clarification-input" data-question="\${escapeHtml(q)}" value="\${escapeHtml(prevAnswer)}" placeholder="Type clarify answer here..." />
            </div>
          \`;
        });

        html += \`
            <button class="btn" id="btnSubmitClarifications" style="margin-top:4px; border-color:var(--accent-warning); color:var(--accent-warning); background:rgba(245,158,11,0.05); font-weight:700;">
              ⚡ Resubmit Context with Answers
            </button>
          </div>
        \`;
        container.innerHTML = html;

        // Bind resubmit click action
        document.getElementById('btnSubmitClarifications').addEventListener('click', () => {
          submitAnswersInline();
        });
      }

      // Answers submissions without refresh
      async function submitAnswersInline() {
        const inputs = document.querySelectorAll('.clarification-input');
        const answersStrList = [];
        
        inputs.forEach(input => {
          const q = input.getAttribute('data-question');
          const ans = input.value.trim();
          if (ans) {
            state.currentAnswers[q] = ans; // save state
            answersStrList.push(\`Q: \${q}\\nA: \${ans}\`);
          }
        });

        if (answersStrList.length === 0) {
          triggerAlert('warning', 'Empty Answers', 'Please answer at least one question before resubmitting.');
          return;
        }

        // Gather answers and append to interaction text
        const answersText = "\\n\\n--- Reviewer Clarification Notes ---\\n" + answersStrList.join("\\n\\n");
        await executeOrchestrator({
          interaction_text: (compilePayload().interaction_text || '') + answersText
        });
        
        triggerAlert('success', 'Context Updated', 'Clarification answers submitted! The orchestrator re-evaluated the recommendations.');
      }

      // Human Review Gate actions
      function setupReviewActions() {
        const btnApprove = document.getElementById('btnApproveRun');
        const btnReject = document.getElementById('btnRejectRun');
        const btnModify = document.getElementById('btnModifyRun');

        btnApprove.addEventListener('click', () => submitReview('approved'));
        btnReject.addEventListener('click', () => submitReview('rejected'));
        btnModify.addEventListener('click', () => submitModifyRerun());
      }

      // Review submissions to backend review endpoint
      async function submitReview(status) {
        if (!state.currentData) return;
        const hr = state.currentData.human_review || {};
        const reviewId = hr.review_id;
        const notes = document.getElementById('reviewNotesInput').value.trim();

        if (!reviewId) {
          triggerAlert('error', 'Review Failed', 'No active Review session exists.');
          return;
        }

        resetStateText('Submitting Review...');
        try {
          const response = await fetch('/workflow/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              review_id: reviewId,
              status: status,
              reviewer_notes: notes
            })
          });

          if (!response.ok) {
            throw new Error('Failed to submit review');
          }

          const resData = await response.json();

          // Add to local audit logs
          const historyEntry = {
            id: reviewId,
            customer_id: state.currentData.customer_id,
            domain: state.currentData.domain,
            status: status,
            notes: notes || 'No notes',
            date: new Date().toLocaleTimeString()
          };
          
          state.reviewHistory.unshift(historyEntry);
          localStorage.setItem('review_history', JSON.stringify(state.reviewHistory));
          
          // Show alert
          triggerAlert('success', \`Run \${status.toUpperCase()}\`, \`Review \${reviewId} successfully stored to memory database.\`);

          // Clear notes and refresh dashboards
          document.getElementById('reviewNotesInput').value = '';
          renderReviewHistory();
          
          // Re-evaluate current run locally or load memory
          state.currentData.human_review.status = status;
          state.currentData.human_review.reviewer_notes = notes;
          setHumanReviewUI();
          
          await loadMemoryDashboard(state.currentData.customer_id);

        } catch (e) {
          console.error(e);
          resetStateText('Review Error');
          triggerAlert('error', 'Review Submission Failed', e.message || 'Server error proxying review gate.');
        }
      }

      // Modify and Rerun: appends changes to context and runs again
      async function submitModifyRerun() {
        const notes = document.getElementById('reviewNotesInput').value.trim();
        if (!notes) {
          triggerAlert('warning', 'Notes Required', 'Please enter instructions in Reviewer Notes describing what modifications you need.');
          return;
        }

        const answersText = "\\n\\n--- Reviewer Modification Requirements ---\\nNote: " + notes;
        await executeOrchestrator({
          interaction_text: (compilePayload().interaction_text || '') + answersText
        });

        triggerAlert('success', 'Rerun with Modifications', 'Reviewer modification notes appended. Re-running workflow execution.');
        document.getElementById('reviewNotesInput').value = '';
        
        // Log action locally to audit history
        const auditLog = {
          id: 'MOD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          customer_id: state.currentData.customer_id,
          domain: state.currentData.domain,
          status: 'modified',
          notes: notes,
          date: new Date().toLocaleTimeString()
        };
        state.reviewHistory.unshift(auditLog);
        localStorage.setItem('review_history', JSON.stringify(state.reviewHistory));
        renderReviewHistory();
      }

      // Updates review center status displays
      function setHumanReviewUI() {
        const hr = state.currentData ? state.currentData.human_review : null;
        
        const title = document.getElementById('reviewTitle');
        const idLabel = document.getElementById('reviewIdLabel');
        const badge = document.getElementById('reviewBadge');

        const btnApprove = document.getElementById('btnApproveRun');
        const btnReject = document.getElementById('btnRejectRun');
        const btnModify = document.getElementById('btnModifyRun');

        if (!hr) {
          title.textContent = 'Awaiting Run';
          idLabel.textContent = 'Run ID: None';
          badge.textContent = 'No Session';
          badge.className = 'review-badge pending';
          
          btnApprove.disabled = true;
          btnReject.disabled = true;
          btnModify.disabled = true;
          return;
        }

        idLabel.textContent = \`Review ID: \${hr.review_id.substring(0, 18)}...\`;
        badge.textContent = hr.status.toUpperCase();
        
        if (hr.status === 'pending') {
          title.textContent = 'Recommendation Ready';
          badge.className = 'review-badge pending';
          btnApprove.disabled = false;
          btnReject.disabled = false;
          btnModify.disabled = false;
        } else if (hr.status === 'approved') {
          title.textContent = 'Run Approved';
          badge.className = 'review-badge approved';
          btnApprove.disabled = true;
          btnReject.disabled = true;
          btnModify.disabled = true;
        } else if (hr.status === 'rejected') {
          title.textContent = 'Run Blocked';
          badge.className = 'review-badge rejected';
          btnApprove.disabled = true;
          btnReject.disabled = true;
          btnModify.disabled = true;
        } else if (hr.status === 'modified') {
          title.textContent = 'Rerun Complete';
          badge.className = 'review-badge modified';
          btnApprove.disabled = false;
          btnReject.disabled = false;
          btnModify.disabled = false;
        }
      }

      // Review local storage log history list
      function renderReviewHistory() {
        const container = document.getElementById('reviewHistoryLogs');
        if (state.reviewHistory.length === 0) {
          container.innerHTML = \`<div style="font-size:12px; color:var(--text-muted); font-style:italic; text-align:center; padding:10px;">Audit logs are empty.</div>\`;
          return;
        }

        container.innerHTML = state.reviewHistory.map(entry => \`
          <div class="review-history-item">
            <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:2px;">
              <span>\${escapeHtml(entry.customer_id)} (\${escapeHtml(entry.domain)})</span>
              <span class="review-badge \${entry.status}" style="font-size:9px; padding:2px 6px;">\${entry.status.toUpperCase()}</span>
            </div>
            <div style="font-style:italic; color:var(--text-muted);">Notes: "\${escapeHtml(entry.notes)}"</div>
            <div style="text-align:right; font-size:10px; color:var(--text-muted-2); margin-top:2px;">\${entry.date}</div>
          </div>
        \`).join('');
      }

      // Memory fetch and dashboard calculations
      async function renderDashboards() {
        const customerId = state.currentData.customer_id;
        await loadMemoryDashboard(customerId);
      }

      async function loadMemoryDashboard(customerId) {
        try {
          const response = await fetch(\`/memory/\${customerId}\`);
          const data = await response.json();
          
          const insights = data.learned_insights || [];
          const outcome = data.outcome_summary || { total_runs: 0, approved: 0, rejected: 0, approval_rate: 0 };

          // Update stats panel
          document.getElementById('memTotalRuns').textContent = outcome.total_runs;
          document.getElementById('memApprovalRate').textContent = Math.round((outcome.approval_rate || 0) * 100) + '%';
          
          const filterInsights = insights.filter(i => !i.includes('No prior outcomes'));
          document.getElementById('memInsightsCount').textContent = filterInsights.length;

          // Render memory timeline
          const timeContainer = document.getElementById('memoryTimeline');
          if (filterInsights.length === 0) {
            timeContainer.innerHTML = \`<div style="font-size:12px; color:var(--text-muted); font-style:italic; padding:6px 0;">No learned organizational insights in memory store.</div>\`;
          } else {
            timeContainer.innerHTML = filterInsights.map((ins, idx) => \`
              <div style="display:flex; gap:10px; font-size:12px; background:rgba(255,255,255,0.02); border:1px solid var(--border); padding:10px; border-radius:var(--radius-sm);">
                <div style="font-size:14px; margin-top:2px;">🧠</div>
                <div>
                  <div style="font-weight:700; color:var(--accent-primary);">Insight #\${idx + 1}</div>
                  <div style="color:var(--text-muted); margin-top:2px;">\${escapeHtml(ins)}</div>
                </div>
              </div>
            \`).join('');
          }

          // Build Executive Dashboard Gauges based on domain success metrics
          renderExecutiveGauges(outcome.approval_rate || 0);

        } catch (e) {
          console.error("Dashboard render failed:", e);
        }
      }

      // Dynamic Executive gauges loader
      function renderExecutiveGauges(memoryApprovalRate) {
        const container = document.getElementById('executiveGaugesContainer');
        const metrics = state.currentData.success_metrics || {};
        const explanation = state.currentData.explanation_bundle || {};
        const conf = explanation.confidence ? (explanation.confidence.overall || 0.7) : 0.7;

        let html = '';

        // Add overall confidence gauge
        html += renderSingleGauge('Confidence', Math.round(conf * 100), 'var(--accent-info)', 'Calibration index');
        
        // Add approval rate gauge
        html += renderSingleGauge('Approve Rate', Math.round(memoryApprovalRate * 100), 'var(--accent-success)', 'Org alignment');

        // Loop and add dynamic success metrics
        Object.keys(metrics).forEach(key => {
          const m = metrics[key];
          const est = m.current_estimate || '';
          let pct = 70; // fallback percent
          
          if (est.includes('%')) {
            pct = parseInt(est);
          } else if (est.includes('/100')) {
            pct = parseInt(est.split('/')[0]);
          } else if (est.includes('days')) {
            pct = Math.max(10, Math.min(100, Math.round(100 - parseInt(est) * 3))); // inverse days
          }

          // Capitalize key
          const label = key.replace(/_/g, ' ');
          html += renderSingleGauge(label, pct, 'var(--accent-primary)', est, m.estimated_impact || '');
        });

        container.innerHTML = html;
      }

      function renderSingleGauge(label, percentage, color, centerText, footerText = '') {
        const radius = 35;
        const circ = 2 * Math.PI * radius;
        const strokeOffset = circ - (percentage / 100) * circ;

        return \`
          <div class="gauge-container">
            <div class="gauge-label">\${escapeHtml(label)}</div>
            <svg width="76" height="76" viewBox="0 0 100 100" style="margin:4px 0;">
              <!-- Track ring -->
              <circle cx="50" cy="50" r="\${radius}" stroke="var(--border)" stroke-width="8" fill="none" />
              <!-- Filled ring -->
              <circle cx="50" cy="50" r="\${radius}" stroke="\${color}" stroke-width="8" fill="none"
                      stroke-dasharray="\${circ}" stroke-dashoffset="\${strokeOffset}"
                      stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.6s ease;" />
              <!-- Center Text -->
              <text x="50" y="55" fill="var(--text)" font-size="16" font-weight="bold" text-anchor="middle">
                \${escapeHtml(centerText)}
              </text>
            </svg>
            \${footerText ? \`<div class="gauge-subtext" style="color:var(--text-muted-2);">\${escapeHtml(footerText)}</div>\` : ''}
          </div>
        \`;
      }

      // Escapes HTML tags safely
      function escapeHtml(str) {
        return String(str)
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#039;');
      }
    </script>
  </body>
</html>`;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  // Proxy for Ollama Health Checks
  if (req.url === '/ollama/health') {
    const target = backendUrl + '/ollama/health';
    http.get(target, (backendRes) => {
      let data = '';
      backendRes.on('data', (chunk) => (data += chunk));
      backendRes.on('end', () => {
        try {
          sendJson(res, backendRes.statusCode || 200, JSON.parse(data));
        } catch {
          sendJson(res, 502, { error: 'Backend error' });
        }
      });
    }).on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
    return;
  }

  // Legacy fallback run route
  if (req.url === '/planner/run') {
    const target = backendUrl + '/planner/run';
    http.get(target, (backendRes) => {
      let data = '';
      backendRes.on('data', (chunk) => (data += chunk));
      backendRes.on('end', () => {
        try {
          sendJson(res, backendRes.statusCode || 200, JSON.parse(data));
        } catch {
          sendJson(res, 502, { error: 'Backend error' });
        }
      });
    }).on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
    return;
  }

  // Ingest interaction workflow start
  if (req.url === '/workflow/start' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const target = backendUrl + '/workflow/start';
      const parsedUrl = new URL(target);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      const backendReq = http.request(options, (backendRes) => {
        let responseData = '';
        backendRes.on('data', (chunk) => (responseData += chunk));
        backendRes.on('end', () => {
          try {
            sendJson(res, backendRes.statusCode || 200, JSON.parse(responseData));
          } catch {
            sendJson(res, 502, { error: 'Backend error' });
          }
        });
      });
      backendReq.on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
      backendReq.write(body);
      backendReq.end();
    });
    return;
  }

  // Step feedback logger
  if (req.url === '/workflow/feedback' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const target = backendUrl + '/workflow/feedback';
      const parsedUrl = new URL(target);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      const backendReq = http.request(options, (backendRes) => {
        let responseData = '';
        backendRes.on('data', (chunk) => (responseData += chunk));
        backendRes.on('end', () => {
          try {
            sendJson(res, backendRes.statusCode || 200, JSON.parse(responseData));
          } catch {
            sendJson(res, 502, { error: 'Backend error' });
          }
        });
      });
      backendReq.on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
      backendReq.write(body);
      backendReq.end();
    });
    return;
  }

  // Human Review Gate (POST workflow/review)
  if (req.url === '/workflow/review' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const target = backendUrl + '/workflow/review';
      const parsedUrl = new URL(target);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      const backendReq = http.request(options, (backendRes) => {
        let responseData = '';
        backendRes.on('data', (chunk) => (responseData += chunk));
        backendRes.on('end', () => {
          try {
            sendJson(res, backendRes.statusCode || 200, JSON.parse(responseData));
          } catch {
            sendJson(res, 502, { error: 'Backend error' });
          }
        });
      });
      backendReq.on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
      backendReq.write(body);
      backendReq.end();
    });
    return;
  }

  // Memory endpoints
  if (req.url.startsWith('/memory/') && req.method === 'GET') {
    const target = backendUrl + req.url;
    http.get(target, (backendRes) => {
      let data = '';
      backendRes.on('data', (chunk) => (data += chunk));
      backendRes.on('end', () => {
        try {
          sendJson(res, backendRes.statusCode || 200, JSON.parse(data));
        } catch {
          sendJson(res, 502, { error: 'Backend error' });
        }
      });
    }).on('error', () => sendJson(res, 502, { error: 'Unable to reach backend' }));
    return;
  }

  // Serve Single-Page App
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(3000, '0.0.0.0', () => console.log('Frontend listening on port 3000'));
