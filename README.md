# PropMind

AI-powered property manager for small landlords. Your tenant texts about a leaking sink — a plumber gets booked without you making a single phone call.

Built for **AI Valley: Return of the Agents** (Feb 21, 2026)

## The Problem

20 million small landlords in the US pay 8–12% of rent to property managers. Most of that fee covers coordination work: fielding tenant calls, finding contractors, scheduling repairs, following up. The average landlord with 2–10 properties spends $200–500/month per property on this.

Contractors are available. Tenants know what's broken. The missing piece is someone to connect them — and that "someone" has been an expensive human making phone calls.

## What PropMind Does

PropMind replaces the property manager's coordination role with a MiniMax-powered AI agent. One tenant message, one landlord click, plumber booked.

### The Flow

A tenant opens the chat and types what's wrong in plain English:

> "My kitchen sink is leaking and water is pooling under the cabinet"

The AI agent then:

1. **Triages the issue** — classifies it as plumbing, medium urgency
2. **Asks smart follow-ups** — "Is water actively dripping? Can you shut off the valve under the sink?"
3. **Creates a structured ticket** — type, urgency, property, tenant, summary — no forms
4. **Finds nearby vendors** — three plumber options ranked by rating, distance, and cost
5. **Presents to the landlord** — ticket appears on dashboard with AI summary and vendor cards
6. **Landlord approves** — one click selects vendor and time slot
7. **Everyone gets notified** — tenant sees confirmation, vendor gets the job

The landlord never makes a phone call.

### Demo Accounts

The app ships with three demo accounts for the full walkthrough:

| Account | Role | What You See |
|---------|------|------------|
| `landlord@demo.com` / `demo123` | Landlord | Dashboard with 3 properties across Portland, Austin, Chicago |
| `maria@demo.com` / `demo123` | Tenant | Chat interface for 123 Oak St, Portland |
| `james@demo.com` / `demo123` | Tenant | Chat interface for 789 Pine Rd, Chicago |

Demo mode (`?demo=true`) provides a pre-seeded ticket at the `awaiting_approval` stage so you can walk through the vendor approval flow without waiting for a live AI conversation.

## Architecture

```
Browser (Next.js App Router)
    ↓ fetch + streaming SSE
Next.js API Routes
    ├── /api/chat          → MiniMax agent with tool loop (streaming)
    ├── /api/tickets       → In-memory ticket store (CRUD)
    ├── /api/vendors       → Mock vendor search by issue type + zip
    └── /api/auth/*        → Session-based auth (cookie)
```

### Agent Tools

The MiniMax agent has five tools that execute server-side during the conversation:

| Tool | What It Does |
|------|-------------|
| `classify_issue` | Extracts issue type, urgency level, and follow-up questions from tenant message |
| `create_ticket` | Creates a structured ticket in the in-memory store |
| `search_vendors` | Finds vendors by issue type and zip code (mock data) |
| `propose_schedule` | Returns available time slots for a selected vendor |
| `send_notification` | Sends confirmation messages to tenant and vendor |

Critical design rule baked into the system prompt: *"Job is NOT done until `create_ticket` is called."* Without this, the model stops after classification and never creates the ticket.

### Ticket State Machine

```
new → gathering_info → triaged → finding_vendors → awaiting_approval → scheduled → complete
```

Each state has a defined actor (AI, tenant, or landlord) and the UI updates in real-time as tickets progress.

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 15, React 19, TypeScript | Full-stack App Router, fast to build |
| AI Agent | MiniMax (text model with tool use) | Streaming, tool use, instruction following |
| Image Gen | MiniMax (image model) | Hero images, marketing content |
| UI | Tailwind CSS 4, shadcn/ui (new-york), Radix UI | Polished components, rapid iteration |
| Icons | Lucide React | Consistent icon set |
| State | In-memory `Map` (no database) | Zero setup, hackathon-appropriate |
| Auth | Session cookies (httpOnly, 7-day expiry) | Simple, no third-party deps |
| Deploy | Vercel | One command |
| Dev Tools | Claude Code | The entire project was built with Claude Code |

## Project Structure

```
├── app/
│   ├── (marketing)/           # Public pages
│   │   ├── page.tsx           # Landing page (hero video, features, stats, CTA)
│   │   └── login/page.tsx     # Login with demo account shortcuts
│   ├── (app)/                 # Authenticated pages
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # Landlord dashboard (properties + tickets)
│   │   │   └── tickets/[id]/  # Ticket detail + vendor approval
│   │   └── tenant/[slug]/     # Tenant chat interface
│   └── api/
│       ├── chat/route.ts      # MiniMax agent endpoint (streaming SSE)
│       ├── tickets/           # Ticket CRUD
│       ├── vendors/route.ts   # Vendor search
│       ├── auth/              # Login, logout, session
│       └── generate-image/    # MiniMax image generation
├── components/
│   ├── TenantChat.tsx         # Chat UI with streaming support
│   ├── PropertySidebar.tsx    # Multi-property selector
│   ├── TicketCard.tsx         # Ticket summary card
│   ├── VendorCard.tsx         # Vendor option with ratings/cost/slots
│   ├── ConfirmBookingModal.tsx # One-click vendor approval
│   ├── TicketStatusBar.tsx    # Visual state machine progress
│   ├── Navbar.tsx             # App nav with session display
│   ├── LandingNav.tsx         # Marketing page nav
│   ├── DemoControls.tsx       # Demo mode state controls
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── claude.ts              # Agent tools + system prompt (MiniMax)
│   ├── store.ts               # In-memory ticket store + seed data
│   ├── types.ts               # TypeScript interfaces
│   ├── vendors.ts             # Mock vendor generator
│   ├── auth.ts                # Session management
│   ├── status.ts              # Ticket status metadata
│   ├── image-gen.ts           # MiniMax client
│   └── useSession.ts          # React session hook
├── public/images/
│   ├── hero-video.mp4         # Landing page hero video
│   ├── hero-fallback.jpg      # Hero fallback image
│   └── og-image.jpg           # OpenGraph preview image
└── docs/                      # Design docs, PRD, build plan
```

## Running Locally

### Prerequisites

- Node.js 20+
- MiniMax API key (for AI agent + image generation)

### Setup

```bash
git clone <repo-url>
cd propmind
npm install
```

Create `.env.local`:

```env
MINIMAX_API_KEY=sk-...
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with any demo account above.

### Other Commands

```bash
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check
```

## Design System

The UI follows a custom design system built on shadcn/ui:

- **Primary:** Moss Green `#2D6A4F` — trust, property, nature
- **Secondary:** Warm Soil Brown — grounded, professional
- **Accent:** Sunset Coral `#F28B6E` — urgency, attention, CTAs
- **Typography:** Playfair Display (headings), Nunito (body/UI)
- **Urgency badges:** green (low), yellow (medium), red (emergency)

## What's Built vs. What's Mocked

| Feature | Status |
|---------|--------|
| Landing page with hero video | Built |
| Tenant chat with streaming AI | Built |
| MiniMax agent with tool use (classify + ticket) | Built |
| Landlord dashboard with multi-property view | Built |
| Ticket detail with vendor approval | Built |
| Session auth with demo accounts | Built |
| Vendor search | Mocked (realistic data, no real API) |
| SMS/email notifications | UI only (no Twilio/Resend) |
| Database persistence | In-memory (no Postgres/Supabase) |
| Vendor booking calendar | Mocked |

## License

MIT
