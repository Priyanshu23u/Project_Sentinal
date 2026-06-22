# Project Sentinel

A fault-tolerant API Multiplexer built using Go, React, Docker, WebSockets, Circuit Breaker Pattern, and Chaos Engineering principles.

---
## Demo Video

[Project Sentinal Demo](https://youtu.be/z7jkBrD2igk)

# Overview

Project Sentinel demonstrates how modern distributed systems maintain availability during service failures.

Under normal conditions, all traffic is routed to a Primary API. When failures are detected, a custom Circuit Breaker opens and automatically redirects traffic to a Secondary API. A React dashboard visualizes system health, routing behavior, and request metrics in real time through WebSockets.

---

# System Architecture

```
                     +------------------+
                     | React Dashboard  |
                     |  (Frontend)      |
                     +---------+--------+
                               |
                          WebSocket
                               |
                               v
                     +------------------+
                     |  Go Backend      |
                     | Reverse Proxy    |
                     | Circuit Breaker  |
                     +---------+--------+
                               |
                               |
                               v
                     +------------------+
                     |   Toxiproxy      |
                     +---------+--------+
                               |
                               |
                    +----------+----------+
                    |                     |
                    v                     v
             +-------------+       +-------------+
             | Primary API |       |Secondary API|
             +-------------+       +-------------+
```

---

# Architectural Choices

## 1. Circuit Breaker Pattern

The Circuit Breaker prevents cascading failures by stopping requests from repeatedly hitting an unhealthy service.

### CLOSED State

* Requests are routed to the Primary API.
* Failures are monitored.
* Normal operating mode.

### OPEN State

* Triggered when failures exceed the configured threshold.
* Requests are no longer sent to the Primary API.
* Traffic is automatically redirected to the Secondary API.

### HALF_OPEN State

* After a timeout period, the system allows a small number of test requests.
* If successful, the circuit returns to CLOSED.
* If failures continue, the circuit returns to OPEN.

### Benefits

* Prevents unnecessary load on failing services.
* Improves application resilience.
* Enables automatic recovery.

---

## 2. React Rendering Strategy

The frontend receives live telemetry from the backend through WebSockets.

The backend continuously publishes:

* Requests per second (RPS)
* Success count
* Failure count
* Active routes
* Circuit breaker state

The React dashboard updates state immediately whenever a new WebSocket message arrives.

This approach was chosen because:

* No manual page refresh is required.
* Near real-time monitoring is possible.
* Lower overhead than frequent polling.
* Better user experience for operational dashboards.

---

# Technology Stack

## Backend

* Go
* net/http
* Reverse Proxy
* Gorilla WebSocket

## Frontend

* React
* Vite
* Recharts

## Infrastructure

* Docker
* Docker Compose
* Toxiproxy

---

# Running the Environment

## Prerequisites

Install:

* Docker Desktop
* Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

## Build Containers

From the project root:

```bash
docker compose build
```

---

## Start Environment

```bash
docker compose up -d
```

---

## Verify Containers

```bash
docker ps
```

Expected containers:

```text
backend
frontend
primary-api
secondary-api
toxiproxy
```

---

# Accessing Services

| Service            | URL                   |
| ------------------ | --------------------- |
| Frontend Dashboard | http://localhost:5173 |
| Backend            | http://localhost:8080 |
| Primary API        | http://localhost:8081 |
| Secondary API      | http://localhost:8082 |
| Toxiproxy API      | http://localhost:8474 |

---

# Normal Operation Test

Verify routing through Primary API:

```bash
curl http://localhost:8080
```

Expected:

```json
{
  "message": "Success from Primary API",
  "source": "PRIMARY"
}
```

The dashboard should show:

```text
Circuit State: CLOSED
Primary API: RECEIVING TRAFFIC
Secondary API: STANDBY
```

---

# Chaos Test Using Toxiproxy

## Verify Proxy Exists

```bash
curl http://localhost:8474/proxies
```

Expected:

```json
{
  "primary": {
    ...
  }
}
```

---

## Simulate Service Failure

Stop the Primary API:

```bash
docker stop primary-api
```

Generate traffic:

```bash
curl http://localhost:8080
```

Expected:

```json
{
  "message": "Fallback API",
  "source": "SECONDARY"
}
```

Dashboard should update to:

```text
Circuit State: OPEN
Primary API: BYPASSED
Secondary API: RECEIVING TRAFFIC
```

---

## Recovery Test

Restart the Primary API:

```bash
docker start primary-api
```

Generate traffic again:

```bash
curl http://localhost:8080
```

Expected:

```json
{
  "message": "Success from Primary API",
  "source": "PRIMARY"
}
```

Dashboard should return to:

```text
Circuit State: CLOSED
Primary API: RECEIVING TRAFFIC
Secondary API: STANDBY
```

---

# Live Metrics Available

The dashboard displays:

* Circuit Breaker State
* Requests Per Second (RPS)
* Successful Requests
* Failed Requests
* Active Routes
* Traffic Flow Visualization
* Request Volume Chart

All metrics are updated through WebSocket streaming.

---

# Screenshots

## Normal Operation

![Normal Dashboard](https://github.com/user-attachments/assets/6b6d4159-7ed2-411c-b5b8-7da35b7cf489)

## Circuit Open / Failover

![Failover Dashboard](https://github.com/user-attachments/assets/77735b6d-1fd9-4495-aa19-901545e01cd3)

---

# Future Enhancements

* Prometheus Metrics
* Grafana Dashboards
* Kubernetes Deployment
* Distributed Tracing
* OpenTelemetry Integration


