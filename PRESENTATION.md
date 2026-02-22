# PropMind — 3-Minute Hackathon Presentation & Demo Script

> **Format:** 3-minute pitch + live demo | **Presenter:** [Your Name] | **Demo URL:** [Vercel URL]

---

## Act 1: The Problem (0:00–0:30)

### Speaker Notes

> "What if your tenants could text about a leaking sink and have a plumber booked — without you making a single phone call?"
>
> "I own 3 properties across 2 states. Every time a tenant has a maintenance issue, I'm on the phone with plumbers, texting back and forth, trying to coordinate schedules. I'm either paying a property manager 10% of rent to do this — or I'm doing it myself at 10pm."
>
> "There are 20 million small landlords in the US — most own 1 to 4 properties. They pay $200 to $500 a month per property to property managers, mostly for coordination work. Phone tag, scheduling, follow-ups. That's the entire job."
>
> "PropMind is the third option."

### Key Stats to Land

| Stat | Value |
|------|-------|
| Small landlords in the US | 20 million |
| Typical PM fee | 8–12% of monthly rent |
| PM cost per property | $200–$500/month |
| What PMs mostly do | Coordination — calls, texts, scheduling |

---

## Act 2: The Solution — PropMind (0:30–0:45)

### Speaker Notes

> "PropMind is an AI property manager that handles the entire maintenance workflow — end to end."
>
> "Tenant texts about an issue. AI triages it, finds vendors, and presents options. Landlord clicks once. Done. Plumber booked."
>
> "Built with Next.js 14, Claude API from Anthropic for the AI agent, MiniMax for content generation, shadcn/ui, and deployed on Vercel."

### One-liner

**"Fire your property manager. Keep the service."**

### The Flow (gesture at screen)

```
Tenant texts issue → AI triages → Finds vendors → Landlord clicks once → Done
```

---

## Act 3: Live Demo (0:45–2:30)

### Pre-Demo Checklist

- [ ] Browser open to landing page (cleared cache, no errors in console)
- [ ] Demo mode enabled (`?demo=true`) as backup
- [ ] Two browser tabs ready: tenant view + landlord dashboard
- [ ] Pre-seeded demo ticket at `awaiting_approval` state as fallback
- [ ] Font size zoomed to 125% for audience visibility

---

### Step 1 — Landing Page (~10s)

**Action:** Show the landing page with hero video and how-it-works section.

**Say:**

> "Here's PropMind. One platform — tenants report issues, AI handles the rest, landlords approve."

**What to show:**
- Hero section with video/animation
- "How It Works" section — three steps visualized
- Scroll briefly, don't linger

---

### Step 2 — Login as Tenant (~5s)

**Action:** Navigate to tenant chat. Quick demo login as Maria Lopez.

**Say:**

> "Let's be Maria — she rents unit 2B at 123 Oak Street in Portland."

**Navigate to:** `/tenant/portland-oak-st` (or demo login flow)

---

### Step 3 — Tenant Chat (~30s)

**Action:** Type the maintenance request and watch AI respond in real time.

**Type this exactly:**

```
My kitchen sink is leaking and water is pooling under the cabinet
```

**Say while AI streams:**

> "Watch — the AI reads her message, understands it's a plumbing issue, and asks a smart follow-up."

**Expected AI behavior:**
1. AI classifies: Plumbing leak, medium urgency
2. AI asks follow-up: "Is water actively dripping right now? Can you shut off the valve under the sink?"
3. Respond with: "Yes it's dripping slowly. I turned off the valve."
4. AI creates ticket — status chip appears: "Ticket created — finding vendors..."

**Say:**

> "It triaged, asked the right question, and created a structured ticket. No forms, no phone tree — just a conversation."

---

### Step 4 — Switch to Landlord (~5s)

**Action:** Switch to landlord tab / login as Marcus Chen.

**Say:**

> "Now let's be the landlord — Marcus. He owns 3 properties across Portland, Austin, and Chicago."

**Navigate to:** `/dashboard`

---

### Step 5 — Landlord Dashboard (~15s)

**Action:** Show the dashboard with all 3 properties and the new ticket.

**Say:**

> "Here's his dashboard. Three properties, one view. And look — Maria's ticket just appeared. Medium urgency, plumbing, 123 Oak Street."

**What to point out:**
- Left sidebar: 3 property cards (Portland / Austin / Chicago)
- Main area: ticket list sorted by urgency
- New ticket with urgency badge (yellow = medium)
- Ticket count per property

---

### Step 6 — Ticket Detail + Vendor Approval (~25s)

**Action:** Click into the ticket. Show AI summary and vendor cards.

