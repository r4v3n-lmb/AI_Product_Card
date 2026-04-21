# AI Solutions Architect · Operational Playbook
**Revan Lombard · lombard-systems**

This document is my working reference for how I scope, build, deploy, and hand over autonomous systems to clients. It is not marketing material — it is the operational truth of how this role is executed.

---

## The Role in Plain Terms

I design and build automated workflows that replace manual, repetitive, or time-sensitive operations in a business. The client tells me what is slow, broken, or costing them money. I come back with a system that runs 24/7 without them in the loop.

The deliverable is never just code. It is a running system with:
- A deployment that is live and accessible
- Error handling and retry logic so it does not fail silently
- A management dashboard so the client can see what is running
- Documentation so they are not dependent on me to understand it

---

## What Gets Built

| System Type | Examples | Core Tools |
|---|---|---|
| Intake & dispatch | Towing calls, lead routing, order intake | Twilio, n8n, OpenAI |
| Retention flows | Rebook reminders, follow-up sequences | n8n, WhatsApp API, Booksy |
| Lead qualification | RAG-backed intake, calendar booking | FastAPI, LangChain, Calendly |
| Localization pipelines | Multi-language listing/content output | OpenAI, n8n, LangChain |
| Ordering bots | Voice-to-POS, modifier handling | Twilio Voice, POS APIs, n8n |

---

## Technology Stack

```
Orchestration   →  n8n (self-hosted)
Language        →  Python 3.11+
API layer       →  FastAPI
LLM             →  OpenAI GPT-4 / Claude
Memory & RAG    →  LangChain + Pinecone / ChromaDB
Comms           →  Twilio (voice + SMS), WhatsApp Business API
Version control →  GitHub (organisation: lombard-systems)
Deployment      →  DigitalOcean VPS / Railway / Render
Dashboard       →  Custom HTML/JS (GitHub Pages) or Grafana
```

---

## What GitHub Actually Does (and Does Not Do)

GitHub stores and versions the code. It does **not** run the code.

| Component | Where it lives |
|---|---|
| n8n workflows (`.json`) | Exported from n8n, stored in `/workflows` |
| Python API (`main.py`) | Deployed to a server (VPS or Railway) |
| Environment variables | `.env` file — **never committed**, stored in server config |
| Static dashboard | Can be hosted on GitHub Pages |
| Documentation | README.md in the repo |
| Secrets / credentials | Password manager or client's own vault |

**GitHub Pages is appropriate for:**
- The management dashboard if it is a static HTML/JS file
- Documentation sites
- This portfolio site

**GitHub Pages cannot run:**
- n8n workflow engines
- Python/FastAPI endpoints
- Twilio webhook receivers
- Anything that requires a persistent server process

---

## Development Workflow

### 1. Scaffold the repo

```bash
git clone git@github.com:lombard-systems/[project-name].git
cd [project-name]
```

Standard repo structure:

```
[project-name]/
├── README.md               # Setup, architecture, env vars
├── .env.example            # All required keys, no values
├── .gitignore              # Includes .env, __pycache__, etc.
├── workflows/
│   ├── 01_intake.json      # Exported n8n workflow
│   └── 02_dispatch.json
├── api/
│   ├── main.py             # FastAPI app
│   └── requirements.txt
└── dashboard/
    └── index.html          # Static management dashboard
```

### 2. Build and test locally

- Run n8n locally via Docker: `docker run -p 5678:5678 n8nio/n8n`
- Import workflow JSON files via n8n UI
- Run API: `uvicorn api.main:app --reload`
- All secrets in `.env`, loaded via `python-dotenv`
- Test every branch of the flow, including failure states

### 3. Version control discipline

- Commit after every working state, not at the end
- Commit message format: `[scope] what changed and why`
- Export updated n8n workflow JSON before every commit
- Never commit `.env` — use `.env.example` with key names only

---

## Deployment Model

Every system needs two things to run: **a server** and **a domain or public URL** (for webhooks).

### Option A — DigitalOcean Droplet (recommended for most clients)

Best for: production systems, clients who want full ownership, multiple services on one box.

```
Cost:     ~$6–12/month (client pays)
Setup:    Ubuntu 22.04, Docker, Nginx, Certbot (SSL)
n8n:      Runs as a Docker container, persisted volume
FastAPI:  Runs via systemd or Docker, behind Nginx
Domain:   Client's domain or subdomain (e.g. ops.theirclient.co.za)
```

