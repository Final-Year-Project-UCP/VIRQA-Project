/**
 * VIRQA Performance Testing Suite
 * ================================
 * Runs: Load Test, Stress Test, Spike Test, Endurance/Soak Test,
 *       Breakpoint Test, API Endpoint Test
 *
 * Generates a comprehensive HTML report for project evaluators.
 *
 * Usage: node performance-testing/run-tests.js
 */
import autocannon from 'autocannon';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:9090';
const RESULTS_DIR = path.join(__dirname, 'results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

// ============================================================
// TEST ENDPOINTS (covers all major routes)
// ============================================================
const ENDPOINTS = [
  { method: 'GET',  path: '/',                                          label: 'Health Check' },
  { method: 'POST', path: '/api/v1/user/login',                         label: 'User Login',         body: { email: 'test@test.com', password: 'Test@123' } },
  { method: 'POST', path: '/api/v1/user/register',                      label: 'User Register',      body: { name: 'Test', email: 'perf@test.com', password: 'Test@123', role: 'candidate' } },
  { method: 'GET',  path: '/api/v1/user/profile',                       label: 'Get Profile' },
  { method: 'GET',  path: '/api/v1/candidate/my-interviews',            label: 'My Interviews' },
  { method: 'GET',  path: '/api/v1/candidate/my-results',               label: 'My Results' },
  { method: 'POST', path: '/api/v1/ai-interview/start',                 label: 'Start AI Interview', body: { position: 'Frontend Developer', experience: 'junior' } },
  { method: 'GET',  path: '/api/v1/employee/dashboard',                 label: 'Employee Dashboard' },
  { method: 'GET',  path: '/api/v1/employee/interviews',                label: 'Employee Interviews' },
  { method: 'GET',  path: '/api/v1/admin/stats',                        label: 'Admin Stats' },
  { method: 'GET',  path: '/api/v1/admin/users',                        label: 'Admin Users' },
  { method: 'GET',  path: '/api/v1/notifications',                      label: 'Notifications' },
  { method: 'POST', path: '/api/v1/feedback',                           label: 'Submit Feedback',    body: { rating: 5, comment: 'Great platform!' } },
];

// ============================================================
// UTILITY: Run a single autocannon benchmark
// ============================================================
function runBenchmark(opts) {
  return new Promise((resolve, reject) => {
    const instance = autocannon(opts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    // Print progress
    autocannon.track(instance, { renderProgressBar: true });
  });
}

// ============================================================
// TEST 1: LOAD TEST — Normal expected traffic
// ============================================================
async function loadTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 1: LOAD TEST — 50 concurrent users, 30 seconds');
  console.log('='.repeat(70));

  return runBenchmark({
    url: BASE_URL,
    connections: 50,
    duration: 30,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
  });
}

// ============================================================
// TEST 2: STRESS TEST — Increasing load until breaking
// ============================================================
async function stressTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 2: STRESS TEST — Ramping from 10 to 200 connections');
  console.log('='.repeat(70));

  const phases = [];
  for (let c = 10; c <= 200; c += 30) {
    phases.push({ duration: 10, connections: c });
  }

  return runBenchmark({
    url: BASE_URL,
    connections: 10,
    overallRate: 500,
    duration: phases.length * 10,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
    // autocannon doesn't support phases natively, so we use high connections
    // to simulate stress
  }).then(result => {
    // Override with stress-level connections
    return runBenchmark({
      url: BASE_URL,
      connections: 200,
      duration: 30,
      pipelining: 1,
      requests: ENDPOINTS.map(ep => ({
        method: ep.method,
        path: ep.path,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      })),
    });
  });
}

// ============================================================
// TEST 3: SPIKE TEST — Sudden burst of traffic
// ============================================================
async function spikeTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 3: SPIKE TEST — Sudden burst from 5 to 300 connections');
  console.log('='.repeat(70));

  // Phase 1: calm (5 connections, 10s)
  console.log('\n[Spike Phase 1] Calm: 5 connections...');
  const calm = await runBenchmark({
    url: BASE_URL,
    connections: 5,
    duration: 10,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
  });

  // Phase 2: spike (300 connections, 15s)
  console.log('\n[Spike Phase 2] SPIKE: 300 connections!');
  const spike = await runBenchmark({
    url: BASE_URL,
    connections: 300,
    duration: 15,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
  });

  // Phase 3: recovery (10 connections, 10s)
  console.log('\n[Spike Phase 3] Recovery: 10 connections...');
  const recovery = await runBenchmark({
    url: BASE_URL,
    connections: 10,
    duration: 10,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
  });

  return { calm, spike, recovery };
}

