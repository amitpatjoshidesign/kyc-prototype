# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js on port 3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
```

No test suite is configured.

## Architecture

This is a **Next.js 14** app (App Router) with TypeScript and Tailwind CSS, serving as a UI prototype for "Bridge" — a fintech developer platform (Setu/BBPS products). There is no backend; all state is stored in `localStorage`.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Homepage: product catalog + tab-switched views |
| `/kyc` | Multi-step business KYC form |
| `/kyc/bbps` | BBPS BOU KYC flow |
| `/kyc/insights` | Account Aggregator / Insights flow |
| `/login` | Standalone login page (also appears as a Dialog overlay) |

### Homepage layout & tab navigation

`src/app/page.tsx` is the central hub. It renders a **three-column layout**:
1. **Icon nav** (fixed, 68px wide) — logo, nav icons, theme toggle, user avatar/popover
2. **Secondary panel** (fixed, 216px wide, only shown when not on `"home"` tab) — contextual sidebar with product list, settings sections, etc.
3. **Main content** — shifts margin-left depending on whether secondary panel is visible (`md:ml-[68px]` vs `md:ml-[284px]`)

`activeTab` state (`"home" | "dashboard" | "docs" | "settings" | "configuration"`) controls which view renders in main content. All view components are dynamically imported (`next/dynamic`, SSR disabled) with skeleton loading states. Props are passed from `page.tsx` into views:
- `DocsView` receives `selectedProductId` / `onSelectProduct`; it also renders an inline "Ask Setu AI" chat panel in the right column
- `SettingsView` receives `section`

The `PRODUCTS` constant in `page.tsx` is the single source of truth for the product catalog and is reused in the secondary panel nav for docs/dashboard.

### KYC flows

The KYC routes (`/kyc`, `/kyc/bbps`, `/kyc/insights`) are self-contained multi-step forms using shared layout components: `Header`, `Sidebar` (step indicator), `Breadcrumb`, `StepHeader`, and `FileUploadField`. Steps are driven by a local `currentStep` index.

### ConfigurationView

`src/components/ConfigurationView.tsx` is a 7-step product configuration wizard (Environment → API Credentials → Webhooks → Settlement Account → Transaction Limits → Payment Modes → Review & Launch). Steps are rendered inline with `currentStep` state.

### Data model

`src/types/onboarding.ts` contains the comprehensive TypeScript data model for UPI merchant onboarding, including `UPIOnboardingRequest`, `EstablishmentType` enum (16 entity types), and `ESTABLISHMENT_TYPE_REQUIREMENTS` mapping. This is reference/documentation only — the prototype does not submit this data anywhere.

### Auth pattern

Auth is purely localStorage-based:
- `bridge_auth` = `"true"` when logged in
- `bridge_email` = user's email
- `kyc_started` / `kyc_completed` = KYC flow progress flags

Login is gated: clicking a product card shows a `Dialog` overlay (`LoginOverlay` component inside `page.tsx`) before routing to the KYC flow. After auth, `pendingHref` ref stores the intended destination.

### UI components

Components follow the **shadcn/ui** pattern (configured in `components.json`). Primitives are in `src/components/ui/` and wrap Radix UI. Custom additions:
- `input-group.tsx` — compound input with addons/buttons (`InputGroup`, `InputGroupInput`, `InputGroupAddon`, `InputGroupButton`, `InputGroupTextarea`)
- `field.tsx` — form field wrapper with label and error (`Field`, `FieldLabel`, `FieldError`)
- `kbd.tsx` — keyboard shortcut display

Icons: `@phosphor-icons/react` throughout custom components (use `weight="duotone"` for decorative icons, `weight="fill"` for active/selected states, `weight="regular"` for nav items). `lucide-react` is used only internally by shadcn/ui primitives — do not use it in new components.

Charts: `highcharts` + `highcharts-react-official`, loaded client-side only. Highcharts modules (sankey, variable-pie) are dynamically `require()`d inside a `typeof window !== "undefined"` guard at the top of `DashboardView`.

Animations: `framer-motion` powers tab transitions in `page.tsx`. `AnimatePresence mode="wait"` wraps the main content area so tabs cross-fade. The secondary panel slides in/out with `motion.aside`. Use `AnimatePresence` + keyed `motion.div` for any new animated tab/view transitions.

`canvas-confetti` fires on BBPS KYC completion (`src/app/kyc/bbps/page.tsx`).

All view/page components use `"use client"` — there are no server components beyond `layout.tsx`.

### Theming

- Dark mode uses a `.dark` class on `<html>`, toggled via `localStorage("theme")` in the nav (inside `page.tsx`, not `Header`).
- `globals.css` defines all design tokens as CSS variables (HSL format) under `:root` and `.dark`.
- Tailwind colors reference these variables (e.g. `bg-background`, `text-foreground`, `text-muted-foreground`).
- Custom token: `sidebar-accent` for nav item active states.
- Brand palette: `setu-brand-*` (teal/cyan scale) defined in `tailwind.config.ts`.
- Smooth dark mode transitions: temporarily add `theme-transition` class to `<html>`, removed after 500ms.

### Smart Insights panel

`src/components/AIInsightsSummary.tsx` — exports `<AIInsightsSummary />`, rendered inside `DashboardView` (`src/components/DashboardView.tsx`).

**What it is:** A button on the dashboard that opens a right-side `Sheet` (500px wide) showing AI-generated UPI transaction analysis. It also includes an inline follow-up Q&A interface.

**Structure of the sheet:**
1. **Header** — title, date range, refresh + close buttons
2. **Summary** — 3-bullet highlight list in a `bg-muted` card
3. **Notable Changes** — collapsible section with animated `AnimatePresence` expand/collapse
4. **Risk Signals** — collapsible section, same pattern, red icon accent
5. **Inline Q&A** — chat pairs (user pill right-aligned + assistant answer) appended below the insight sections; auto-scrolls on new messages
6. **Floating footer** — gradient fade overlay + textarea input + suggestion chip ticker

**Suggestion chips:** `exploreFurther` questions cycle automatically every 2s (ticker mode) when the sheet is open. A `Rows` icon button expands the full list. Clicking a chip pre-fills the textarea.

**Chat / streaming:** `getMockResponse(q)` returns a hardcoded string based on keyword matching. Streaming is simulated character-by-character with `setInterval` at 18ms/char. Real API integration would replace `getMockResponse` and the interval loop.

**Entry point button:** The `<AIInsightsSummary />` button has an animated beam effect (slides left-to-right, runs twice on mount) and a teal border on hover. Both use inline `style` + CSS keyframes injected via `<style>`.

**All data is mocked** in the `MOCK_INSIGHTS` const at the top of the file — no API calls. To wire up a real backend, replace `MOCK_INSIGHTS` with a fetch and `getMockResponse` with a streaming Claude API call.

### MCP servers

- **agentation** MCP server configured (runs via `npx agentation-mcp server` on port 4747)
- **Figma** capture script loaded in `src/app/layout.tsx` for design export
