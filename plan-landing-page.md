# PropMind Landing Page & Auth Plan

## Context

PropMind is deployed and working at propmind-six.vercel.app. The current root page (`app/page.tsx`) just redirects to `/dashboard` — there's no landing page, no auth, and no login flow. The user wants a premium landing page with AI-generated images/video, plus role-based login for landlords and tenants.

---

## Phase 1: Foundation — Route Groups & Design System

The landing page needs a different layout than the app (no Navbar, gradient background). Use Next.js route groups to split layouts cleanly.

### 1A. Restructure into Route Groups

Move existing pages into route groups — **URLs do not change**.

```
app/
  layout.tsx              ← Root: just <html>/<body>, fonts, metadata
  globals.css             ← Updated color system
  (marketing)/
    layout.tsx            ← Gradient bg, no Navbar
    page.tsx              ← NEW: Landing page (replaces redirect)
    login/page.tsx        ← NEW: Login page
  (app)/
    layout.tsx            ← Current layout (Navbar + DemoWrapper)
    dashboard/page.tsx    ← Moved from app/dashboard/
    dashboard/tickets/[id]/page.tsx
    tenant/[slug]/page.tsx
  api/                    ← Stays at top level
```

**Files to modify:**
- `app/layout.tsx` — Strip to root-only (fonts + html/body)
- `app/page.tsx` — Delete (replaced by `(marketing)/page.tsx`)

**Files to create:**
- `app/(marketing)/layout.tsx` — Gradient background, minimal chrome
- `app/(app)/layout.tsx` — Move Navbar + DemoWrapper here

**Files to move:**
- `app/dashboard/` → `app/(app)/dashboard/`
- `app/tenant/` → `app/(app)/tenant/`

### 1B. Fix Design System (globals.css)

Replace generic OKLch colors with the Design Bible's HSL palette:
- Primary: Moss Green `#2D6A4F` (hsl 153 40% 30%)
- Secondary: Warm Soil Brown `#8B6914` (hsl 43 75% 31%)
- Accent: Sunset Coral `#F28B6E` (hsl 13 84% 69%)
- Background: Sky Blue `#F0F7FF` (hsl 212 100% 97%)
- Add status colors: `--success`, `--warning`, `--info`
- Add `.bg-propmind-gradient` class (sky-to-earth gradient)
- Add fade-up animation keyframes
- Fix `--radius` to `1rem`

### 1C. Add Playfair Display Font

Update `app/layout.tsx` to import Playfair Display (weights 700, 900) alongside Nunito. Set CSS variables `--font-display` and `--font-body`.

---

## Phase 2: Landing Page

### New file: `app/(marketing)/page.tsx`

**Section A — Hero**
- Playfair Display 900, large heading: "Fire your property manager. Keep the service."
- Subtitle in Nunito describing the AI workflow
- Two pill-shaped CTAs: "Get Started (Landlord)" and "Report an Issue (Tenant)"
- Hero background: muted autoplay video loop (MiniMax Hailuo-02), static image poster fallback for mobile
- Sits on sky-to-earth gradient background

**Section B — How It Works (3 steps)**
- Three cards in a row: Tenant Reports → AI Triages → You Approve
- Lucide icons (MessageCircle, Bot, CheckCircle)
- Connected by subtle arrows/lines on desktop
- Staggered fade-up animation (80ms delay between cards)

**Section C — Features Grid (2x3)**
- AI Triage, Vendor Search, One-Click Approval, Real-time Updates, Multi-Property Dashboard, 24/7 Availability
- Each card: Lucide icon in colored circle, title, one-line description
- Hover lift: `translateY(-2px)` + shadow deepen, 200ms

**Section D — Stats Bar**
- 3 big numbers in Playfair Display: "90% faster", "24/7", "$0 fees"
- Muted background band

**Section E — Final CTA**
- "Ready to fire your property manager?"
- Large pill-shaped "Get Started Free" button

**Section F — Footer**
- Logo, copyright, nav links

### Supporting Components

| Component | Purpose |
|-----------|---------|
| `components/LandingNav.tsx` | Transparent nav for marketing pages (logo + Sign In) |
| `components/FadeIn.tsx` | Client component, IntersectionObserver-based scroll animation |

---

## Phase 3: Auth System (Cookie-Based Mock)

Simple cookie-based auth — no external libraries. Perfect for hackathon demo.

### 3A. Mock Users (`lib/auth.ts`)

