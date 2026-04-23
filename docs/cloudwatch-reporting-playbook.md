# CloudWatch Monitoring Report Playbook (6 Servers)

Use this playbook to prepare weekly operations reports and monthly management summaries for six servers.

## 1) Report Scope

- **Environment:** `<production | staging | mixed>`
- **Timezone:** `<e.g., Asia/Kolkata>`
- **Report Period:** `<daily | weekly | monthly>`
- **Prepared By:** `<name>`
- **Generated On:** `<YYYY-MM-DD HH:mm>`

### Server Inventory (All 6 Required)

| Server | Instance ID | Hostname | Role | Region | Auto Scaling Group | Owner |
|---|---|---|---|---|---|---|
| Server-01 | `<i-xxxx>` | `<host-01>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |
| Server-02 | `<i-xxxx>` | `<host-02>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |
| Server-03 | `<i-xxxx>` | `<host-03>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |
| Server-04 | `<i-xxxx>` | `<host-04>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |
| Server-05 | `<i-xxxx>` | `<host-05>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |
| Server-06 | `<i-xxxx>` | `<host-06>` | `<web/api/db>` | `<ap-south-1>` | `<asg-name or N/A>` | `<team>` |

---

## 2) Metrics Included

For each server, include:

- `CPUUtilization`
- `MemoryUtilization` (CloudWatch Agent)
- `DiskUsedPercent` (CloudWatch Agent)
- `NetworkIn`, `NetworkOut`
- `DiskReadOps`, `DiskWriteOps`
- `StatusCheckFailed` (Instance + System)
- Application metrics (request count, latency, error rate) if available

---

## 3) Availability & Reliability

### Fleet Summary

| KPI | Target | Actual | Status |
|---|---:|---:|---|
| Uptime % | `>= 99.9%` | `<value>` | `<On Track/At Risk>` |
| Downtime Incidents | `<= target` | `<value>` | `<On Track/At Risk>` |
| Alarm Breaches | `<= target` | `<value>` | `<On Track/At Risk>` |

### Per-Server Reliability

| Server | Uptime % | Downtime (min) | Incident Count | Alarm Breaches | Top Reliability Issue |
|---|---:|---:|---:|---:|---|
| Server-01 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |
| Server-02 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |
| Server-03 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |
| Server-04 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |
| Server-05 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |
| Server-06 | `<%>` | `<min>` | `<n>` | `<n>` | `<text>` |

---

## 4) Performance

For each key metric, report:

- Average
- Min
- Max
- p95
- Peak window (timestamp and duration)

### Per-Server Performance Snapshot

| Server | CPU Avg/Max/p95 | Memory Avg/Max/p95 | Disk Used Avg/Max/p95 | Network Peak Window | App Latency p95 |
|---|---|---|---|---|---|
| Server-01 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |
| Server-02 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |
| Server-03 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |
| Server-04 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |
| Server-05 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |
| Server-06 | `<...>` | `<...>` | `<...>` | `<...>` | `<...>` |

---

## 5) Capacity & Utilization

Classify each server:

- **Underutilized:** sustained low CPU/memory and low traffic
- **Balanced:** within planned operating range
- **Overutilized:** frequent high CPU/memory or saturation alarms

| Server | Utilization Class | Growth Trend | Scaling Risk | Recommendation |
|---|---|---|---|---|
| Server-01 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |
| Server-02 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |
| Server-03 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |
| Server-04 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |
| Server-05 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |
| Server-06 | `<under/balanced/over>` | `<up/flat/down>` | `<low/med/high>` | `<action>` |

---

## 6) Cost & Optimization

| Area | Observation | Impact | Recommendation | Priority |
|---|---|---|---|---|
| CloudWatch Metrics/Logs | `<text>` | `<low/med/high>` | `<action>` | `<P1/P2/P3>` |
| Instance Utilization | `<text>` | `<low/med/high>` | `<rightsizing/schedule>` | `<P1/P2/P3>` |
| Idle Time | `<text>` | `<low/med/high>` | `<action>` | `<P1/P2/P3>` |

---

## 7) Visuals Required

Include these in the final report:

1. Per-server trend charts (CPU, memory, disk, network)
2. Fleet summary table (all 6 servers)
3. Top issues list (by severity/impact)
4. SLA/SLO status widget or table

---

## 8) Automation Workflow

1. Build CloudWatch dashboard widgets for all required metrics.
2. Add alarm thresholds for reliability and saturation.
3. Use Logs Insights/Athena queries for downtime and incident extraction.
4. Export KPI data to CSV (weekly + monthly).
5. Publish report to PDF/CSV.
6. Deliver via email/Slack on schedule.

### Suggested Cadence

- **Weekly Ops Report:** every Monday, includes previous 7 days
- **Monthly Management Summary:** 1st day of month, includes prior month + trend comparison

---

## 9) Action Tracker

| Finding ID | Finding | Priority | Owner | Due Date | Expected Impact | Status |
|---|---|---|---|---|---|---|
| CW-001 | `<issue>` | `<P1/P2/P3>` | `<name>` | `<YYYY-MM-DD>` | `<availability/performance/cost>` | `<open/in-progress/done>` |
| CW-002 | `<issue>` | `<P1/P2/P3>` | `<name>` | `<YYYY-MM-DD>` | `<availability/performance/cost>` | `<open/in-progress/done>` |

---

## 10) Monthly Comparison Section

Track period-over-period changes:

| KPI | Current Period | Previous Period | Change | Trend |
|---|---:|---:|---:|---|
| Uptime % | `<value>` | `<value>` | `<+/- %>` | `<improving/stable/declining>` |
| Avg CPU % | `<value>` | `<value>` | `<+/- %>` | `<improving/stable/declining>` |
| p95 Latency | `<value>` | `<value>` | `<+/- %>` | `<improving/stable/declining>` |
| Alarm Breaches | `<value>` | `<value>` | `<+/- %>` | `<improving/stable/declining>` |
| Estimated Cost | `<value>` | `<value>` | `<+/- %>` | `<improving/stable/declining>` |

---

## Report Completion Checklist

- [ ] All 6 servers included
- [ ] All required metrics captured
- [ ] Uptime/downtime and alarm analysis completed
- [ ] Performance and p95 sections completed
- [ ] Capacity and cost recommendations added
- [ ] Visuals attached
- [ ] Action tracker updated with owners and dates
- [ ] Weekly/monthly comparisons included
