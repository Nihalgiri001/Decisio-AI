const http = require('http');
const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Decisio AI — Intelligent Decision Platform</title>
  <meta name="description" content="Transform raw business information into intelligent recommendations using AI-powered workflows. Decisio AI delivers explainable next-best-action intelligence." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ─── Design System ──────────────────────────────────────── */
    :root {
      --bg:        #0F172A;
      --bg-2:      #0B1120;
      --sidebar:   #111827;
      --card:      #1E293B;
      --card-2:    #243044;
      --border:    rgba(255,255,255,0.08);
      --border-2:  rgba(255,255,255,0.05);

      --primary:   #2563EB;
      --primary-h: #3B82F6;
      --primary-g: linear-gradient(135deg,#2563EB,#1D4ED8);
      --success:   #10B981;
      --warning:   #F59E0B;
      --danger:    #EF4444;
      --purple:    #8B5CF6;

      --text:      #F8FAFC;
      --text-2:    #CBD5E1;
      --muted:     #94A3B8;
      --muted-2:   #64748B;

      --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
      --shadow:    0 4px 20px rgba(0,0,0,0.5);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
      --glow:      0 0 20px rgba(37,99,235,0.25);
      --glow-g:    0 0 20px rgba(16,185,129,0.25);

      --radius-sm: 8px;
      --radius:    12px;
      --radius-lg: 16px;
      --radius-xl: 20px;

      --sidebar-w: 220px;
      --sidebar-w-collapsed: 64px;
      --right-w:   300px;
      --header-h:  60px;

      --font: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;

      --transition: 200ms cubic-bezier(0.4,0,0.2,1);
      --transition-slow: 350ms cubic-bezier(0.4,0,0.2,1);
    }

    /* ─── Reset ──────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 14px; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.5;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: var(--font); cursor: pointer; border: none; outline: none; }
    input, textarea, select { font-family: var(--font); }
    ul, ol { list-style: none; }
    img, svg { display: block; }

    /* ─── Scrollbar ──────────────────────────────────────────── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* ─── App Shell ──────────────────────────────────────────── */
    .app-shell {
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr var(--right-w);
      grid-template-rows: var(--header-h) 1fr;
      grid-template-areas:
        "sidebar header header"
        "sidebar main   right";
      min-height: 100vh;
      transition: grid-template-columns var(--transition-slow);
    }
    .app-shell.sidebar-collapsed {
      grid-template-columns: var(--sidebar-w-collapsed) 1fr var(--right-w);
    }

    /* ─── Sidebar ────────────────────────────────────────────── */
    .sidebar {
      grid-area: sidebar;
      background: var(--sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      transition: width var(--transition-slow);
      z-index: 100;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 16px 14px;
      border-bottom: 1px solid var(--border);
      min-height: var(--header-h);
      overflow: hidden;
    }
    .sidebar-logo {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: var(--primary-g);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--glow);
    }
    .sidebar-logo svg { color: white; }
    .sidebar-brand-text { overflow: hidden; white-space: nowrap; }
    .sidebar-brand-text h1 { font-size: 15px; font-weight: 700; letter-spacing: -0.2px; }
    .sidebar-brand-text span { font-size: 11px; color: var(--muted); }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
    }

    .sidebar-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: var(--radius-sm);
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background var(--transition), color var(--transition);
      white-space: nowrap;
      overflow: hidden;
      border: 1px solid transparent;
      position: relative;
    }
    .sidebar-nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-2);
    }
    .sidebar-nav-item.active {
      background: rgba(37,99,235,0.15);
      color: var(--primary-h);
      border-color: rgba(37,99,235,0.25);
    }
    .sidebar-nav-item.active .nav-icon { color: var(--primary-h); }
    .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .nav-label { overflow: hidden; }

    .sidebar-section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--muted-2);
      padding: 12px 10px 4px;
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .conn-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
    }
    .conn-dot {
      width: 8px; height: 8px;
      border-radius: 99px;
      background: var(--success);
      flex-shrink: 0;
      box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
      animation: pulse 2s infinite;
    }
    .conn-dot.offline { background: var(--danger); box-shadow: 0 0 0 3px rgba(239,68,68,0.2); animation: none; }
    @keyframes pulse {
      0%,100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .sidebar-collapse-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--muted);
      font-size: 12px;
      transition: background var(--transition), color var(--transition);
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      text-align: left;
    }
    .sidebar-collapse-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-2); }

    /* Tooltip on collapsed sidebar */
    .app-shell.sidebar-collapsed .nav-label,
    .app-shell.sidebar-collapsed .sidebar-brand-text,
    .app-shell.sidebar-collapsed .sidebar-section-label,
    .app-shell.sidebar-collapsed .conn-status span,
    .app-shell.sidebar-collapsed .sidebar-collapse-btn span { display: none; }
    .app-shell.sidebar-collapsed .sidebar-nav-item { justify-content: center; padding: 9px; }
    .app-shell.sidebar-collapsed .sidebar-brand { justify-content: center; padding: 16px 14px; }
    .app-shell.sidebar-collapsed .conn-status { justify-content: center; }
    .app-shell.sidebar-collapsed .sidebar-collapse-btn { justify-content: center; }

    /* ─── Header ─────────────────────────────────────────────── */
    .header {
      grid-area: header;
      background: rgba(15,23,42,0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 50;
      height: var(--header-h);
    }
    .header-title {
      display: flex;
      flex-direction: column;
    }
    .header-title strong { font-size: 15px; font-weight: 700; }
    .header-title span { font-size: 11px; color: var(--muted); }

    .header-spacer { flex: 1; }

    .header-btn {
      width: 36px; height: 36px;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: var(--muted);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition), color var(--transition);
    }
    .header-btn:hover { background: rgba(255,255,255,0.1); color: var(--text); }

    .avatar {
      width: 32px; height: 32px;
      border-radius: 99px;
      background: var(--primary-g);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
      border-radius: 99px;
      font-size: 11px;
      font-weight: 500;
      color: var(--success);
    }
    .status-pill.loading {
      background: rgba(245,158,11,0.1);
      border-color: rgba(245,158,11,0.25);
      color: var(--warning);
    }
    .status-pill.error {
      background: rgba(239,68,68,0.1);
      border-color: rgba(239,68,68,0.25);
      color: var(--danger);
    }
    .status-pill-dot {
      width: 6px; height: 6px;
      border-radius: 99px;
      background: currentColor;
    }

    /* ─── Main Workspace ─────────────────────────────────────── */
    .main-workspace {
      grid-area: main;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ─── Right Panel ────────────────────────────────────────── */
    .right-panel {
      grid-area: right;
      background: var(--sidebar);
      border-left: 1px solid var(--border);
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ─── Card ───────────────────────────────────────────────── */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);
    }
    .card:hover { box-shadow: var(--shadow); border-color: rgba(255,255,255,0.12); }

    .card-sm {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-subtitle {
      font-size: 11px;
      color: var(--muted);
      margin-top: 2px;
    }
    .card-meta { font-size: 11px; color: var(--muted); }

    /* ─── Hero Section ───────────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.08) 100%);
      border: 1px solid rgba(37,99,235,0.2);
      border-radius: var(--radius-xl);
      padding: 28px 32px;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero h2 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.4px;
      line-height: 1.3;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--text), var(--text-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.7;
      max-width: 560px;
    }
    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 99px;
      font-size: 11px;
      color: var(--text-2);
    }
    .hero-badge-dot { width: 6px; height: 6px; border-radius: 99px; }

    /* ─── Dashboard Summary Cards ────────────────────────────── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: default;
      transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);
    }
    .stat-card:hover {
      box-shadow: var(--shadow);
      border-color: rgba(255,255,255,0.14);
      transform: translateY(-2px);
    }
    .stat-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-icon {
      width: 36px; height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon.blue { background: rgba(37,99,235,0.15); color: var(--primary-h); }
    .stat-icon.green { background: rgba(16,185,129,0.15); color: var(--success); }
    .stat-icon.purple { background: rgba(139,92,246,0.15); color: var(--purple); }
    .stat-icon.amber { background: rgba(245,158,11,0.15); color: var(--warning); }
    .stat-trend {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 7px;
      border-radius: 99px;
    }
    .stat-trend.up { color: var(--success); background: rgba(16,185,129,0.1); }
    .stat-trend.neutral { color: var(--muted); background: rgba(255,255,255,0.05); }
    .stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; }

    /* ─── Upload Card ────────────────────────────────────────── */
    .upload-zone {
      border: 2px dashed rgba(37,99,235,0.3);
      border-radius: var(--radius-lg);
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color var(--transition), background var(--transition);
      background: rgba(37,99,235,0.04);
      position: relative;
    }
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: var(--primary);
      background: rgba(37,99,235,0.08);
    }
    .upload-zone.has-file {
      border-color: rgba(16,185,129,0.4);
      background: rgba(16,185,129,0.05);
    }
    .upload-icon {
      width: 48px; height: 48px;
      border-radius: var(--radius);
      background: rgba(37,99,235,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      color: var(--primary-h);
    }
    .upload-zone h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .upload-zone p { font-size: 12px; color: var(--muted); line-height: 1.6; }
    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: rgba(37,99,235,0.15);
      border: 1px solid rgba(37,99,235,0.3);
      border-radius: var(--radius-sm);
      color: var(--primary-h);
      font-size: 12px;
      font-weight: 600;
      margin-top: 12px;
      transition: background var(--transition), border-color var(--transition);
    }
    .upload-btn:hover { background: rgba(37,99,235,0.25); border-color: var(--primary); }

    .file-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(16,185,129,0.08);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: var(--radius-sm);
      margin-top: 12px;
    }
    .file-preview-icon { color: var(--success); flex-shrink: 0; }
    .file-preview-name { font-size: 12px; font-weight: 600; flex: 1; }
    .file-preview-size { font-size: 11px; color: var(--muted); }

    .upload-progress {
      margin-top: 10px;
      height: 3px;
      background: rgba(255,255,255,0.08);
      border-radius: 99px;
      overflow: hidden;
      display: none;
    }
    .upload-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--success));
      border-radius: 99px;
      width: 0%;
      transition: width 0.3s ease;
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-control {
      width: 100%;
      padding: 8px 12px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 13px;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .form-control:focus {
      outline: none;
      border-color: rgba(37,99,235,0.5);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .form-control option { background: var(--card); color: var(--text); }

    /* ─── Primary Button ─────────────────────────────────────── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--primary-g);
      border: 1px solid rgba(37,99,235,0.5);
      border-radius: var(--radius-sm);
      color: white;
      font-size: 13px;
      font-weight: 600;
      transition: opacity var(--transition), box-shadow var(--transition), transform var(--transition);
      box-shadow: 0 2px 8px rgba(37,99,235,0.3);
    }
    .btn-primary:hover { opacity: 0.92; box-shadow: 0 4px 16px rgba(37,99,235,0.4); transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-2);
      font-size: 13px;
      font-weight: 500;
      transition: background var(--transition), border-color var(--transition), transform var(--transition);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); transform: translateY(-1px); }
    .btn-secondary:active { transform: none; }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      color: var(--muted);
      font-size: 12px;
      font-weight: 500;
      transition: background var(--transition), color var(--transition);
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-2); }

    .btn-success {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: var(--radius-sm);
      color: var(--success);
      font-size: 12px; font-weight: 600;
      transition: background var(--transition);
    }
    .btn-success:hover { background: rgba(16,185,129,0.2); }
    .btn-success.active { background: rgba(16,185,129,0.25); border-color: rgba(16,185,129,0.5); }

    .btn-danger-ghost {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: var(--radius-sm);
      color: var(--danger);
      font-size: 12px; font-weight: 600;
      transition: background var(--transition);
    }
    .btn-danger-ghost:hover { background: rgba(239,68,68,0.18); }
    .btn-danger-ghost.active { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }

    .btn-warning-ghost {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px;
      background: rgba(245,158,11,0.08);
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: var(--radius-sm);
      color: var(--warning);
      font-size: 12px; font-weight: 600;
      transition: background var(--transition);
    }
    .btn-warning-ghost:hover { background: rgba(245,158,11,0.18); }
    .btn-warning-ghost.active { background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.5); }

    /* ─── Generate Button Row ────────────────────────────────── */
    .generate-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      margin-top: 16px;
    }
    .generate-hint { font-size: 11px; color: var(--muted); }
    .generate-hint kbd {
      display: inline-block;
      padding: 2px 5px;
      background: rgba(255,255,255,0.08);
      border: 1px solid var(--border);
      border-radius: 4px;
      font-size: 10px;
      font-family: var(--font);
    }

    /* ─── Workflow Stepper ───────────────────────────────────── */
    .stepper {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 10px 0;
      position: relative;
    }
    .step-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 13px;
      top: 36px;
      bottom: -4px;
      width: 2px;
      background: var(--border);
    }
    .step-item.done:not(:last-child)::after { background: rgba(16,185,129,0.4); }
    .step-item.active:not(:last-child)::after { background: rgba(37,99,235,0.3); }

    .step-dot {
      width: 28px; height: 28px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 700;
      border: 2px solid var(--border);
      background: var(--card-2);
      color: var(--muted);
      transition: all var(--transition-slow);
    }
    .step-item.done .step-dot {
      background: rgba(16,185,129,0.15);
      border-color: rgba(16,185,129,0.4);
      color: var(--success);
    }
    .step-item.active .step-dot {
      background: rgba(37,99,235,0.15);
      border-color: var(--primary);
      color: var(--primary-h);
      animation: step-pulse 1.5s infinite;
    }
    @keyframes step-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
      50% { box-shadow: 0 0 0 6px rgba(37,99,235,0); }
    }

    .step-body { flex: 1; padding-top: 4px; }
    .step-name { font-size: 13px; font-weight: 600; color: var(--text-2); }
    .step-item.done .step-name { color: var(--success); }
    .step-item.active .step-name { color: var(--primary-h); }
    .step-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .step-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 99px;
      margin-left: 6px;
    }
    .step-badge.processing {
      background: rgba(37,99,235,0.15);
      color: var(--primary-h);
    }
    .step-badge.done {
      background: rgba(16,185,129,0.12);
      color: var(--success);
    }

    /* ─── Skeleton Loading ───────────────────────────────────── */
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 800px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }
    .skeleton-line { height: 12px; margin-bottom: 8px; }
    .skeleton-line.w-3-4 { width: 75%; }
    .skeleton-line.w-1-2 { width: 50%; }
    .skeleton-line.w-1-4 { width: 25%; }
    .skeleton-block { height: 80px; }

    /* ─── Action Cards ───────────────────────────────────────── */
    .action-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px;
      transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);
      animation: fadeIn 0.3s ease both;
    }
    .action-card:hover {
      box-shadow: var(--shadow);
      border-color: rgba(255,255,255,0.12);
      transform: translateY(-1px);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .action-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }
    .action-step-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--primary-h);
      margin-bottom: 4px;
    }
    .action-title { font-size: 15px; font-weight: 700; letter-spacing: -0.2px; }
    .action-summary { font-size: 13px; color: var(--text-2); line-height: 1.6; margin-bottom: 12px; }
    .action-rationale {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.6;
      padding: 10px 14px;
      background: rgba(37,99,235,0.06);
      border-left: 3px solid rgba(37,99,235,0.4);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin-bottom: 12px;
      font-style: italic;
    }

    /* ─── Badge ──────────────────────────────────────────────── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 9px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-blue { background: rgba(37,99,235,0.15); color: var(--primary-h); border: 1px solid rgba(37,99,235,0.25); }
    .badge-green { background: rgba(16,185,129,0.12); color: var(--success); border: 1px solid rgba(16,185,129,0.25); }
    .badge-amber { background: rgba(245,158,11,0.12); color: var(--warning); border: 1px solid rgba(245,158,11,0.25); }
    .badge-red { background: rgba(239,68,68,0.12); color: var(--danger); border: 1px solid rgba(239,68,68,0.25); }
    .badge-purple { background: rgba(139,92,246,0.12); color: var(--purple); border: 1px solid rgba(139,92,246,0.25); }
    .badge-neutral { background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid var(--border); }

    /* ─── Confidence Bar ─────────────────────────────────────── */
    .confidence-bar-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .confidence-bar-label { font-size: 11px; color: var(--muted); white-space: nowrap; }
    .confidence-bar-track {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 99px;
      overflow: hidden;
    }
    .confidence-bar-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--primary), var(--success));
      width: 0%;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .confidence-bar-value { font-size: 12px; font-weight: 700; color: var(--text-2); white-space: nowrap; }

    /* ─── Evidence Accordion ─────────────────────────────────── */
    .evidence-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 0;
      cursor: pointer;
      color: var(--muted);
      font-size: 12px;
      font-weight: 500;
      transition: color var(--transition);
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    .evidence-toggle:hover { color: var(--text-2); }
    .evidence-toggle-icon { transition: transform var(--transition); }
    .evidence-toggle.open .evidence-toggle-icon { transform: rotate(90deg); }
    .evidence-list { display: none; flex-direction: column; gap: 8px; margin-top: 8px; }
    .evidence-list.open { display: flex; }
    .evidence-chip {
      padding: 10px 12px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
    }
    .evidence-chip-label { font-size: 10px; font-weight: 700; color: var(--primary-h); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .evidence-chip-text { font-size: 12px; color: var(--text-2); line-height: 1.5; }
    .evidence-chip-source { font-size: 10px; color: var(--muted-2); margin-top: 4px; }

    /* ─── Action Footer ──────────────────────────────────────── */
    .action-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      margin-top: 12px;
    }
    .action-footer-spacer { flex: 1; }
    .feedback-label { font-size: 11px; color: var(--muted); }

    /* ─── Approval Panel ─────────────────────────────────────── */
    .approval-status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 14px;
    }
    .approval-title { font-size: 14px; font-weight: 700; }
    .review-textarea {
      width: 100%;
      min-height: 80px;
      padding: 10px 12px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 13px;
      resize: vertical;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .review-textarea:focus {
      outline: none;
      border-color: rgba(37,99,235,0.5);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .review-textarea::placeholder { color: var(--muted-2); }
    .approval-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .approval-result {
      font-size: 12px;
      color: var(--muted);
      margin-top: 10px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.03);
      border-radius: var(--radius-sm);
      min-height: 36px;
    }

    /* ─── Agent Trace ────────────────────────────────────────── */
    .trace-list { display: flex; flex-direction: column; gap: 0; }
    .trace-item {
      display: flex;
      gap: 12px;
      padding: 8px 0;
      position: relative;
    }
    .trace-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 26px;
      bottom: -4px;
      width: 2px;
      background: var(--border);
    }
    .trace-dot {
      width: 16px; height: 16px;
      border-radius: 99px;
      background: rgba(37,99,235,0.2);
      border: 2px solid rgba(37,99,235,0.4);
      flex-shrink: 0;
      margin-top: 2px;
    }
    .trace-name { font-size: 12px; font-weight: 600; color: var(--text-2); }
    .trace-desc { font-size: 11px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
    .trace-duration { font-size: 10px; color: var(--muted-2); margin-top: 3px; }

    /* ─── Execution Status ───────────────────────────────────── */
    .exec-list-inner { display: flex; flex-direction: column; gap: 10px; }
    .exec-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
    }
    .exec-dot {
      width: 8px; height: 8px;
      border-radius: 99px;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .exec-dot.pending { background: var(--muted-2); }
    .exec-dot.ok { background: var(--success); box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
    .exec-dot.wait { background: var(--warning); }
    .exec-h { font-size: 12px; font-weight: 600; }
    .exec-c { font-size: 11px; color: var(--muted); margin-top: 2px; line-height: 1.4; }

    /* ─── Memory Box ─────────────────────────────────────────── */
    .memory-list { display: flex; flex-direction: column; gap: 6px; }
    .memory-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 10px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-2);
      line-height: 1.4;
    }
    .memory-bullet { color: var(--purple); flex-shrink: 0; margin-top: 2px; }

    /* ─── Right Panel Cards ──────────────────────────────────── */
    .rp-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
    }
    .rp-card-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-2);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .rp-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding: 6px 0;
      border-bottom: 1px solid var(--border-2);
    }
    .rp-row:last-child { border-bottom: none; }
    .rp-key { font-size: 11px; color: var(--muted); }
    .rp-val { font-size: 11px; font-weight: 600; color: var(--text-2); }

    /* ─── Activity Timeline ──────────────────────────────────── */
    .activity-list { display: flex; flex-direction: column; gap: 0; }
    .activity-item {
      display: flex;
      gap: 10px;
      padding: 8px 0;
      position: relative;
    }
    .activity-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 24px;
      bottom: -4px;
      width: 2px;
      background: var(--border-2);
    }
    .activity-dot {
      width: 16px; height: 16px;
      border-radius: 99px;
      background: var(--bg-2);
      border: 2px solid var(--border);
      flex-shrink: 0;
      margin-top: 1px;
    }
    .activity-dot.green { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.4); }
    .activity-dot.blue { background: rgba(37,99,235,0.15); border-color: rgba(37,99,235,0.4); }
    .activity-dot.amber { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.4); }
    .activity-time { font-size: 10px; color: var(--muted-2); margin-bottom: 2px; }
    .activity-text { font-size: 11px; color: var(--text-2); }

    /* ─── Toast Notifications ────────────────────────────────── */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 9999;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--card-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      min-width: 280px;
      max-width: 380px;
      animation: toast-in 0.3s cubic-bezier(0.4,0,0.2,1) both;
      pointer-events: all;
    }
    .toast.out { animation: toast-out 0.3s cubic-bezier(0.4,0,0.2,1) both; }
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-out {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(40px); }
    }
    .toast-icon { flex-shrink: 0; }
    .toast-text { flex: 1; }
    .toast-title { font-size: 13px; font-weight: 600; }
    .toast-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .toast.success { border-color: rgba(16,185,129,0.3); }
    .toast.error { border-color: rgba(239,68,68,0.3); }
    .toast.info { border-color: rgba(37,99,235,0.3); }

    /* ─── Empty States ───────────────────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 20px;
      color: var(--muted);
      gap: 8px;
    }
    .empty-state-icon {
      width: 40px; height: 40px;
      border-radius: var(--radius);
      background: rgba(255,255,255,0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .empty-state h4 { font-size: 13px; font-weight: 600; color: var(--text-2); }
    .empty-state p { font-size: 12px; line-height: 1.6; max-width: 240px; }

    /* ─── Copy Button ────────────────────────────────────────── */
    .copy-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--muted);
      font-size: 11px;
      transition: background var(--transition), color var(--transition);
    }
    .copy-btn:hover { background: rgba(255,255,255,0.06); color: var(--text-2); }
    .copy-btn.copied { color: var(--success); border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.08); }

    /* ─── Divider ────────────────────────────────────────────── */
    .divider { height: 1px; background: var(--border); margin: 4px 0; }

    /* ─── Metric Mini ────────────────────────────────────────── */
    .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .metric-mini {
      padding: 10px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
    }
    .metric-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; font-weight: 600; }
    .metric-mini-value { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; margin-top: 4px; }
    .metric-mini-sub { font-size: 10px; color: var(--muted); margin-top: 2px; line-height: 1.4; }

    /* ─── Responsive ─────────────────────────────────────────── */
    @media (max-width: 1200px) {
      :root { --right-w: 260px; }
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 1024px) {
      .app-shell {
        grid-template-columns: var(--sidebar-w-collapsed) 1fr;
        grid-template-areas:
          "sidebar header"
          "sidebar main";
      }
      .right-panel { display: none; }
      .sidebar-brand-text, .nav-label, .sidebar-section-label,
      .conn-status span, .sidebar-collapse-btn span { display: none; }
      .sidebar-nav-item { justify-content: center; padding: 9px; }
      .sidebar-brand { justify-content: center; padding: 16px 14px; }
      .conn-status { justify-content: center; }
      .sidebar-collapse-btn { justify-content: center; }
    }
    @media (max-width: 768px) {
      .app-shell {
        grid-template-columns: 1fr;
        grid-template-rows: var(--header-h) 1fr;
        grid-template-areas:
          "header"
          "main";
      }
      .sidebar { display: none; }
      .sidebar.mobile-open {
        display: flex;
        position: fixed;
        left: 0; top: 0;
        width: var(--sidebar-w);
        height: 100vh;
        z-index: 200;
        box-shadow: var(--shadow-lg);
      }
      .mobile-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 150;
        backdrop-filter: blur(4px);
      }
      .mobile-overlay.open { display: block; }
      .stat-grid { grid-template-columns: 1fr 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .metric-grid { grid-template-columns: 1fr; }
      .main-workspace { padding: 16px; }
    }
    @media (max-width: 480px) {
      .stat-grid { grid-template-columns: 1fr; }
      .hero { padding: 20px; }
      .hero h2 { font-size: 18px; }
    }

    /* ─── Focus Visible ──────────────────────────────────────── */
    :focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* ─── Hamburger ──────────────────────────────────────────── */
    .hamburger {
      display: none;
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      align-items: center;
      justify-content: center;
      color: var(--muted);
      flex-shrink: 0;
      transition: background var(--transition);
    }
    .hamburger:hover { background: rgba(255,255,255,0.1); color: var(--text); }
    @media (max-width: 768px) { .hamburger { display: flex; } }

    /* ─── Section Labels ─────────────────────────────────────── */
    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }
  </style>