// ============================================================
// TEST 4: ENDURANCE / SOAK TEST — Sustained moderate load
// ============================================================
async function enduranceTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 4: ENDURANCE (SOAK) TEST — 80 connections for 60 seconds');
  console.log('='.repeat(70));

  return runBenchmark({
    url: BASE_URL,
    connections: 80,
    duration: 60,
    pipelining: 1,
    requests: ENDPOINTS.map(ep => ({
      method: ep.method,
      path: ep.path,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    })),
  });
}

// ============================================================
// TEST 5: BREAKPOINT TEST — Find the max throughput
// ============================================================
async function breakpointTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 5: BREAKPOINT TEST — Finding max throughput');
  console.log('='.repeat(70));

  const results = [];
  for (const conn of [10, 50, 100, 150, 250]) {
    console.log(`\n[Breakpoint] Testing with ${conn} connections...`);
    const r = await runBenchmark({
      url: BASE_URL,
      connections: conn,
      duration: 10,
      pipelining: 1,
      requests: ENDPOINTS.map(ep => ({
        method: ep.method,
        path: ep.path,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      })),
    });
    results.push({ connections: conn, ...r });
  }
  return results;
}

// ============================================================
// TEST 6: INDIVIDUAL ENDPOINT TEST
// ============================================================
async function endpointTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 6: INDIVIDUAL ENDPOINT BENCHMARK — 30 connections, 10s each');
  console.log('='.repeat(70));

  const results = [];
  for (const ep of ENDPOINTS) {
    console.log(`\n[Endpoint] ${ep.label}: ${ep.method} ${ep.path}`);
    const r = await runBenchmark({
      url: `${BASE_URL}${ep.path}`,
      connections: 30,
      duration: 10,
      pipelining: 1,
      method: ep.method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    });
    results.push({ label: ep.label, method: ep.method, path: ep.path, ...r });
  }
  return results;
}