Steps:
1. Provision droplet (or use client's existing server)
2. SSH in, install Docker + Docker Compose
3. Clone repo from GitHub
4. Copy `.env` with real credentials
5. `docker compose up -d`
6. Point domain/subdomain to server IP
7. SSL via Certbot: `certbot --nginx`
8. Test all webhooks with live credentials

### Option B — Railway or Render (fastest to deploy, no server management)

Best for: APIs and Python services where the client does not need a VPS.

```
Cost:     ~$5/month per service (Railway) / free tier available (Render)
Setup:    Connect GitHub repo, set env vars in dashboard, deploy
Domains:  Auto-generated URL or custom domain
```

Steps:
1. Push repo to GitHub
2. Connect Railway/Render to the repo
3. Set all environment variables in the platform dashboard
4. Deploy — platform handles the rest
5. For n8n specifically, use **n8n Cloud** (n8n.io/cloud) rather than Railway

### Option C — n8n Cloud for the automation layer

When the client only needs n8n (no custom Python API):

```
Cost:     ~$20–50/month (client pays directly to n8n)
Setup:    Create account, import workflow JSONs, configure credentials
Control:  Client owns the account; I import and configure workflows
```

This is the lowest-friction option for non-technical clients.

---

## Client Delivery Process

### Phase 1 — Brief (before writing a line of code)

- 20-minute call or WhatsApp
- Understand: what is the process, where does it break, who touches it
- Identify: inputs, outputs, edge cases, failure modes
- Deliver: architecture sketch (Mermaid diagram or whiteboard photo)
- Agree on: scope, timeline, pricing, what "done" looks like

### Phase 2 — Build

- Week 1: First live flow, end-to-end, even if rough
- Show the client the working flow, get feedback early
- Iterate on edge cases, error handling, formatting
- All work version-controlled — client can see commits

### Phase 3 — Deploy & Hand Over

**Before handover checklist:**
- [ ] All workflows tested in production environment (not local)
- [ ] Error handling tested — what happens when the API is down, input is malformed, etc.
- [ ] Retry logic verified
- [ ] Dashboard accessible and showing live data
- [ ] `.env.example` updated with all required keys
- [ ] README complete: setup steps, architecture notes, how to restart services
- [ ] Secrets stored somewhere the client can access (their password manager)

**What the client receives:**
1. **GitHub repo access** — added as collaborator, or repo transferred to their account
2. **Deployment access** — SSH key or platform login for the server
3. **Credentials document** — all API keys, webhook URLs, login details (shared via a secure channel, not email)
4. **README walkthrough** — 30-minute call to walk through the repo and dashboard together
5. **30-day support window** — fixes for anything that breaks in the first month

---

## Managing Live Systems (Post-Deployment)

Once a system is live, I retain admin access to the deployment and repo. This is what day-to-day management looks like.

### Monitoring

**n8n (self-hosted or Cloud)**
The n8n UI has a full execution dashboard built in. Every workflow run is logged — inputs, outputs, errors, duration, retry state. This is the primary monitoring tool for automation flows.

Access: `https://ops.client.co.za` (or n8n Cloud URL)
What you see: execution history, failed runs, retry queue, active workflows

**Railway / Render**
Both platforms have a live log viewer in their web dashboard. Tail logs, view deploy history, roll back to a previous deploy if needed. No SSH required.

**DigitalOcean VPS**
```bash
ssh root@[server-ip]
journalctl -u n8n --follow          # n8n logs
journalctl -u myapi --follow        # FastAPI logs
docker compose logs -f              # if running via Docker Compose
```

**Alerts**
Set up n8n's built-in error alerting: on any workflow failure → send a WhatsApp or Slack message to yourself. This means you find out about broken flows before the client does.

```
n8n Error Trigger → HTTP Request (POST to your WhatsApp webhook)
```

### Making Updates

**Code changes (Python API, dashboard):**
```bash
# Make change locally, test it, then:
git add .
git commit -m "fix: [what and why]"
git push origin main
# Railway/Render: auto-deploys on push (configure in platform settings)
# VPS: SSH in and run:
git pull && docker compose restart api
```

**n8n workflow changes:**
1. Log into the n8n UI on the live server (or n8n Cloud)
2. Make the change directly in the UI
3. Activate the updated workflow
4. Export the updated JSON and commit it to the repo:
   - n8n UI → workflow → ⋮ → Export
   - `cp ~/Downloads/workflow.json ./workflows/[name].json`
   - `git add . && git commit -m "update: [workflow name] — [what changed]"`

This keeps the repo in sync with what is actually running.

### Managing Multiple Clients

As the number of clients grows, you need a way to see all systems from one place without logging into each one individually.

**Practical approach — a private control dashboard:**

Each client system writes a heartbeat to a shared Firestore collection every time it runs:

```json
{
  "client": "towing-co-wc",
  "workflow": "dispatch-intake",
  "status": "ok",
  "last_run": "2026-04-21T14:32:00Z",
  "jobs_today": 47,
  "errors_today": 1
}
```

A private HTML dashboard (GitHub Pages, gated behind Firebase Auth) reads this collection and shows the health of every client system on one screen. You open one URL and see everything.

This is your control room. It is not visible to clients — it is your internal ops view.

---

## Hosting Stack Decision Guide

Not all systems need the same infrastructure. Use this to decide what to deploy where.

### When GitHub Pages alone is enough

- The deliverable is purely a static dashboard reading from an API or Firestore
- A documentation site
- A status page that shows pre-generated data

GitHub Pages serves HTML/CSS/JS files. It cannot run server-side code, cannot receive webhooks, and cannot run persistent processes.

### When you need a server (VPS or Railway)

Almost always. Any system that does one of the following needs a real server:

- Receives a webhook from Twilio, WhatsApp, or any external service
- Runs n8n workflows (n8n is a Node.js process that runs continuously)
- Hosts a Python/FastAPI endpoint
- Makes scheduled/cron-based calls
- Maintains a persistent connection or queue

**DigitalOcean Droplet** — best for production systems, multiple services on one box, clients who need a fixed server IP (e.g., for IP whitelisting with external APIs).

**Railway** — best for Python APIs when you want zero server management. Deploys from GitHub on push. Good for early-stage or lower-traffic systems.

**n8n Cloud** — best for clients who are non-technical and just need the automation to run. They pay n8n directly; you configure it. No server to manage.

### When Firebase is the right addition

Firebase is not a replacement for a server. It is a data and auth layer that works well alongside GitHub Pages for the dashboard side of a system.

**Use Firestore when:**
- You want the dashboard to update in real time without polling a custom API
- n8n needs to persist data (job logs, customer records, state) without setting up a database server
- You want to store run history in a way the client can query or export

**Use Firebase Auth when:**
- The client dashboard should be login-gated (only authorised users can see it)
- You are building a multi-user system where different staff see different data

**Use Firebase Hosting when:**
- You want a custom domain on the dashboard with SSL, and do not want to manage Nginx
- Functionally the same as GitHub Pages but with tighter Firebase integration

### Typical Architecture by System Type

**Simple automation (single workflow, SMS/WhatsApp):**
```
Twilio webhook → n8n on DigitalOcean → OpenAI → SMS reply
Dashboard: n8n UI (no separate dashboard needed)
```

**Client-facing system with dashboard:**
```
Trigger → n8n on VPS → writes to Firestore
Dashboard: GitHub Pages → reads Firestore → Firebase Auth gate
```

**API-heavy system (RAG, intake, qualifier):**
```
Web form → FastAPI on Railway → LangChain + OpenAI → Calendly
Data: Firestore or Railway PostgreSQL
```

**Full production system:**
```
Trigger layer: Twilio / WhatsApp / Web
Orchestration: n8n on DigitalOcean (Docker)
API layer: FastAPI on same VPS or Railway
Data: Firestore (logs + records) + .env secrets
Dashboard: GitHub Pages + Firebase Auth + Firestore reads
Monitoring: n8n error trigger → WhatsApp alert to me
```

---

## Repo → Client Handover (GitHub Specifically)

The repo lives under `lombard-systems` during development.

At handover, two options:

**Option A — Transfer the repo** to the client's personal or org GitHub account.
- Go to repo Settings → Danger Zone → Transfer
- Client becomes the owner; I lose access unless they invite me back
- Best when the client is technical and wants full ownership

**Option B — Add client as collaborator** (Admin role) on the `lombard-systems` repo.
- I retain access; client can read, write, deploy
- Best for ongoing support engagements or non-technical clients
- If the relationship ends, transfer at that point

In both cases, the client ends up with a repo they own and can hand to any developer.

---

## Environment Variable Management

Every system has secrets (API keys, phone numbers, webhook tokens). These never go into the repo.

```bash
# .env.example (committed — shows what's needed, no values)
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
N8N_WEBHOOK_URL=
DATABASE_URL=

# .env (not committed — real values, lives on the server)
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=ACxxxxx
...
```

On the server, these are set either:
- In the `.env` file on the VPS (loaded by Docker Compose or `python-dotenv`)
- In the platform's environment variable dashboard (Railway, Render)
- In n8n's built-in credential store (for n8n-native workflows)

---

## Pricing Model

| Engagement | Scope | Typical Range |
|---|---|---|
| Sprint (MVP flow) | One workflow, end-to-end, deployed | R8,000–R15,000 |
| Full system | Multiple flows, API layer, dashboard | R20,000–R45,000 |
| Retainer | Ongoing builds, maintenance, iteration | R6,000–R12,000/month |

Pricing is scope-based. First conversation is free. No retainer until the first build is delivered and working.

---

## Tools Reference

| Tool | Purpose | URL |
|---|---|---|
| n8n (self-hosted) | Workflow orchestration | n8n.io |
| n8n Cloud | Managed n8n for clients | n8n.io/cloud |
| Railway | API deployment | railway.app |
| Render | API deployment (free tier) | render.com |
| DigitalOcean | VPS hosting | digitalocean.com |
| Certbot | Free SSL certificates | certbot.eff.org |
| Pinecone | Vector DB for RAG | pinecone.io |
| Firebase / Firestore | Data layer + Auth + Hosting | firebase.google.com |
| Twilio | Voice + SMS | twilio.com |
| WhatsApp Business API | Messaging | business.whatsapp.com |
| Calendly | Booking | calendly.com/revan_lombard |

---

*Last updated: 2026-04 · R. Lombard*