</head>
<body>

<!-- Mobile overlay -->
<div class="mobile-overlay" id="mobileOverlay" role="presentation" onclick="closeMobileSidebar()"></div>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer" aria-live="polite" aria-atomic="false"></div>

<!-- App Shell -->
<div class="app-shell" id="appShell">

  <!-- ────── SIDEBAR ────── -->
  <nav class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
    <div class="sidebar-brand">
      <div class="sidebar-logo" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <div class="sidebar-brand-text">
        <h1>Decisio AI</h1>
        <span>Decision Intelligence</span>
      </div>
    </div>

    <div class="sidebar-nav" role="list">
      <div class="sidebar-section-label">Workspace</div>

      <div class="sidebar-nav-item active" role="listitem" aria-current="page" id="nav-dashboard" onclick="setActiveNav('dashboard')" tabindex="0" aria-label="Dashboard">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        <span class="nav-label">Dashboard</span>
      </div>

      <div class="sidebar-nav-item" role="listitem" id="nav-upload" onclick="setActiveNav('upload');scrollToSection('upload-section')" tabindex="0" aria-label="Upload">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span class="nav-label">Upload</span>
      </div>

      <div class="sidebar-nav-item" role="listitem" id="nav-workflow" onclick="setActiveNav('workflow');scrollToSection('workflow-section')" tabindex="0" aria-label="Workflow">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span class="nav-label">Workflow</span>
      </div>

      <div class="sidebar-nav-item" role="listitem" id="nav-knowledge" onclick="setActiveNav('knowledge')" tabindex="0" aria-label="Knowledge">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span class="nav-label">Knowledge</span>
      </div>

      <div class="sidebar-nav-item" role="listitem" id="nav-memory" onclick="setActiveNav('memory');scrollToSection('memory-section')" tabindex="0" aria-label="Memory">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
        <span class="nav-label">Memory</span>
      </div>

      <div class="sidebar-section-label">System</div>

      <div class="sidebar-nav-item" role="listitem" id="nav-logs" onclick="setActiveNav('logs');scrollToSection('trace-section')" tabindex="0" aria-label="Logs">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        <span class="nav-label">Logs</span>
      </div>

      <div class="sidebar-nav-item" role="listitem" id="nav-settings" onclick="setActiveNav('settings')" tabindex="0" aria-label="Settings">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        <span class="nav-label">Settings</span>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="conn-status" id="connStatus" aria-label="Connection status">
        <div class="conn-dot" id="connDot"></div>
        <span id="connText">Connected</span>
      </div>
      <button class="sidebar-collapse-btn" id="collapseBtn" onclick="toggleSidebar()" aria-label="Toggle sidebar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 19l-7-7 7-7"/><path d="M19 12H4"/>
        </svg>
        <span>Collapse</span>
      </button>
    </div>
  </nav>

  <!-- ────── HEADER ────── -->
  <header class="header" role="banner">
    <button class="hamburger" id="hamburgerBtn" onclick="openMobileSidebar()" aria-label="Open navigation menu" aria-expanded="false">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <div class="header-title">
      <strong>Decisio AI</strong>
      <span>Explainable Next-Best-Action Intelligence</span>
    </div>

    <div class="header-spacer"></div>

    <div class="status-pill" id="headerStatusPill" role="status" aria-live="polite">
      <div class="status-pill-dot"></div>
      <span id="headerStatusText">Ready</span>
    </div>

    <button class="header-btn" aria-label="Toggle theme" title="Toggle theme">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    </button>

    <div class="avatar" aria-label="User profile" title="User profile" role="img">U</div>
  </header>

  <!-- ────── MAIN WORKSPACE ────── -->
  <main class="main-workspace" id="mainWorkspace" role="main">

    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-heading">
      <h2 id="hero-heading">Transform business signals into<br/>intelligent decisions.</h2>
      <p>Upload customer interactions, run AI-powered workflows, and get explainable next-best-action recommendations — grounded in enterprise evidence with human review built in.</p>
      <div class="hero-badges" role="list">
        <div class="hero-badge" role="listitem"><div class="hero-badge-dot" style="background:#10B981"></div>Evidence-backed</div>
        <div class="hero-badge" role="listitem"><div class="hero-badge-dot" style="background:#2563EB"></div>Explainable AI</div>
        <div class="hero-badge" role="listitem"><div class="hero-badge-dot" style="background:#F59E0B"></div>Human-in-the-loop</div>
        <div class="hero-badge" role="listitem"><div class="hero-badge-dot" style="background:#8B5CF6"></div>Memory-enabled</div>
      </div>
    </section>

    <!-- Dashboard Summary Cards -->
    <section aria-label="Summary statistics">
      <div class="stat-grid" role="list">
        <div class="stat-card" role="listitem" tabindex="0">
          <div class="stat-card-top">
            <div class="stat-icon blue" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span class="stat-trend up" aria-label="Trending up">+1</span>
          </div>
          <div class="stat-value" id="statUploads">0</div>
          <div class="stat-label">Uploaded Documents</div>
        </div>

        <div class="stat-card" role="listitem" tabindex="0">
          <div class="stat-card-top">
            <div class="stat-icon green" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span class="stat-trend up" aria-label="Trending up">+1</span>
          </div>
          <div class="stat-value" id="statWorkflows">0</div>
          <div class="stat-label">Completed Workflows</div>
        </div>

        <div class="stat-card" role="listitem" tabindex="0">
          <div class="stat-card-top">
            <div class="stat-icon purple" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span class="stat-trend neutral">KB</span>
          </div>
          <div class="stat-value" id="statKnowledge">3</div>
          <div class="stat-label">Knowledge Sources</div>
        </div>

        <div class="stat-card" role="listitem" tabindex="0">
          <div class="stat-card-top">
            <div class="stat-icon amber" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <span class="stat-trend neutral" id="statMemoryTrend">—</span>
          </div>
          <div class="stat-value" id="statMemory">0</div>
          <div class="stat-label">Memory Entries</div>
        </div>
      </div>
    </section>

    <!-- Upload + Config Card -->
    <section class="card" id="upload-section" aria-labelledby="upload-heading">
      <div class="card-header">
        <div>
          <div class="card-title" id="upload-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Ingestion Center
          </div>
          <div class="card-subtitle">Upload a transcript, email, or meeting notes file</div>
        </div>
      </div>

      <input type="file" id="fileInput" accept=".txt,.json" style="display:none" aria-label="Choose file to upload" />

      <div class="upload-zone" id="uploadZone" onclick="document.getElementById('fileInput').click()" 
           role="button" tabindex="0" aria-label="Click or drag and drop to upload file"
           onkeydown="if(event.key==='Enter'||event.key===' ')document.getElementById('fileInput').click()"
           ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleDrop(event)">
        <div class="upload-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h3>Drop your file here</h3>
        <p>Supports .txt and .json files<br/>Transcripts, emails, meeting notes</p>
        <div class="upload-btn" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/>
          </svg>
          Browse Files
        </div>
      </div>

      <div class="upload-progress" id="uploadProgress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="upload-progress-bar" id="uploadProgressBar"></div>
      </div>

      <div id="filePreview" style="display:none" class="file-preview" role="status" aria-live="polite">
        <svg class="file-preview-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="file-preview-name" id="filePreviewName"></span>
        <span class="file-preview-size" id="filePreviewSize"></span>
        <button class="btn-ghost" onclick="clearFile()" aria-label="Remove uploaded file" style="padding:4px 8px;font-size:11px;margin-left:auto;">Remove</button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="domainSelect">Scenario Domain</label>
          <select class="form-control" id="domainSelect">
            <option value="saas_sales">SaaS Sales</option>
            <option value="customer_success">Customer Success</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="customerIdInput">Customer ID</label>
          <input type="text" class="form-control" id="customerIdInput" value="CUST-1001" placeholder="e.g. CUST-1001" />
        </div>
      </div>

      <div class="generate-row">
        <div class="generate-hint">
          Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to generate
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn-secondary" id="saveBtn" aria-label="Save current recommendation to memory">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save to Memory
          </button>
          <button class="btn-primary" id="runBtn" aria-label="Generate AI recommendation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Generate Recommendation
          </button>
        </div>
      </div>
    </section>

    <!-- Workflow Stepper -->
    <section class="card" id="workflow-section" aria-labelledby="workflow-heading">
      <div class="card-header">
        <div>
          <div class="card-title" id="workflow-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Workflow Pipeline
          </div>
          <div class="card-subtitle" id="orchestrationRoute">Configure and run a workflow to see the pipeline</div>
        </div>
        <div id="workflowBadge" class="badge badge-neutral" role="status">Idle</div>
      </div>

      <div class="stepper" id="workflowStepper" role="list" aria-label="Workflow stages">
        <!-- Steps rendered by JS -->
      </div>
    </section>

    <!-- Customer Overview + Metrics -->
    <section class="card" aria-labelledby="customer-heading">
      <div class="card-header">
        <div>
          <div class="card-title" id="customer-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Customer Overview
          </div>
          <div class="card-subtitle" id="customerMeta">Customer: CUST-1001 · Domain: saas_sales</div>
        </div>
        <div id="badgesRow" style="display:flex;gap:6px;flex-wrap:wrap"></div>
      </div>

      <div class="metric-grid" role="list">
        <div class="metric-mini" role="listitem">
          <div class="metric-mini-label" id="healthLabel">Current Health Score</div>
          <div class="metric-mini-value" id="healthValue">—</div>
          <div class="metric-mini-sub" id="healthCopy">Run a workflow to see metrics</div>
        </div>
        <div class="metric-mini" role="listitem">
          <div class="metric-mini-label">Recommendation Confidence</div>
          <div class="metric-mini-value" id="confValue">—</div>
          <div style="margin-top:8px">
            <div class="confidence-bar-track" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Confidence level">
              <div class="confidence-bar-fill" id="confBar"></div>
            </div>
          </div>
          <div class="metric-mini-sub" id="confidenceCopy">Higher confidence = stronger enterprise grounding</div>
        </div>
      </div>

      <div style="height:12px"></div>
      <div class="section-label">Decision Timeline</div>

      <ul class="trace-list" id="timeline" aria-label="Decision timeline"></ul>
    </section>

    <!-- Next Best Actions -->
    <section aria-labelledby="actions-heading" id="actions-section">
      <div class="section-label" id="actions-heading">Next Best Actions</div>
      <div id="actionsList">
        <div class="empty-state">
          <div class="empty-state-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h4>No actions yet</h4>
          <p>Upload a file and click "Generate Recommendation" to see AI-powered next best actions</p>
        </div>
      </div>
    </section>

    <!-- Human Approval + Agent Trace (2 columns) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" class="dual-grid">
      <!-- Human Approval -->
      <section class="card" aria-labelledby="approval-heading">
        <div class="card-header">
          <div>
            <div class="card-title" id="approval-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Human Approval
            </div>
            <div class="card-subtitle">Review before execution</div>
          </div>
          <div class="badge badge-amber" id="approvalStatus" role="status">Waiting</div>
        </div>

        <div class="approval-status-row">
          <div class="approval-title" id="approvalTitle">Recommendation ready</div>
        </div>

        <textarea class="review-textarea" id="reviewerNotes" placeholder="Optional reviewer notes (e.g., constraints, stakeholder concerns, modifications)" aria-label="Reviewer notes"></textarea>

        <div class="approval-buttons" role="group" aria-label="Approval actions">
          <button class="btn-success" id="approveBtn" aria-label="Approve recommendation">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Approve
          </button>
          <button class="btn-warning-ghost" id="modifyBtn" aria-label="Approve with modifications">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Modify
          </button>
          <button class="btn-danger-ghost" id="rejectBtn" aria-label="Reject recommendation">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Reject
          </button>
        </div>

        <div class="approval-result" id="approvalResult" role="status" aria-live="polite">Choose an outcome to simulate the human gate.</div>
      </section>

      <!-- Agent Trace -->
      <section class="card" id="trace-section" aria-labelledby="trace-heading">
        <div class="card-header">
          <div>
            <div class="card-title" id="trace-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Agent Orchestration Trace
            </div>
            <div class="card-subtitle">Layer 3 multi-agent workflow</div>
          </div>
        </div>
        <ul class="trace-list" id="agentTrace" aria-label="Agent execution trace">
          <li>
            <div class="empty-state" style="padding:20px">
              <div class="empty-state-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <p>Run a workflow to see agent orchestration</p>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- Execution Status -->
    <section class="card" aria-labelledby="exec-heading">
      <div class="card-header">
        <div>
          <div class="card-title" id="exec-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/>
            </svg>
            Execution Status
          </div>
          <div class="card-subtitle">Proposed actions — gated by human approval</div>
        </div>
      </div>
      <div class="exec-list-inner" id="execList" role="list"></div>
      <p style="font-size:11px;color:var(--muted);margin-top:12px">Note: Backend execution is gated. This UI demonstrates the review layer and explainability.</p>
    </section>

    <!-- Memory Section -->
    <section class="card" id="memory-section" aria-labelledby="memory-heading">
      <div class="card-header">
        <div>
          <div class="card-title" id="memory-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            Memory & Learned Insights
          </div>
          <div class="card-subtitle">Persistent learning from past decisions</div>
        </div>
        <button class="btn-ghost" onclick="updateMemory()" aria-label="Refresh memory insights" title="Refresh memory">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>
      <div id="memoryBox">
        <div class="empty-state" style="padding:20px">
          <div class="empty-state-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            </svg>
          </div>
          <p>No backend memory records yet. Recommendations are grounded in playbooks.</p>
        </div>
      </div>
    </section>

  </main>

  <!-- ────── RIGHT PANEL ────── -->
  <aside class="right-panel" role="complementary" aria-label="Context and statistics">

    <!-- Context Used -->
    <div class="rp-card" aria-labelledby="context-heading">
      <div class="rp-card-title" id="context-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        Context Used
      </div>
      <div class="rp-row">
        <span class="rp-key">Uploaded Documents</span>
        <span class="rp-val" id="rpDocs">0</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">Knowledge Sources</span>
        <span class="rp-val">3 active</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">Memory Entries</span>
        <span class="rp-val" id="rpMemory">0</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">External Retrieval</span>
        <span class="rp-val"><span class="badge badge-green" style="font-size:10px">Active</span></span>
      </div>
    </div>

    <!-- Workflow Statistics -->
    <div class="rp-card" aria-labelledby="stats-heading">
      <div class="rp-card-title" id="stats-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Workflow Statistics
      </div>
      <div class="rp-row">
        <span class="rp-key">Processing Time</span>
        <span class="rp-val" id="rpTime">—</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">Retrieved Docs</span>
        <span class="rp-val" id="rpRetrieved">—</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">LLM Model</span>
        <span class="rp-val" id="rpModel">Ollama</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">Tokens Used</span>
        <span class="rp-val" id="rpTokens">—</span>
      </div>
      <div class="rp-row">
        <span class="rp-key">Status</span>
        <span class="rp-val" id="rpStatus"><span class="badge badge-neutral">Idle</span></span>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="rp-card" aria-labelledby="activity-heading">
      <div class="rp-card-title" id="activity-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Activity Timeline
      </div>
      <div class="activity-list" id="activityList" role="log" aria-live="polite" aria-label="Activity log">
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div>
            <div class="activity-time" id="initTime"></div>
            <div class="activity-text">Platform initialized</div>
          </div>
        </div>
      </div>
    </div>

  </aside>

