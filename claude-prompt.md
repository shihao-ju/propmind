# PropMind Landing Page & Auth — Development Prompt

You are building a premium landing page, cookie-based auth system, and AI image generation utilities for PropMind, an existing Next.js 15 property management app. Work is organized into **phases** — complete all tasks in a phase, then stop for verification.

## Project Overview

**Goal**: Add a marketing landing page at `/`, role-based mock auth (landlord vs tenant), and image generation utilities — without breaking the existing working dashboard and tenant chat.

**Key Files**:
- `SPEC.md` — Complete implementation spec (same content as PLAN.md)
- `claude-task.json` — Phases and tasks (your roadmap)
- `CLAUDE.md` — Project conventions, architecture, design system
- `app/globals.css` — Current design tokens (to be replaced)
- `app/layout.tsx` — Current root layout (to be refactored)
- `components/Navbar.tsx` — Current nav (to be updated with session)
- `lib/store.ts` — Existing data store with properties/tenants/tickets

## How Phases Work

The project is divided into 4 phases. Each phase has:
- Multiple tasks to complete
- A verification checkpoint at the end

**Your job**: Complete ALL tasks in the current phase, then STOP and give me the verification steps to test.

## Session Startup

1. **Read `claude-task.json`** — Find the current phase (first one where `status` is not `"complete"`)
2. **Find incomplete tasks** — In that phase, find tasks where `passes: false`
3. **Work through them** — Complete each task, mark `passes: true`
4. **When phase is done** — Output the verification steps and STOP

## Workflow

```
For current phase:
  For each task where passes: false:
    1. Read the task's steps carefully
    2. Implement the task
    3. Mark passes: true in claude-task.json
    4. Git commit: "task-XXX: description"

  When all tasks in phase are done:
    1. Update phase status to "complete"
    2. Output: "Phase X complete. Verification steps:"
    3. List the verification.steps from the phase
    4. STOP and wait for user confirmation
```

## Rules

### Keep Going Within a Phase
- Do NOT stop after each task
- Complete ALL tasks in the current phase before stopping
- Only stop at phase boundaries

### Git Commits
After each task:
```bash
git add -A && git commit -m "task-XXX: Brief description"
```

### Marking Progress
When a task is done, update `claude-task.json`:
- Set task's `passes: true`
- When all tasks in phase done, set phase's `status: "complete"`

### Never Do These
- Do NOT skip phases
- Do NOT work on tasks from future phases
- Do NOT mark tasks complete without implementing them
- Do NOT continue past a phase boundary without user verification
- Do NOT delete or modify existing tests
- Do NOT break existing dashboard or tenant chat functionality

## Current Phases

| Phase | Name | Tasks | Status |
|-------|------|-------|--------|
| 1 | Foundation — Route Groups, Design System, Fonts | css-001, font-001, layout-001, move-001, layout-002 | pending |
| 2 | Landing Page | fade-001, nav-001, landing-001, cleanup-001 | pending |
| 3 | Auth System (Cookie-Based Mock) | auth-001, auth-002, auth-003, auth-004, auth-005, auth-006 | pending |
| 4 | AI Image Generation & Polish | img-001, img-002, og-001 | pending |

## File Structure Target

```
propmind/
├── app/
│   ├── layout.tsx                         ← Root-only: fonts + html/body (NO Navbar)
│   ├── globals.css                        ← Design Bible HSL palette
│   ├── (marketing)/
│   │   ├── layout.tsx                     ← Gradient bg, no Navbar
│   │   ├── page.tsx                       ← Landing page (hero, features, CTA)
│   │   └── login/page.tsx                 ← Login form + demo shortcuts
│   ├── (app)/
│   │   ├── layout.tsx                     ← Navbar + DemoWrapper
│   │   ├── dashboard/page.tsx             ← Moved from app/dashboard/
│   │   ├── dashboard/tickets/[id]/page.tsx
│   │   └── tenant/[slug]/page.tsx         ← Moved from app/tenant/
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       ├── auth/me/route.ts
│       ├── generate-image/route.ts
│       ├── chat/route.ts                  ← Existing
│       ├── tickets/route.ts               ← Existing
│       ├── tickets/[id]/route.ts          ← Existing
│       └── vendors/route.ts               ← Existing
├── components/
│   ├── FadeIn.tsx                         ← NEW: Scroll animation
│   ├── LandingNav.tsx                     ← NEW: Marketing nav
│   ├── Navbar.tsx                         ← MODIFIED: Session display
│   └── ... (existing components)
├── lib/
│   ├── auth.ts                            ← NEW: Mock auth
│   ├── useSession.ts                      ← NEW: Client session hook
│   ├── image-gen.ts                       ← NEW: MiniMax image wrapper
│   └── ... (existing lib files)
├── middleware.ts                           ← NEW: Route protection
├── public/images/                         ← NEW: Generated assets
└── SPEC.md                                ← Implementation reference
```

## Technical Decisions

### Design System (Phase 1)
- Replace OKLch with HSL colors from Design Bible
- Primary: Moss Green `#2D6A4F` → `hsl(153 40% 30%)`
- Secondary: Warm Soil Brown `#8B6914` → `hsl(43 75% 31%)`
- Accent: Sunset Coral `#F28B6E` → `hsl(13 84% 69%)`
- Background: Sky Blue `#F0F7FF` → `hsl(212 100% 97%)`
- Fonts: Playfair Display (headings, 700/900) + Nunito (body, 400/600/700)

### Route Groups (Phase 1)
- `(marketing)` — gradient bg, no Navbar, for landing + login
- `(app)` — Navbar + DemoWrapper, for dashboard + tenant chat
- URLs don't change — route groups are transparent to the URL

### Auth (Phase 3)
- Cookie-based mock auth — no external libraries
- Cookie name: `propmind-session`, base64-encoded JSON, httpOnly
- Edge-safe encoding: use `btoa`/`atob` (no Buffer)
- 3 demo users: landlord@demo.com, maria@demo.com, james@demo.com (all password: `demo123`)
- Middleware reads cookie directly from `request.cookies`

### Landing Page (Phase 2)
- Hero with video background (muted autoplay loop), static poster fallback
- 6 sections total: Hero, How It Works, Features, Stats, CTA, Footer
- FadeIn component using IntersectionObserver for scroll animations
- All CTAs link to `/login`

### Image Generation (Phase 4)
- MiniMax API wrapper in `lib/image-gen.ts`
- API route at `/api/generate-image` for runtime use
- Static assets generated via MiniMax MCP (manual step, not automated)

## Questions?

If you're unsure about something:
1. Read `SPEC.md` for detailed requirements
2. Check `claude-task.json` for task details
3. Read `CLAUDE.md` for project conventions
4. Ask the user for clarification

---

**Now read `claude-task.json`, find the current phase, and begin working through its tasks.**