**Say:**

> "Click into the ticket. The AI already wrote a summary: 'Plumbing leak at 123 Oak Street. Non-emergency. Recommended action: schedule plumber within 48 hours.'"
>
> "And it found three plumbers nearby — ranked by rating, distance, and cost. Mike's Plumbing, 4.8 stars, 0.8 miles away, available tomorrow morning."

**What to point out:**
- AI-generated summary at top
- 3 vendor cards with: name, rating, distance, estimated cost, available time slots
- AI recommendation badge on top vendor
- One-click approve button

**Action:** Click "Approve" on Mike's Plumbing, 9–11am slot.

**Say:**

> "One click. That's it."

---

### Step 7 — Confirmation (~15s)

**Action:** Show the ticket status change to "Scheduled."

**Say:**

> "Ticket moves to scheduled. Maria gets a confirmation: 'A plumber is coming tomorrow between 9 and 11am.' The vendor gets the job details. Marcus never made a phone call."

**What to point out:**
- Ticket status: green "Scheduled" badge
- Confirmation message (tenant notification)
- Vendor notification preview

---

### Demo Recovery Plan

| Issue | Backup |
|-------|--------|
| AI takes too long | Switch to demo mode (`?demo=true`) — pre-seeded ticket at `awaiting_approval` |
| API error | Demo mode with scripted state transitions (looks identical to live) |
| Vercel down | Run locally + ngrok |
| Chat doesn't stream | Skip to dashboard with pre-seeded ticket, show approval flow |

---

## Act 4: The Market & Close (2:30–3:00)

### Speaker Notes

> "AI agents can now understand natural language, call APIs, and coordinate across systems. The hard part of property management — intake, triage, vendor coordination — is exactly what Claude is built for."
>
> "20 million small landlords. $200 to $500 a month per property in PM fees — for coordination work that takes an AI agent 30 seconds."
>
> "One tenant message. One landlord click. Plumber booked. That's PropMind."

### Roadmap (only if asked in Q&A)

| Phase | Features |
|-------|----------|
| v1 (now) | Maintenance triage + vendor booking |
| v2 | Real SMS/email notifications, vendor marketplace integration |
| v3 | Rent collection, lease management |
| v4 | Predictive maintenance, cost analytics |
| v5 | Compliance copilot, eviction guidance |

---

## Technical Details (for Q&A)

### Architecture

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 App Router + TypeScript | Full-stack, fast to build, great for demos |
| AI Agent | Claude (Anthropic SDK) — raw tool loop | ~50 lines, simple debugging, no timeout risk on serverless |
| Content Gen | MiniMax text + image models | Hero images, marketing content |
| UI | Tailwind CSS + shadcn/ui (new-york) | Polished components, fast iteration |
| State | In-memory Map | No DB setup needed for hackathon |
| Deploy | Vercel | One command, instant |

### Agent Tools

```
classify_issue(text)       → { type, urgency, follow_up_questions }
create_ticket(details)     → ticket_id
search_vendors(type, zip)  → [vendors with ratings, cost, slots]
propose_schedule(vendor)   → [time_slots]
send_notification(to, msg) → confirmation
```

### Key Design Decision

Raw Anthropic SDK over Agent SDK — the entire agent loop is ~50 lines in a single API route (`/api/chat`). Streaming SSE pushes text, tool calls, and status updates to the client in real time. No subprocess overhead, no timeout risk on Vercel serverless functions.

### Ticket State Machine

```
NEW → GATHERING_INFO → TRIAGED → FINDING_VENDORS → AWAITING_APPROVAL → SCHEDULED → COMPLETE
```

---

## Timing Cheat Sheet

| Segment | Duration | Cumulative | What's Happening |
|---------|----------|------------|------------------|
| The Problem | 0:30 | 0:30 | Hook + pain point + stats |
| The Solution | 0:15 | 0:45 | One-liner + tech stack |
| Demo: Landing | 0:10 | 0:55 | Hero, how-it-works |
| Demo: Tenant login | 0:05 | 1:00 | Switch to Maria |
| Demo: Chat | 0:30 | 1:30 | Type issue, AI responds |
| Demo: Landlord login | 0:05 | 1:35 | Switch to Marcus |
| Demo: Dashboard | 0:15 | 1:50 | Properties + new ticket |
| Demo: Ticket detail | 0:25 | 2:15 | Vendors + approve |
| Demo: Confirmation | 0:15 | 2:30 | Scheduled, notifications |
| Market & Close | 0:30 | 3:00 | Stats + closing line |

---

## Closing Line (Memorize This)

> "One tenant message. One landlord click. Plumber booked. That's PropMind."