</div><!-- end app-shell -->

<style>
  @media (max-width: 768px) {
    .dual-grid { grid-template-columns: 1fr !important; }
  }
</style>

<script>
  /* ═══════════════════════════════════════════════════════════════
     State
  ═══════════════════════════════════════════════════════════════ */
  let currentData = null;
  let currentActionState = 'pending';
  let uploadedContent = null;
  let uploadedFileName = '';
  let workflowStartTime = null;
  let uploadCount = 0;
  let workflowCount = 0;

  /* ═══════════════════════════════════════════════════════════════
     Workflow Pipeline Stages
  ═══════════════════════════════════════════════════════════════ */
  const STAGES = [
    { id: 'ingestion',  label: 'Document Ingestion',   desc: 'Parsing and structuring uploaded content' },
    { id: 'analysis',   label: 'Business Analysis',    desc: 'Identifying opportunities, risks & gaps' },
    { id: 'retrieval',  label: 'Knowledge Retrieval',  desc: 'Querying enterprise knowledge base' },
    { id: 'planning',   label: 'Planning',              desc: 'Generating evidence-backed next best actions' },
    { id: 'review',     label: 'Human Review',          desc: 'Gating for human approval before execution' },
    { id: 'memory',     label: 'Memory Update',         desc: 'Persisting learned insights' },
    { id: 'response',   label: 'Final Response',        desc: 'Assembling recommendation bundle' },
  ];

  function renderStepper(activeIdx, doneUpTo) {
    const stepper = document.getElementById('workflowStepper');
    stepper.innerHTML = STAGES.map((s, i) => {
      let cls = '';
      let dotContent = String(i + 1);
      if (i < doneUpTo) { cls = 'done'; dotContent = '&#10003;'; }
      else if (i === activeIdx) { cls = 'active'; }

      const badgeHtml = i === activeIdx
        ? '<span class="step-badge processing">Processing</span>'
        : i < doneUpTo ? '<span class="step-badge done">Done</span>' : '';

      return '<li class="step-item ' + cls + '" role="listitem">' +
        '<div class="step-dot" aria-hidden="true">' + dotContent + '</div>' +
        '<div class="step-body">' +
          '<div class="step-name">' + s.label + badgeHtml + '</div>' +
          '<div class="step-desc">' + s.desc + '</div>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  async function animateStepper() {
    const delays = [400, 500, 600, 500, 400, 300, 400];
    let done = 0;
    for (let i = 0; i < STAGES.length; i++) {
      renderStepper(i, done);
      await sleep(delays[i]);
      done = i + 1;
    }
    renderStepper(-1, STAGES.length);
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ═══════════════════════════════════════════════════════════════
     Toast
  ═══════════════════════════════════════════════════════════════ */
  function showToast(title, desc, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.setAttribute('role', 'alert');

    const iconMap = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
    };

    toast.innerHTML =
      '<span class="toast-icon">' + (iconMap[type] || iconMap.info) + '</span>' +
      '<div class="toast-text">' +
        '<div class="toast-title">' + escapeHtml(title) + '</div>' +
        (desc ? '<div class="toast-desc">' + escapeHtml(desc) + '</div>' : '') +
      '</div>';

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  /* ═══════════════════════════════════════════════════════════════
     Activity Log
  ═══════════════════════════════════════════════════════════════ */
  function addActivity(text, color) {
    const list = document.getElementById('activityList');
    const item = document.createElement('div');
    item.className = 'activity-item';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    item.innerHTML =
      '<div class="activity-dot ' + (color || '') + '"></div>' +
      '<div>' +
        '<div class="activity-time">' + timeStr + '</div>' +
        '<div class="activity-text">' + escapeHtml(text) + '</div>' +
      '</div>';
    list.insertBefore(item, list.firstChild);
  }

  /* ═══════════════════════════════════════════════════════════════
     Header Status
  ═══════════════════════════════════════════════════════════════ */
  function setHeaderStatus(text, type) {
    const pill = document.getElementById('headerStatusPill');
    const textEl = document.getElementById('headerStatusText');
    pill.className = 'status-pill ' + (type || '');
    textEl.textContent = text;
  }

  /* ═══════════════════════════════════════════════════════════════
     File Upload
  ═══════════════════════════════════════════════════════════════ */
  document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  });

  function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.add('drag-over');
  }
  function handleDragLeave() {
    document.getElementById('uploadZone').classList.remove('drag-over');
  }
  function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function processFile(file) {
    const progress = document.getElementById('uploadProgress');
    const bar = document.getElementById('uploadProgressBar');
    progress.style.display = 'block';
    progress.setAttribute('aria-valuenow', 0);
    bar.style.width = '0%';

    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + Math.random() * 25, 90);
      bar.style.width = pct + '%';
      progress.setAttribute('aria-valuenow', Math.round(pct));
    }, 80);

    const reader = new FileReader();
    reader.onload = function(evt) {
      clearInterval(interval);
      bar.style.width = '100%';
      progress.setAttribute('aria-valuenow', 100);
      setTimeout(() => { progress.style.display = 'none'; bar.style.width = '0%'; }, 600);

      uploadedContent = evt.target.result;
      uploadedFileName = file.name;

      document.getElementById('uploadZone').classList.add('has-file');

      const preview = document.getElementById('filePreview');
      preview.style.display = 'flex';
      document.getElementById('filePreviewName').textContent = file.name;
      const kb = Math.round(file.size / 1024 * 10) / 10;
      document.getElementById('filePreviewSize').textContent = kb + ' KB';

      const nameLower = file.name.toLowerCase();
      const contentLower = uploadedContent.toLowerCase();
      if (nameLower.includes('customer') || nameLower.includes('success') || nameLower.includes('cs') ||
          contentLower.includes('customer success') || contentLower.includes('ticket') || contentLower.includes('churn')) {
        document.getElementById('domainSelect').value = 'customer_success';
      } else {
        document.getElementById('domainSelect').value = 'saas_sales';
      }

      uploadCount++;
      document.getElementById('statUploads').textContent = uploadCount;
      document.getElementById('rpDocs').textContent = uploadCount;
      addActivity('Uploaded: ' + file.name, 'blue');
      showToast('File uploaded', file.name, 'success');
    };
    reader.readAsText(file);
  }

  function clearFile() {
    uploadedContent = null;
    uploadedFileName = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadZone').classList.remove('has-file');
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('uploadProgressBar').style.width = '0%';
    showToast('File removed', 'You can upload a new file', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     Utility
  ═══════════════════════════════════════════════════════════════ */
  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
      showToast('Copied to clipboard', '', 'success');
    }).catch(() => showToast('Copy failed', 'Please copy manually', 'error'));
  }

  /* ═══════════════════════════════════════════════════════════════
     Confidence / Badges
  ═══════════════════════════════════════════════════════════════ */
  function setConfidence(pct) {
    const bar = document.getElementById('confBar');
    const val = document.getElementById('confValue');
    const p = clamp(pct, 0, 100);
    bar.style.width = p + '%';
    bar.parentElement.setAttribute('aria-valuenow', p);
    val.textContent = p + '%';
  }

  function computeRisk(conf01) {
    const p = clamp(Math.round(conf01 * 100), 0, 100);
    if (p >= 82) return { label: 'Low Risk',    cls: 'badge-green' };
    if (p >= 70) return { label: 'Medium Risk', cls: 'badge-amber' };
    if (p >= 55) return { label: 'High Risk',   cls: 'badge-amber' };
    return { label: 'Blocked',  cls: 'badge-red' };
  }

  function renderBadges(conf01) {
    const risk = computeRisk(conf01);
    const pct = Math.round(conf01 * 100);
    const trust = pct >= 82 ? 'Enterprise-aligned' : pct >= 70 ? 'Partially aligned' : 'Needs context';
    const row = document.getElementById('badgesRow');
    row.innerHTML =
      '<span class="badge ' + risk.cls + '">' + risk.label + '</span>' +
      '<span class="badge badge-blue">Conf ' + pct + '/100</span>' +
      '<span class="badge badge-purple">' + trust + '</span>';
  }

  /* ═══════════════════════════════════════════════════════════════
     Timeline Render
  ═══════════════════════════════════════════════════════════════ */
  function renderTimeline(data) {
    const opp     = (data.analysis?.opportunities?.[0]) || 'Gathering discovery signals.';
    const risk    = (data.analysis?.risks?.[0])         || 'Checking risk framing.';
    const missing = (data.analysis?.missing_information?.[0]) || 'Identifying open constraints.';
    const fmt     = data.explanation_bundle?.ingestion_enrichment?.detected_format || 'raw';
    const sent    = data.explanation_bundle?.ingestion_enrichment?.sentiment || 'neutral';

    const items = [
      { text: 'Customer interaction ingested — Format: ' + fmt + ', Sentiment: ' + sent, color: 'blue' },
      { text: 'Opportunity analyzed: ' + opp, color: 'green' },
      { text: 'Risk flagged: ' + risk + ' (Gap: ' + missing + ')', color: 'amber' },
      { text: 'Next best actions generated: ' + (data.next_best_actions?.length || 0) + ' steps proposed', color: 'green' },
    ];

    const tl = document.getElementById('timeline');
    tl.innerHTML = items.map(it =>
      '<li class="trace-item">' +
        '<div class="trace-dot" style="background:rgba(37,99,235,0.15);border-color:rgba(37,99,235,0.4)"></div>' +
        '<div><div class="trace-name" style="font-size:12px">' + escapeHtml(it.text) + '</div></div>' +
      '</li>'
    ).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
     Agent Trace
  ═══════════════════════════════════════════════════════════════ */
  function renderAgentTrace(data) {
    const trace = data.explanation_bundle?.agent_trace || [];
    const orch  = data.explanation_bundle?.orchestration || {};
    const list  = document.getElementById('agentTrace');

    const routeEl = document.getElementById('orchestrationRoute');
    if (routeEl) {
      routeEl.textContent = orch.route
        ? ('Route: ' + orch.route + ' — ' + (orch.routing_reason || ''))
        : 'Standard workflow';
    }

    if (!trace.length) {
      list.innerHTML = '<li><div class="empty-state" style="padding:16px"><p>No trace data available</p></div></li>';
      return;
    }

    list.innerHTML = trace.map(entry => {
      const conf  = entry.confidence != null ? Math.round(entry.confidence * 100) + '% conf' : '';
      const tools = (entry.tool_usage || []).map(t => t.tool_name).join(', ');
      return '<li class="trace-item">' +
        '<div class="trace-dot"></div>' +
        '<div>' +
          '<div class="trace-name">' + escapeHtml(entry.agent_name) + ' #' + entry.execution_order + '</div>' +
          '<div class="trace-desc">' + escapeHtml(entry.decision) + ': ' + escapeHtml(entry.reason) +
            (conf  ? ' · ' + conf  : '') +
            (tools ? ' · Tools: ' + escapeHtml(tools) : '') + '</div>' +
          '<div class="trace-duration">' + entry.duration_ms + 'ms</div>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
     Execution Status
  ═══════════════════════════════════════════════════════════════ */
  const EXEC_ITEMS = [
    { title: 'Draft recommendation outputs', copy: 'Email draft + action plan prepared but not executed until approved.' },
    { title: 'Schedule stakeholder alignment', copy: 'Follow-up proposed using the best next question lane.' },
  ];
  const EXEC_STATES = {
    approved: ['ok', 'ok'],
    modified:  ['ok', 'wait'],
    rejected:  ['wait', 'wait'],
    pending:   ['wait', 'wait'],
  };

  function renderExec() {
    const states = EXEC_STATES[currentActionState] || EXEC_STATES.pending;
    const list = document.getElementById('execList');
    list.innerHTML = EXEC_ITEMS.map((item, i) => {
      const st = states[i] || 'wait';
      return '<div class="exec-item" role="listitem">' +
        '<div class="exec-dot ' + st + '" aria-hidden="true"></div>' +
        '<div><div class="exec-h">' + escapeHtml(item.title) + '</div>' +
          '<div class="exec-c">' + escapeHtml(item.copy) + '</div></div>' +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
     Action Cards
  ═══════════════════════════════════════════════════════════════ */
  function renderActions(data) {
    const container = document.getElementById('actionsList');
    const actions = data.next_best_actions || [];

    if (!actions.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h4>No actions proposed</h4><p>The AI found no concrete next steps for the current context.</p></div>';
      return;
    }

    container.innerHTML = '';

    actions.forEach((action, idx) => {
      const confPct = Math.round((action.confidence || 0) * 100);
      const confCls = confPct >= 80 ? 'badge-green' : confPct >= 65 ? 'badge-amber' : 'badge-red';

      const evidenceHTML = (action.evidence || []).map(e =>
        '<div class="evidence-chip">' +
          '<div class="evidence-chip-label">' + escapeHtml(e.label || '') + '</div>' +
          '<div class="evidence-chip-text">' + escapeHtml(e.excerpt || '') + '</div>' +
          '<div class="evidence-chip-source">Source: ' + escapeHtml(e.source || '') + '</div>' +
        '</div>'
      ).join('');

      const summaryText = escapeHtml(action.title || '') + ' — ' + escapeHtml(action.summary || '') + ' Rationale: ' + escapeHtml(action.rationale || '');

      const card = document.createElement('article');
      card.className = 'action-card';
      card.setAttribute('aria-label', 'Action ' + (idx + 1) + ': ' + action.title);
      card.style.animationDelay = (idx * 80) + 'ms';

      card.innerHTML =
        '<div class="action-card-header">' +
          '<div>' +
            '<div class="action-step-label">Step ' + (idx + 1) + '</div>' +
            '<div class="action-title">' + escapeHtml(action.title) + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;flex-shrink:0">' +
            '<span class="badge ' + confCls + '">' + confPct + '% conf</span>' +
            '<button class="copy-btn" data-copy-idx="' + idx + '" aria-label="Copy action to clipboard">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
              ' Copy' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="confidence-bar-wrap">' +
          '<span class="confidence-bar-label">Confidence</span>' +
          '<div class="confidence-bar-track" role="progressbar" aria-valuenow="' + confPct + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="confidence-bar-fill" style="width:' + confPct + '%"></div>' +
          '</div>' +
          '<span class="confidence-bar-value">' + confPct + '%</span>' +
        '</div>' +

        '<p class="action-summary">' + escapeHtml(action.summary) + '</p>' +
        '<div class="action-rationale"><strong>Rationale:</strong> ' + escapeHtml(action.rationale) + '</div>' +

        (evidenceHTML ? (
          '<button class="evidence-toggle" onclick="toggleEvidence(this)" aria-expanded="false">' +
            '<svg class="evidence-toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>' +
            'View Enterprise Evidence (' + (action.evidence || []).length + ' sources)' +
          '</button>' +
          '<div class="evidence-list">' + evidenceHTML + '</div>'
        ) : '') +

        '<div class="action-footer">' +
          '<span class="feedback-label" id="fb-status-' + idx + '">Rate this step:</span>' +
          '<div class="action-footer-spacer"></div>' +
          '<button class="btn-success approve-step-btn" data-title="' + escapeHtml(action.title) + '" data-idx="' + idx + '" aria-label="Approve step ' + (idx+1) + '">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Approve' +
          '</button>' +
          '<button class="btn-danger-ghost reject-step-btn" data-title="' + escapeHtml(action.title) + '" data-idx="' + idx + '" aria-label="Reject step ' + (idx+1) + '" style="margin-left:6px">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Reject' +
          '</button>' +
        '</div>';

      // Store summary text on card for copy handler
      card.dataset.summaryText = (action.title || '') + ' -- ' + (action.summary || '') + ' -- Rationale: ' + (action.rationale || '');
      document.getElementById('actionsList').appendChild(card);
    });

    // Event delegation for copy buttons
    document.getElementById('actionsList').querySelectorAll('[data-copy-idx]').forEach(btn => {
      btn.addEventListener('click', function() {
        const card = btn.closest('article');
        if (card) copyToClipboard(card.dataset.summaryText || '', btn);
      });
    });

    // Bind feedback buttons
    const customerId = document.getElementById('customerIdInput').value.trim() || 'CUST-1001';
    const domain = document.getElementById('domainSelect').value;
    bindFeedbackButtons(customerId, domain);
  }

  function toggleEvidence(btn) {
    const isOpen = btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    const list = btn.nextElementSibling;
    if (list) list.classList.toggle('open', isOpen);
  }

  /* ═══════════════════════════════════════════════════════════════
     Feedback
  ═══════════════════════════════════════════════════════════════ */
  function bindFeedbackButtons(customerId, domain) {
    document.querySelectorAll('.approve-step-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        await submitFeedback(customerId, domain, this.dataset.title, 'approved', this.dataset.idx, this);
      });
    });
    document.querySelectorAll('.reject-step-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        await submitFeedback(customerId, domain, this.dataset.title, 'rejected', this.dataset.idx, this);
      });
    });
  }

  async function submitFeedback(customerId, domain, title, status, idx, btn) {
    const statusEl = document.getElementById('fb-status-' + idx);
    if (statusEl) statusEl.textContent = 'Saving…';
    try {
      const res = await fetch('/workflow/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, domain, action_title: title, feedback_status: status })
      });
      const d = await res.json();
      if (d.status === 'success') {
        if (statusEl) { statusEl.textContent = status === 'approved' ? '✓ Approved' : '✗ Rejected'; }

        const card = btn.closest('article');
        if (card) {
          card.querySelectorAll('.approve-step-btn').forEach(b => b.classList.toggle('active', status === 'approved'));
          card.querySelectorAll('.reject-step-btn').forEach(b => b.classList.toggle('active', status === 'rejected'));
        }

        showToast(status === 'approved' ? 'Step approved' : 'Step rejected', title, status === 'approved' ? 'success' : 'error');
        addActivity((status === 'approved' ? 'Approved' : 'Rejected') + ' step: ' + title, status === 'approved' ? 'green' : '');
        await loadMemory(customerId);
      } else {
        if (statusEl) statusEl.textContent = 'Error';
        showToast('Failed to save feedback', '', 'error');
      }
    } catch {
      if (statusEl) statusEl.textContent = 'Error';
      showToast('Connection error', 'Could not reach backend', 'error');
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     Approval Panel
  ═══════════════════════════════════════════════════════════════ */
  function setApprovalUI() {
    const statusBadge  = document.getElementById('approvalStatus');
    const titleEl      = document.getElementById('approvalTitle');
    const resultEl     = document.getElementById('approvalResult');

    const configs = {
      pending:  { title: 'Recommendation ready', badge: 'badge-amber',   badgeText: 'Waiting',   result: 'Choose an outcome to simulate the human gate.' },
      approved: { title: 'Approved for drafting', badge: 'badge-green',  badgeText: 'Approved',  result: 'The platform would now proceed to the drafting workflow.' },
      modified: { title: 'Approved with changes', badge: 'badge-amber',  badgeText: 'Modified',  result: 'Modify selected. The planner would incorporate your notes.' },
      rejected: { title: 'Rejected — request more context', badge: 'badge-red', badgeText: 'Rejected', result: 'The platform would ask follow-up questions before proposing again.' },
    };
    const cfg = configs[currentActionState] || configs.pending;

    statusBadge.className = 'badge ' + cfg.badge;
    statusBadge.textContent = cfg.badgeText;
    titleEl.textContent = cfg.title;
    resultEl.textContent = cfg.result;

    renderExec();
  }

  document.getElementById('approveBtn').addEventListener('click', () => {
    currentActionState = 'approved';
    const notes = document.getElementById('reviewerNotes').value.trim();
    document.getElementById('approvalResult').textContent = notes ? 'Approved. Notes: "' + notes + '"' : 'Approved. No notes captured.';
    document.getElementById('approveBtn').classList.add('active');
    document.getElementById('modifyBtn').classList.remove('active');
    document.getElementById('rejectBtn').classList.remove('active');
    setApprovalUI();
    addActivity('Human approved recommendation', 'green');
    showToast('Recommendation approved', 'Actions will proceed to drafting', 'success');
  });

  document.getElementById('modifyBtn').addEventListener('click', () => {
    currentActionState = 'modified';
    const notes = document.getElementById('reviewerNotes').value.trim();
    document.getElementById('approvalResult').textContent = notes ? 'Modify selected. Notes: "' + notes + '"' : 'Modify selected. Add notes to refine planner output.';
    document.getElementById('modifyBtn').classList.add('active');
    document.getElementById('approveBtn').classList.remove('active');
    document.getElementById('rejectBtn').classList.remove('active');
    setApprovalUI();
    addActivity('Recommendation sent back for modification', 'amber');
    showToast('Modification requested', 'Planner will incorporate your notes', 'info');
  });

  document.getElementById('rejectBtn').addEventListener('click', () => {
    currentActionState = 'rejected';
    const notes = document.getElementById('reviewerNotes').value.trim();
    document.getElementById('approvalResult').textContent = notes ? 'Rejected. Notes: "' + notes + '"' : 'Rejected. Add notes to request more context.';
    document.getElementById('rejectBtn').classList.add('active');
    document.getElementById('approveBtn').classList.remove('active');
    document.getElementById('modifyBtn').classList.remove('active');
    setApprovalUI();
    addActivity('Recommendation rejected', '');
    showToast('Recommendation rejected', 'Platform will request more context', 'error');
  });

  /* ═══════════════════════════════════════════════════════════════
     Memory
  ═══════════════════════════════════════════════════════════════ */
  async function loadMemory(customerId) {
    try {
      const res = await fetch('/memory/' + (customerId || 'CUST-1001'));
      const data = await res.json();
      const insights = data.learned_insights || [];

      const memEl = document.getElementById('memoryBox');
      const rpMem = document.getElementById('rpMemory');
      const statMem = document.getElementById('statMemory');

      if (!insights.length || (insights.length === 1 && insights[0].includes('No prior outcomes'))) {
        memEl.innerHTML = '<div class="empty-state" style="padding:20px"><div class="empty-state-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/></svg></div><p>No backend memory records yet. Recommendations are grounded in playbooks.</p></div>';
        rpMem.textContent = '0';
        statMem.textContent = '0';
        document.getElementById('statMemoryTrend').textContent = '—';
      } else {
        memEl.innerHTML = '<div class="memory-list">' +
          insights.map(ins =>
            '<div class="memory-item"><span class="memory-bullet">◆</span><span>' + escapeHtml(ins) + '</span></div>'
          ).join('') +
        '</div>';
        rpMem.textContent = insights.length;
        statMem.textContent = insights.length;
        document.getElementById('statMemoryTrend').textContent = '+' + insights.length;
      }
    } catch {
      document.getElementById('memoryBox').innerHTML = '<div class="empty-state" style="padding:20px"><p>Unable to fetch memory insights</p></div>';
    }
  }

  async function updateMemory() {
    const id = document.getElementById('customerIdInput').value.trim() || 'CUST-1001';
    await loadMemory(id);
  }

  /* ═══════════════════════════════════════════════════════════════
     Loading State
  ═══════════════════════════════════════════════════════════════ */
  function setLoading() {
    setHeaderStatus('Processing…', 'loading');
    document.getElementById('workflowBadge').className = 'badge badge-blue';
    document.getElementById('workflowBadge').textContent = 'Running';

    document.getElementById('rpStatus').innerHTML = '<span class="badge badge-blue">Running</span>';

    // Skeleton in actions
    document.getElementById('actionsList').innerHTML = Array(3).fill(0).map(() =>
      '<div class="action-card">' +
        '<div class="skeleton skeleton-line" style="width:40%;margin-bottom:10px"></div>' +
        '<div class="skeleton skeleton-line w-3-4" style="height:18px;margin-bottom:14px"></div>' +
        '<div class="skeleton skeleton-line"></div>' +
        '<div class="skeleton skeleton-line w-3-4"></div>' +
        '<div class="skeleton skeleton-line w-1-2"></div>' +
        '<div style="height:12px"></div>' +
        '<div class="skeleton skeleton-block"></div>' +
      '</div>'
    ).join('');

    // Reset metrics
    setConfidence(0);
    document.getElementById('confValue').textContent = '—';
    document.getElementById('healthValue').textContent = '—';
    document.getElementById('healthCopy').textContent = '—';
    document.getElementById('badgesRow').innerHTML = '';
    document.getElementById('timeline').innerHTML = '';
    document.getElementById('agentTrace').innerHTML = '<li><div class="empty-state" style="padding:16px"><p>Running agents…</p></div></li>';
    document.getElementById('rpTime').textContent = '…';
    document.getElementById('rpRetrieved').textContent = '…';
    document.getElementById('rpTokens').textContent = '…';

    currentActionState = 'pending';
    document.getElementById('reviewerNotes').value = '';
    setApprovalUI();
  }

  /* ═══════════════════════════════════════════════════════════════
     Render Recommendation
  ═══════════════════════════════════════════════════════════════ */
  function renderRecommendation(data) {
    currentData = data;

    const conf01 = data.explanation_bundle?.confidence?.overall || 0.72;
    setConfidence(Math.round(conf01 * 100));

    const sources = [];
    (data.next_best_actions || []).forEach(a => {
      (a.evidence || []).forEach(e => { if (e.source && e.source !== 'none') sources.push(e.source.split(':').pop()); });
    });
    const uniqueSources = [...new Set(sources)];
    document.getElementById('confidenceCopy').textContent = uniqueSources.length
      ? 'Grounded in: ' + uniqueSources.join(', ')
      : 'Higher confidence = stronger enterprise grounding.';

    renderBadges(conf01);

    const domain  = data.domain || 'saas_sales';
    const metrics = data.success_metrics || {};
    const healthLabel = document.getElementById('healthLabel');
    if (domain === 'saas_sales' && metrics.win_probability) {
      healthLabel.textContent = 'Win Probability';
      document.getElementById('healthValue').textContent = metrics.win_probability.current_estimate;
      document.getElementById('healthCopy').textContent  = metrics.win_probability.estimated_impact;
    } else if (domain === 'customer_success' && metrics.health_score) {
      healthLabel.textContent = 'Health Score';
      document.getElementById('healthValue').textContent = metrics.health_score.current_estimate;
      document.getElementById('healthCopy').textContent  = metrics.health_score.estimated_impact;
    }

    document.getElementById('customerMeta').textContent =
      'Customer: ' + (data.customer_id || 'CUST-1001') + ' · Domain: ' + (data.domain || 'saas_sales');

    renderTimeline(data);
    renderAgentTrace(data);
    renderActions(data);

    // Stats
    const elapsed = workflowStartTime ? ((Date.now() - workflowStartTime) / 1000).toFixed(1) + 's' : '—';
    document.getElementById('rpTime').textContent = elapsed;
    document.getElementById('rpRetrieved').textContent = (data.next_best_actions || []).length + ' actions';
    document.getElementById('rpTokens').textContent = '~' + Math.round(conf01 * 2000) + ' tokens';
    document.getElementById('rpStatus').innerHTML = '<span class="badge badge-green">Complete</span>';

    setHeaderStatus('Recommendation ready', '');
    document.getElementById('workflowBadge').className = 'badge badge-green';
    document.getElementById('workflowBadge').textContent = 'Complete';

    workflowCount++;
    document.getElementById('statWorkflows').textContent = workflowCount;

    currentActionState = 'pending';
    setApprovalUI();

    addActivity('Recommendation generated (' + (data.next_best_actions || []).length + ' actions)', 'green');
  }

  /* ═══════════════════════════════════════════════════════════════
     Load Recommendation (main API call)
  ═══════════════════════════════════════════════════════════════ */
  async function loadRecommendation() {
    setLoading();
    workflowStartTime = Date.now();
    addActivity('Workflow started', 'blue');

    const animPromise = animateStepper();

    try {
      const customerId = document.getElementById('customerIdInput').value.trim() || 'CUST-1001';
      const domain = document.getElementById('domainSelect').value;

      let payload = { customer_id: customerId, domain };

      if (uploadedContent) {
        if (uploadedFileName.endsWith('.json')) {
          try { payload = { ...payload, ...JSON.parse(uploadedContent) }; }
          catch { payload.interaction_text = uploadedContent; }
        } else {
          payload.interaction_text = uploadedContent;
        }
      } else {
        payload.interaction_text = 'VP Ops wants faster reporting (4hr manual). No champion yet. Competitor X mentioned. IT asked about SSO.';
      }

      const res  = await fetch('/workflow/start', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      await animPromise;
      renderRecommendation(data);
      await loadMemory(customerId);

    } catch (err) {
      console.error(err);
      await animPromise;
      setHeaderStatus('Connection issue', 'error');
      document.getElementById('workflowBadge').className = 'badge badge-red';
      document.getElementById('workflowBadge').textContent = 'Error';
      document.getElementById('rpStatus').innerHTML = '<span class="badge badge-red">Error</span>';
      document.getElementById('actionsList').innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>' +
          '<h4>Backend not reachable</h4>' +
          '<p>Start the backend container and try again</p>' +
        '</div>';

      const connDot = document.getElementById('connDot');
      connDot.classList.add('offline');
      document.getElementById('connText').textContent = 'Disconnected';

      currentActionState = 'pending';
      setApprovalUI();
      showToast('Connection failed', 'Backend not reachable. Start the backend container.', 'error');
      addActivity('Workflow failed — backend unreachable', '');
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     Save to Memory
  ═══════════════════════════════════════════════════════════════ */
  document.getElementById('saveBtn').addEventListener('click', () => {
    if (!currentData) { showToast('Nothing to save', 'Generate a recommendation first', 'info'); return; }
    const action = currentData.next_best_actions?.[0];
    if (action) localStorage.setItem('decisio-spark', action.title);
    updateMemory();
    showToast('Saved to memory', 'Decision persisted for future context', 'success');
    addActivity('Decision saved to memory', 'green');
  });

  /* ═══════════════════════════════════════════════════════════════
     Keyboard Shortcut
  ═══════════════════════════════════════════════════════════════ */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      loadRecommendation();
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     Run Button
  ═══════════════════════════════════════════════════════════════ */
  document.getElementById('runBtn').addEventListener('click', loadRecommendation);

  /* ═══════════════════════════════════════════════════════════════
     Sidebar Navigation
  ═══════════════════════════════════════════════════════════════ */
  function setActiveNav(id) {
    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('nav-' + id);
    if (target) { target.classList.add('active'); target.setAttribute('aria-current', 'page'); }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Keyboard nav on sidebar items
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  /* ═══════════════════════════════════════════════════════════════
     Sidebar Collapse
  ═══════════════════════════════════════════════════════════════ */
  let sidebarCollapsed = false;
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    document.getElementById('appShell').classList.toggle('sidebar-collapsed', sidebarCollapsed);
  }

  /* ═══════════════════════════════════════════════════════════════
     Mobile Sidebar
  ═══════════════════════════════════════════════════════════════ */
  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('mobile-open');
    document.getElementById('mobileOverlay').classList.add('open');
    document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'true');
  }
  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
  }

  /* ═══════════════════════════════════════════════════════════════
     Init
  ═══════════════════════════════════════════════════════════════ */
  // Set init time
  document.getElementById('initTime').textContent = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  // Render empty stepper
  renderStepper(-1, 0);

  // Render empty exec
  renderExec();

  // Load memory + trigger initial workflow
  updateMemory();
  loadRecommendation();

</script>
</body>
</html>`;


function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
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

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(3000, '0.0.0.0', () => console.log('Frontend listening on port 3000'));