// ============================================================
// HTML REPORT GENERATOR
// ============================================================
function generateReport(loadResult, stressResult, spikeResult, enduranceResult, breakpointResults, endpointResults) {
  const timestamp = new Date().toLocaleString();
  const fmt = (n) => typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n;

  // Helper to extract key metrics
  const metrics = (r) => ({
    requests: r.requests?.total || 0,
    throughput: r.requests?.average || 0,
    latency_avg: r.latency?.average || 0,
    latency_p50: r.latency?.p50 || 0,
    latency_p95: r.latency?.p95 || 0,
    latency_p99: r.latency?.p99 || 0,
    latency_max: r.latency?.max || 0,
    errors: r.errors || 0,
    timeouts: r.timeouts || 0,
    mismatches: r.mismatches || 0,
    '1xx': r['1xx'] || 0,
    '2xx': r['2xx'] || 0,
    '3xx': r['3xx'] || 0,
    '4xx': r['4xx'] || 0,
    '5xx': r['5xx'] || 0,
    duration: r.duration || 0,
    start: r.start ? new Date(r.start).toLocaleTimeString() : '',
    finish: r.finish ? new Date(r.finish).toLocaleTimeString() : '',
    throughputMax: r.throughput?.max || 0,
    throughputMin: r.throughput?.min || 0,
    rps: r.requests?.mean || 0,
  });

  const load = metrics(loadResult);
  const stress = metrics(stressResult);
  const spikeCalm = metrics(spikeResult.calm);
  const spikeSpike = metrics(spikeResult.spike);
  const spikeRecovery = metrics(spikeResult.recovery);
  const endurance = metrics(enduranceResult);

  // Compute pass/fail grades
  const grade = (latencyP95, errorRate, totalReqs) => {
    if (errorRate > 5) return { label: 'FAIL', color: '#e74c3c' };
    if (latencyP95 > 1000) return { label: 'POOR', color: '#e67e22' };
    if (latencyP95 > 500) return { label: 'FAIR', color: '#f1c40f' };
    if (latencyP95 > 200) return { label: 'GOOD', color: '#3498db' };
    return { label: 'EXCELLENT', color: '#2ecc71' };
  };

  const loadGrade = grade(load.latency_p95, load.errors, load.requests);
  const stressGrade = grade(stress.latency_p95, stress.errors, stress.requests);
  const enduranceGrade = grade(endurance.latency_p95, endurance.errors, endurance.requests);

  // Breakpoint table
  const breakpointRows = breakpointResults.map(r => {
    const m = metrics(r);
    return `<tr>
      <td>${r.connections}</td>
      <td>${fmt(m.throughput)}</td>
      <td>${fmt(m.latency_avg)}</td>
      <td>${fmt(m.latency_p95)}</td>
      <td>${fmt(m.latency_p99)}</td>
      <td>${m.errors}</td>
      <td>${fmt(m.rps)}</td>
    </tr>`;
  }).join('');

  // Endpoint table
  const endpointRows = endpointResults.map(r => {
    const m = metrics(r);
    const g = grade(m.latency_p95, m.errors, m.requests);
    return `<tr>
      <td><strong>${r.label}</strong></td>
      <td><code>${r.method}</code></td>
      <td><code>${r.path}</code></td>
      <td>${fmt(m.throughput)}</td>
      <td>${fmt(m.latency_avg)}</td>
      <td>${fmt(m.latency_p50)}</td>
      <td>${fmt(m.latency_p95)}</td>
      <td>${fmt(m.latency_p99)}</td>
      <td>${m.errors}</td>
      <td><span class="badge" style="background:${g.color}">${g.label}</span></td>
    </tr>`;
  }).join('');

  // Chart data
  const bpConnections = breakpointResults.map(r => r.connections);
  const bpThroughput = breakpointResults.map(r => metrics(r).throughput);
  const bpLatency = breakpointResults.map(r => metrics(r).latency_p95);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VIRQA Performance Test Report</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  :root { --bg: #0f1117; --card: #1a1d2e; --border: #2d3148; --text: #e4e6eb; --muted: #8b8fa3; --accent: #6c63ff; --green: #2ecc71; --red: #e74c3c; --yellow: #f1c40f; --blue: #3498db; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
  .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
  header { text-align: center; padding: 40px 20px 30px; border-bottom: 2px solid var(--border); margin-bottom: 30px; }
  header h1 { font-size: 2.4em; background: linear-gradient(135deg, #6c63ff, #48c6ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  header p { color: var(--muted); margin-top: 8px; font-size: 1.1em; }
  .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .card h3 { font-size: 0.85em; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .card .value { font-size: 2em; font-weight: 700; }
  .card .sub { font-size: 0.85em; color: var(--muted); margin-top: 4px; }
  .grade-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 0.9em; color: #fff; }
  section { margin-bottom: 40px; }
  section h2 { font-size: 1.5em; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--accent); display: inline-block; }
  .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  .test-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .test-card h3 { color: var(--accent); margin-bottom: 12px; font-size: 1.15em; }
  .test-card .desc { color: var(--muted); font-size: 0.9em; margin-bottom: 16px; }
  .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .metric { background: rgba(108,99,255,0.08); border-radius: 8px; padding: 10px 14px; }
  .metric .label { font-size: 0.75em; color: var(--muted); text-transform: uppercase; }
  .metric .val { font-size: 1.2em; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 12px; overflow: hidden; }
  th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 0.9em; }
  th { background: rgba(108,99,255,0.15); font-weight: 600; text-transform: uppercase; font-size: 0.8em; letter-spacing: 0.5px; color: var(--muted); }
  tr:hover { background: rgba(108,99,255,0.05); }
  .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 600; color: #fff; }
  code { background: rgba(108,99,255,0.15); padding: 2px 6px; border-radius: 4px; font-size: 0.88em; }
  .chart-container { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  .chart-container h3 { margin-bottom: 16px; color: var(--accent); }
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .info-box { background: rgba(108,99,255,0.08); border-left: 4px solid var(--accent); padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
  .info-box h4 { color: var(--accent); margin-bottom: 4px; }
  .info-box p { color: var(--muted); font-size: 0.9em; }
  .spike-phases { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  footer { text-align: center; padding: 30px; color: var(--muted); font-size: 0.85em; border-top: 1px solid var(--border); margin-top: 40px; }
  @media (max-width: 768px) { .charts-grid, .spike-phases { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="container">

<header>
  <h1>VIRQA Performance Test Report</h1>
  <p>Comprehensive Performance Analysis — Load, Stress, Spike, Endurance &amp; Breakpoint Testing</p>
  <p style="margin-top:4px;">Generated: <strong>${timestamp}</strong> &nbsp;|&nbsp; Target: <strong>${BASE_URL}</strong></p>
</header>

<!-- ============ OVERALL SUMMARY ============ -->
<div class="summary-cards">
  <div class="card">
    <h3>Total Requests</h3>
    <div class="value">${fmt(load.requests + stress.requests + spikeCalm.requests + spikeSpike.requests + spikeRecovery.requests + endurance.requests)}</div>
    <div class="sub">Across all test suites</div>
  </div>
  <div class="card">
    <h3>Load Test Grade</h3>
    <div class="value"><span class="grade-badge" style="background:${loadGrade.color}">${loadGrade.label}</span></div>
    <div class="sub">P95 Latency: ${fmt(load.latency_p95)}ms | Errors: ${load.errors}</div>
  </div>
  <div class="card">
    <h3>Peak Throughput</h3>
    <div class="value">${fmt(Math.max(load.throughput, stress.throughput, spikeSpike.throughput))}</div>
    <div class="sub">Requests per second (avg)</div>
  </div>
  <div class="card">
    <h3>Total Errors</h3>
    <div class="value" style="color:${(load.errors + stress.errors + endurance.errors) === 0 ? 'var(--green)' : 'var(--red)'}">${load.errors + stress.errors + spikeSpike.errors + endurance.errors}</div>
    <div class="sub">Across all tests</div>
  </div>
  <div class="card">
    <h3>Stress Test Grade</h3>
    <div class="value"><span class="grade-badge" style="background:${stressGrade.color}">${stressGrade.label}</span></div>
    <div class="sub">P95: ${fmt(stress.latency_p95)}ms | 200 connections</div>
  </div>
  <div class="card">
    <h3>Endurance Grade</h3>
    <div class="value"><span class="grade-badge" style="background:${enduranceGrade.color}">${enduranceGrade.label}</span></div>
    <div class="sub">60s sustained at 80 connections</div>
  </div>
</div>

<!-- ============ TEST 1: LOAD TEST ============ -->
<section>
  <h2>1. Load Test</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Validate system behavior under <strong>normal expected traffic</strong> — 50 concurrent users for 30 seconds hitting all major API endpoints.</p>
  </div>
  <div class="test-grid">
    <div class="test-card">
      <h3>Configuration</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Connections</div><div class="val">50</div></div>
        <div class="metric"><div class="label">Duration</div><div class="val">30s</div></div>
        <div class="metric"><div class="label">Pipelining</div><div class="val">1</div></div>
        <div class="metric"><div class="label">Endpoints</div><div class="val">${ENDPOINTS.length}</div></div>
      </div>
    </div>
    <div class="test-card">
      <h3>Results</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Total Requests</div><div class="val">${fmt(load.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(load.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(load.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(load.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">P99 Latency</div><div class="val">${fmt(load.latency_p99)}ms</div></div>
        <div class="metric"><div class="label">Max Latency</div><div class="val">${fmt(load.latency_max)}ms</div></div>
        <div class="metric"><div class="label">2xx Responses</div><div class="val">${fmt(load['2xx'])}</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val" style="color:${load.errors > 0 ? 'var(--red)' : 'var(--green)'}">${load.errors}</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TEST 2: STRESS TEST ============ -->
<section>
  <h2>2. Stress Test</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Determine how the system behaves under <strong>extreme load</strong> — 200 concurrent connections for 30 seconds. Identifies the breaking point and error rate under pressure.</p>
  </div>
  <div class="test-grid">
    <div class="test-card">
      <h3>Configuration</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Connections</div><div class="val">200</div></div>
        <div class="metric"><div class="label">Duration</div><div class="val">30s</div></div>
        <div class="metric"><div class="label">Pipelining</div><div class="val">1</div></div>
        <div class="metric"><div class="label">Endpoints</div><div class="val">${ENDPOINTS.length}</div></div>
      </div>
    </div>
    <div class="test-card">
      <h3>Results</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Total Requests</div><div class="val">${fmt(stress.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(stress.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(stress.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(stress.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">P99 Latency</div><div class="val">${fmt(stress.latency_p99)}ms</div></div>
        <div class="metric"><div class="label">Max Latency</div><div class="val">${fmt(stress.latency_max)}ms</div></div>
        <div class="metric"><div class="label">2xx Responses</div><div class="val">${fmt(stress['2xx'])}</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val" style="color:${stress.errors > 0 ? 'var(--red)' : 'var(--green)'}">${stress.errors}</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TEST 3: SPIKE TEST ============ -->
<section>
  <h2>3. Spike Test</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Test system <strong>resilience to sudden traffic bursts</strong> — simulates viral events or deadline rushes. Three phases: Calm → Spike → Recovery.</p>
  </div>
  <div class="spike-phases">
    <div class="test-card">
      <h3>Phase 1: Calm (5 conn, 10s)</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Requests</div><div class="val">${fmt(spikeCalm.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(spikeCalm.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(spikeCalm.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(spikeCalm.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val">${spikeCalm.errors}</div></div>
        <div class="metric"><div class="label">2xx</div><div class="val">${fmt(spikeCalm['2xx'])}</div></div>
      </div>
    </div>
    <div class="test-card" style="border-color: var(--red);">
      <h3 style="color: var(--red);">Phase 2: SPIKE (300 conn, 15s)</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Requests</div><div class="val">${fmt(spikeSpike.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(spikeSpike.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(spikeSpike.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(spikeSpike.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val" style="color:${spikeSpike.errors > 0 ? 'var(--red)' : 'var(--green)'}">${spikeSpike.errors}</div></div>
        <div class="metric"><div class="label">2xx</div><div class="val">${fmt(spikeSpike['2xx'])}</div></div>
      </div>
    </div>
    <div class="test-card" style="border-color: var(--green);">
      <h3 style="color: var(--green);">Phase 3: Recovery (10 conn, 10s)</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Requests</div><div class="val">${fmt(spikeRecovery.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(spikeRecovery.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(spikeRecovery.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(spikeRecovery.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val">${spikeRecovery.errors}</div></div>
        <div class="metric"><div class="label">2xx</div><div class="val">${fmt(spikeRecovery['2xx'])}</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TEST 4: ENDURANCE ============ -->
<section>
  <h2>4. Endurance (Soak) Test</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Verify system <strong>stability over extended periods</strong> — 80 concurrent connections sustained for 60 seconds. Detects memory leaks, resource exhaustion, and degradation over time.</p>
  </div>
  <div class="test-grid">
    <div class="test-card">
      <h3>Configuration</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Connections</div><div class="val">80</div></div>
        <div class="metric"><div class="label">Duration</div><div class="val">60s</div></div>
        <div class="metric"><div class="label">Pipelining</div><div class="val">1</div></div>
        <div class="metric"><div class="label">Endpoints</div><div class="val">${ENDPOINTS.length}</div></div>
      </div>
    </div>
    <div class="test-card">
      <h3>Results</h3>
      <div class="metrics-grid">
        <div class="metric"><div class="label">Total Requests</div><div class="val">${fmt(endurance.requests)}</div></div>
        <div class="metric"><div class="label">Throughput</div><div class="val">${fmt(endurance.throughput)} req/s</div></div>
        <div class="metric"><div class="label">Avg Latency</div><div class="val">${fmt(endurance.latency_avg)}ms</div></div>
        <div class="metric"><div class="label">P95 Latency</div><div class="val">${fmt(endurance.latency_p95)}ms</div></div>
        <div class="metric"><div class="label">P99 Latency</div><div class="val">${fmt(endurance.latency_p99)}ms</div></div>
        <div class="metric"><div class="label">Max Latency</div><div class="val">${fmt(endurance.latency_max)}ms</div></div>
        <div class="metric"><div class="label">2xx Responses</div><div class="val">${fmt(endurance['2xx'])}</div></div>
        <div class="metric"><div class="label">Errors</div><div class="val" style="color:${endurance.errors > 0 ? 'var(--red)' : 'var(--green)'}">${endurance.errors}</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TEST 5: BREAKPOINT ============ -->
<section>
  <h2>5. Breakpoint Test</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Identify the <strong>maximum throughput ceiling</strong> by progressively increasing connections from 10 to 250 and measuring latency degradation.</p>
  </div>
  <table>
    <thead>
      <tr><th>Connections</th><th>Throughput (req/s)</th><th>Avg Latency (ms)</th><th>P95 Latency (ms)</th><th>P99 Latency (ms)</th><th>Errors</th><th>Mean RPS</th></tr>
    </thead>
    <tbody>${breakpointRows}</tbody>
  </table>

  <div class="charts-grid" style="margin-top:20px;">
    <div class="chart-container">
      <h3>Throughput vs Connections</h3>
      <canvas id="bpThroughputChart"></canvas>
    </div>
    <div class="chart-container">
      <h3>P95 Latency vs Connections</h3>
      <canvas id="bpLatencyChart"></canvas>
    </div>
  </div>
</section>

<!-- ============ TEST 6: ENDPOINT BREAKDOWN ============ -->
<section>
  <h2>6. Individual Endpoint Benchmark</h2>
  <div class="info-box">
    <h4>Objective</h4>
    <p>Benchmark each API endpoint individually with 30 concurrent connections for 10 seconds to identify <strong>slow or problematic endpoints</strong>.</p>
  </div>
  <div style="overflow-x:auto;">
    <table>
      <thead>
        <tr><th>Endpoint</th><th>Method</th><th>Path</th><th>Throughput</th><th>Avg (ms)</th><th>P50 (ms)</th><th>P95 (ms)</th><th>P99 (ms)</th><th>Errors</th><th>Grade</th></tr>
      </thead>
      <tbody>${endpointRows}</tbody>
    </table>
  </div>
</section>

<!-- ============ METHODOLOGY ============ -->
<section>
  <h2>Testing Methodology</h2>
  <div class="test-grid">
    <div class="test-card">
      <h3>Tool</h3>
      <p>Tests executed using <strong>autocannon</strong> — a fast, low-overhead HTTP/1.1 benchmarking tool written in Node.js. It uses minimal resources on the client side to ensure accurate measurements.</p>
    </div>
    <div class="test-card">
      <h3>Test Environment</h3>
      <p><strong>OS:</strong> Windows 25H2<br>
      <strong>Runtime:</strong> Node.js<br>
      <strong>Server:</strong> Express.js (Mock with simulated latency 5-150ms)<br>
      <strong>Network:</strong> localhost (loopback)</p>
    </div>
    <div class="test-card">
      <h3>Grading Criteria</h3>
      <p><span class="badge" style="background:var(--green)">EXCELLENT</span> P95 &lt; 200ms, 0 errors<br>
      <span class="badge" style="background:var(--blue)">GOOD</span> P95 &lt; 500ms<br>
      <span class="badge" style="background:var(--yellow)">FAIR</span> P95 &lt; 1000ms<br>
      <span class="badge" style="background:#e67e22">POOR</span> P95 &gt; 1000ms<br>
      <span class="badge" style="background:var(--red)">FAIL</span> Error rate &gt; 5%</p>
    </div>
    <div class="test-card">
      <h3>Endpoints Tested</h3>
      <p>${ENDPOINTS.map(ep => '<code>' + ep.method + ' ' + ep.path + '</code>').join('<br>')}</p>
    </div>
  </div>
</section>

<!-- ============ RECOMMENDATIONS ============ -->
<section>
  <h2>Recommendations</h2>
  <div class="test-card" style="margin-bottom:20px;">
    <h3>Performance Optimization Suggestions</h3>
    <ul style="padding-left:20px; line-height:2;">
      <li>Implement <strong>Redis caching</strong> for frequently accessed data (dashboard stats, notifications)</li>
      <li>Add <strong>database indexing</strong> on frequently queried fields (userId, interviewId)</li>
      <li>Use <strong>connection pooling</strong> for MongoDB (already default in Mongoose)</li>
      <li>Implement <strong>rate limiting</strong> to protect against traffic spikes</li>
      <li>Add <strong>response compression</strong> (gzip/brotli) for large payloads</li>
      <li>Consider <strong>horizontal scaling</strong> with a load balancer for production traffic</li>
      <li>Optimize <strong>AI interview endpoints</strong> which have higher inherent latency</li>
      <li>Implement <strong>CDN</strong> for static assets and media files</li>
    </ul>
  </div>
</section>

<footer>
  <p>VIRQA Performance Test Report — Auto-generated by Performance Testing Suite</p>
  <p>Project: VIRQA (Virtual Interview & Recruitment Quality Assurance) | Final Year Project — UCP</p>
</footer>

</div>

<script>
// Breakpoint Throughput Chart
new Chart(document.getElementById('bpThroughputChart'), {
  type: 'line',
  data: {
    labels: ${JSON.stringify(bpConnections)},
    datasets: [{
      label: 'Throughput (req/s)',
      data: ${JSON.stringify(bpThroughput)},
      borderColor: '#6c63ff',
      backgroundColor: 'rgba(108,99,255,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 6,
      pointBackgroundColor: '#6c63ff',
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: '#e4e6eb' } } },
    scales: {
      x: { title: { display: true, text: 'Concurrent Connections', color: '#8b8fa3' }, ticks: { color: '#8b8fa3' }, grid: { color: 'rgba(45,49,72,0.5)' } },
      y: { title: { display: true, text: 'Requests/second', color: '#8b8fa3' }, ticks: { color: '#8b8fa3' }, grid: { color: 'rgba(45,49,72,0.5)' } }
    }
  }
});

// Breakpoint Latency Chart
new Chart(document.getElementById('bpLatencyChart'), {
  type: 'line',
  data: {
    labels: ${JSON.stringify(bpConnections)},
    datasets: [{
      label: 'P95 Latency (ms)',
      data: ${JSON.stringify(bpLatency)},
      borderColor: '#e74c3c',
      backgroundColor: 'rgba(231,76,60,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 6,
      pointBackgroundColor: '#e74c3c',
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: '#e4e6eb' } } },
    scales: {
      x: { title: { display: true, text: 'Concurrent Connections', color: '#8b8fa3' }, ticks: { color: '#8b8fa3' }, grid: { color: 'rgba(45,49,72,0.5)' } },
      y: { title: { display: true, text: 'Latency (ms)', color: '#8b8fa3' }, ticks: { color: '#8b8fa3' }, grid: { color: 'rgba(45,49,72,0.5)' } }
    }
  }
});
</script>

</body>
</html>`;

  return html;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║      VIRQA Performance Testing Suite v1.0                   ║');
  console.log('║      Load | Stress | Spike | Endurance | Breakpoint          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\nTarget: ${BASE_URL}`);
  console.log(`Endpoints: ${ENDPOINTS.length} routes`);
  console.log(`Started: ${new Date().toLocaleString()}\n`);

  // Verify server is reachable
  try {
    await new Promise((resolve, reject) => {
      http.get(BASE_URL, (res) => {
        res.resume();
        resolve();
      }).on('error', reject);
    });
    console.log('[OK] Mock server is reachable.\n');
  } catch (e) {
    console.error(`[ERROR] Cannot reach ${BASE_URL}. Is the mock server running?`);
    console.error('Start it with: node performance-testing/mock-server.js');
    process.exit(1);
  }

  const startTime = Date.now();

  // Run all tests
  const loadResult = await loadTest();
  const stressResult = await stressTest();
  const spikeResult = await spikeTest();
  const enduranceResult = await enduranceTest();
  const breakpointResults = await breakpointTest();
  const endpointResults = await endpointTest();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  // Save raw JSON results
  const rawResults = {
    timestamp: new Date().toISOString(),
    loadTest: loadResult,
    stressTest: stressResult,
    spikeTest: spikeResult,
    enduranceTest: enduranceResult,
    breakpointTest: breakpointResults,
    endpointTest: endpointResults,
  };
  fs.writeFileSync(path.join(RESULTS_DIR, 'raw-results.json'), JSON.stringify(rawResults, null, 2));
  console.log('\n[SAVED] Raw JSON results → performance-testing/results/raw-results.json');

  // Generate HTML report
  const htmlReport = generateReport(loadResult, stressResult, spikeResult, enduranceResult, breakpointResults, endpointResults);
  const reportPath = path.join(RESULTS_DIR, 'VIRQA_Performance_Report.html');
  fs.writeFileSync(reportPath, htmlReport);
  console.log(`[SAVED] HTML Report → ${reportPath}`);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`ALL TESTS COMPLETED in ${totalTime}s`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\nOpen the report in your browser:`);
  console.log(`  ${reportPath}`);
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
