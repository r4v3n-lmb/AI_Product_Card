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
| Twilio | Voice + SMS | twilio.com |
| WhatsApp Business API | Messaging | business.whatsapp.com |
| Calendly | Booking | calendly.com/revan_lombard |

---

*Last updated: 2026-04 · R. Lombard*