```
landlord@demo.com / demo123 → Landlord (Alex Johnson)
maria@demo.com / demo123    → Tenant (Maria Lopez, portland-oak-st)
james@demo.com / demo123    → Tenant (James Kim, chicago-pine-rd)
```

Session stored as base64-encoded JSON cookie (`propmind-session`).

### 3B. API Routes

- `POST /api/auth/login` — Validate credentials, set cookie, return user
- `POST /api/auth/logout` — Clear cookie
- `GET /api/auth/me` — Return current user from cookie

### 3C. Middleware (`middleware.ts`)

- Public routes: `/`, `/login`, `/api/auth/*`
- Unauthenticated → redirect to `/login`
- Landlord accessing `/tenant/*` → redirect to `/dashboard`
- Tenant accessing `/dashboard/*` → redirect to `/tenant/[slug]`

### 3D. Login Page (`app/(marketing)/login/page.tsx`)

- Clean form: email + password inputs
- "Sign In" primary button
- **Demo shortcuts**: "Sign in as Landlord" / "Sign in as Maria" buttons (one-click demo access)
- Matches design system (gradient bg, Playfair heading)

### 3E. Update Navbar

- Show logged-in user name + role badge
- "Sign Out" button
- Logo links to `/` (landing page)

### 3F. Client Session Hook (`lib/useSession.ts`)

- Calls `/api/auth/me` on mount
- Returns `{ user, loading, logout }`

---

## Phase 4: AI-Generated Images & Video

### Strategy: MiniMax MCP Server

Set up the [MiniMax MCP JS server](https://github.com/MiniMax-AI/MiniMax-MCP-JS) in Claude Code's MCP config. This gives us `generate_image` and `generate_video` tools to create assets during development, saved to `public/images/`.

**MCP Setup** (`.claude/settings.json` or project MCP config):
```json
{
  "mcpServers": {
    "minimax": {
      "command": "npx",
      "args": ["-y", "minimax-mcp-js"],
      "env": {
        "MINIMAX_API_HOST": "https://api.minimaxi.chat",
        "MINIMAX_API_KEY": "<from .env.local>",
        "MINIMAX_MCP_BASE_PATH": "D:/projects/promanager/propmind/public/images",
        "MINIMAX_RESOURCE_MODE": "local"
      }
    }
  }
}
```

### Assets to Generate

| Asset | Tool | Prompt Concept | Format |
|-------|------|---------------|--------|
| Hero video | `generate_video` (Hailuo-02) | Cinematic drone shot of a beautiful residential neighborhood at golden hour, warm lighting, lush green landscaping, peaceful suburban feel | 10s, 1080P, muted loop |
| Hero fallback image | `generate_image` | Same concept as video — modern residential property, warm golden hour light, moss green accents | 16:9 |
| OG social image | `generate_image` | PropMind branded preview — property with subtle AI/tech overlay | 16:9 |

The hero section plays the video as a muted autoplay loop on desktop, with the static image as a `<video poster>` fallback and for mobile.

### Also: API Route for Future Use

Create `app/api/generate-image/route.ts` and `lib/image-gen.ts` as utilities for direct MiniMax image API calls, for runtime generation or regenerating assets.

---

## Phase 5: Polish & Verification

- Add OpenGraph metadata to landing page
- Test full flow: Landing → Login → Dashboard/Tenant Chat → Logout → Landing
- Responsive check: mobile, tablet, desktop
- Verify Vercel deployment works with route groups

---

## Implementation Order

1. **Foundation** (Phase 1): Route groups, design system, fonts
2. **Landing page** (Phase 2): All sections + animations
3. **Auth** (Phase 3): Login, middleware, session
4. **Images** (Phase 4): MiniMax MCP setup, generate assets
5. **Polish** (Phase 5): OG tags, responsive, deploy

## Files Summary

**New files (14):**
- `app/(marketing)/layout.tsx`, `app/(marketing)/page.tsx`, `app/(marketing)/login/page.tsx`
- `app/(app)/layout.tsx`
- `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `app/api/auth/me/route.ts`
- `app/api/generate-image/route.ts`
- `components/LandingNav.tsx`, `components/FadeIn.tsx`
- `lib/auth.ts`, `lib/useSession.ts`, `lib/image-gen.ts`
- `middleware.ts`

**Modified files (3):**
- `app/layout.tsx`, `app/globals.css`, `components/Navbar.tsx`

**Moved files:**
- `app/dashboard/` → `app/(app)/dashboard/`
- `app/tenant/` → `app/(app)/tenant/`

**Deleted files:**
- `app/page.tsx` (replaced by marketing route group)
