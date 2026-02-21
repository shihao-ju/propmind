# PLAN.md — PropMind Landing Page Implementation

## Current State Summary

The codebase has a working Next.js 15 App Router application with:
- Root layout at `app/layout.tsx` (Nunito font only, Navbar and DemoWrapper rendered for all pages)
- Root page at `app/page.tsx` (immediate redirect to `/dashboard`)
- Dashboard, tenant chat, API routes all functional
- Design tokens in `app/globals.css` using OKLch (NOT the Design Bible's HSL palette)
- No middleware, no auth, no route groups
- Empty `app/(app)/` and `app/(marketing)/` directories already exist

---

## Phase 1: Foundation — Route Groups, Design System, Fonts

### Step 1.1: Update `app/globals.css` — Replace Design Tokens

Replace OKLch colors with Design Bible HSL palette:
- Primary: Moss Green `#2D6A4F` → `153 40% 30%`
- Secondary: Warm Soil Brown `#8B6914` → `43 75% 31%`
- Accent: Sunset Coral `#F28B6E` → `13 84% 69%`
- Background: Sky Blue `#F0F7FF` → `212 100% 97%`
- Add status colors: `--success`, `--warning`, `--info`
- Fix `--radius` to `1rem`
- Update `@theme inline` to use `hsl()` wrappers
- Add `.bg-propmind-gradient` class (sky-to-earth gradient)
- Add `@keyframes fade-up` and `.animate-fade-up`

### Step 1.2: Add Playfair Display Font to Root Layout

**File:** `app/layout.tsx`
- Add `Playfair_Display` import (weights 700, 900) with variable `--font-display`
- Keep Nunito as `--font-body`
- Strip Navbar and DemoWrapper (they move to `(app)` layout)
- Set `font-sans` → `var(--font-body)` via `@theme inline`

### Step 1.3: Create `(app)` Route Group Layout

**File:** `app/(app)/layout.tsx` (NEW)
- Wraps dashboard + tenant pages with Navbar + DemoWrapper
- `bg-background`, `flex flex-col h-screen`

### Step 1.4: Move Pages into `(app)` Route Group

- `app/dashboard/` → `app/(app)/dashboard/`
- `app/tenant/` → `app/(app)/tenant/`
- URLs don't change (route groups are excluded from URLs)
- No code changes inside moved files

### Step 1.5: Create `(marketing)` Route Group Layout

**File:** `app/(marketing)/layout.tsx` (NEW)
- Gradient background (`bg-propmind-gradient`), no Navbar

---

## Phase 2: Landing Page

### Step 2.1: Create `FadeIn` Client Component

**File:** `components/FadeIn.tsx` (NEW)
- IntersectionObserver-based scroll animation
- Props: `delay`, `direction` (up/down/left/right), `duration`, `threshold`
- Observes once, then disconnects

### Step 2.2: Create `LandingNav` Component

**File:** `components/LandingNav.tsx` (NEW)
- Transparent nav: logo + "Sign In" link
- Absolute positioned, z-50

### Step 2.3: Create Landing Page

**File:** `app/(marketing)/page.tsx` (NEW)

Six sections:
1. **Hero** — Playfair 900 heading, subtitle, two pill CTAs, video bg (desktop), gradient overlay
2. **How It Works** — 3 cards (Tenant Reports → AI Triages → You Approve), connecting line on desktop, staggered fade-up
3. **Features Grid** — 2x3 grid (AI Triage, Vendor Search, One-Click Approval, Real-time Updates, Multi-Property Dashboard, 24/7), hover lift
4. **Stats Bar** — 3 big numbers: "90% faster", "24/7", "$0 fees"
5. **Final CTA** — "Ready to fire your property manager?" + Get Started Free button
6. **Footer** — Logo, nav links, copyright

### Step 2.4: Delete Old `app/page.tsx`

Replaced by `app/(marketing)/page.tsx`.

---

## Phase 3: Auth System (Cookie-Based Mock)

### Step 3.1: Create Auth Library

**File:** `lib/auth.ts` (NEW)

Mock users:
```
landlord@demo.com / demo123 → Landlord (Alex Johnson)
maria@demo.com / demo123    → Tenant (Maria Lopez, portland-oak-st)
james@demo.com / demo123    → Tenant (James Kim, chicago-pine-rd)
```

- Base64-encoded JSON cookie (`propmind-session`)
- `validateCredentials()`, `encodeSession()`, `decodeSession()`, `getSession()`
- Edge-safe: use `typeof Buffer` guard, fallback to `atob`/`btoa`

### Step 3.2: Auth API Routes

- `POST /api/auth/login` — Validate creds, set httpOnly cookie, return user
- `POST /api/auth/logout` — Clear cookie
- `GET /api/auth/me` — Return current user from cookie

### Step 3.3: Create Middleware

**File:** `middleware.ts` (NEW, project root)

- Public routes: `/`, `/login`, `/api/auth/*`
- All `/api/` routes pass through (no auth check for hackathon)
- Unauthenticated → redirect to `/login?redirect=<original>`
- Tenant accessing `/dashboard/*` → redirect to `/tenant/[slug]`
- Landlord accessing `/tenant/*` → redirect to `/dashboard`
- Matcher excludes `_next`, `favicon.ico`, `images/`

**Edge runtime note:** Use `decodeSession` (not `getSession`) — read from `req.cookies` directly.

### Step 3.4: Create Login Page

**File:** `app/(marketing)/login/page.tsx` (NEW)

- Email + password form
- Demo shortcuts: "Sign in as Landlord", "Sign in as Maria", "Sign in as James"
- Post-login redirect based on role or `?redirect=` param
- Wrap with `<Suspense>` for `useSearchParams`

### Step 3.5: Client Session Hook

**File:** `lib/useSession.ts` (NEW)

- Calls `/api/auth/me` on mount
- Returns `{ user, loading, logout, refresh }`

### Step 3.6: Update Navbar

**File:** `components/Navbar.tsx` (MODIFY)

- Convert to `'use client'` component
- Use `useSession` hook
- Show user name + role badge + "Sign Out" button
- Logo links to `/` (landing page)

---

## Phase 4: AI-Generated Images & Video

### Step 4.1: Create `public/images/` Directory

### Step 4.2: Configure MiniMax MCP Server

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

### Step 4.3: Generate Assets

| Asset | Tool | Format |
|-------|------|--------|
| `hero-video.mp4` | `generate_video` (Hailuo-02) | 10s, 1080P, muted loop |
| `hero-fallback.jpg` | `generate_image` | 16:9 |
| `og-image.jpg` | `generate_image` | 1200x630 |

### Step 4.4: Image Generation Utility (Optional)

- `lib/image-gen.ts` — Direct MiniMax image API wrapper
- `app/api/generate-image/route.ts` — API route for runtime generation

---

## Phase 5: Polish & Verification

### Step 5.1: Add OpenGraph Metadata

Add `metadata` export to `app/(marketing)/page.tsx` with OG image, title, description.

### Step 5.2: Responsive Check

- Mobile: hero wraps, CTAs stack, grids collapse to 1 column
- Tablet: features 2-col, how-it-works 3-col
- Desktop: full layout, video plays

### Step 5.3: Full Flow Test

1. `/` → Landing page
2. Click CTA → `/login`
3. Demo login → `/dashboard` (landlord) or `/tenant/[slug]` (tenant)
4. Sign Out → back to `/`
5. Role-based redirects work

### Step 5.4: Vercel Deployment

- Middleware picked up at project root
- `public/images/` served as static
- Video file under Vercel's 50MB limit

---

## Implementation Order

```
1.1 globals.css
1.2 root layout (fonts)
1.3 (app) layout
1.4 move pages
1.5 (marketing) layout
2.1 FadeIn component
2.2 LandingNav component
2.3 Landing page
2.4 Delete old page.tsx
3.1 Auth library
3.2 Auth API routes
3.3 Middleware
3.4 Login page
3.5 useSession hook
3.6 Update Navbar
4.1 images directory
4.2 MCP config (manual)
4.3 Generate assets (manual)
4.4 Image gen utility (optional)
5.1 OG metadata
5.2-5.4 Testing
```

---

## Files Summary

**New files (16):**
- `app/(marketing)/layout.tsx`, `app/(marketing)/page.tsx`, `app/(marketing)/login/page.tsx`
- `app/(app)/layout.tsx`
- `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `app/api/auth/me/route.ts`
- `app/api/generate-image/route.ts`
- `components/LandingNav.tsx`, `components/FadeIn.tsx`
- `lib/auth.ts`, `lib/useSession.ts`, `lib/image-gen.ts`
- `middleware.ts`
- `public/images/` (directory)

**Modified files (3):**
- `app/layout.tsx` — Add Playfair Display, strip Navbar/DemoWrapper
- `app/globals.css` — Replace OKLch with HSL palette, add gradient/animation
- `components/Navbar.tsx` — Add session display, sign out button

**Moved files:**
- `app/dashboard/` → `app/(app)/dashboard/`
- `app/tenant/` → `app/(app)/tenant/`

**Deleted files:**
- `app/page.tsx` (replaced by marketing route group)

---

## Decisions Requiring User Input

1. **Video file size** — Hero video could be 10-50MB. Acceptable for Vercel free plan (50MB limit)?
2. **Dark mode** — Skip for now or add CSS variables for future use?
3. **API route auth** — Currently all `/api/` routes are unprotected. OK for hackathon?
