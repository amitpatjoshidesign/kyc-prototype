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
- `DocsView` receives `selectedProductId` / `onSelectProduct`
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

Icons: `@phosphor-icons/react` throughout (use `weight="duotone"` for decorative icons, `weight="fill"` for active/selected states, `weight="regular"` for nav items).

Charts: `highcharts` + `highcharts-react-official`, loaded client-side only. Highcharts modules (sankey, variable-pie) are dynamically `require()`d inside a `typeof window !== "undefined"` guard at the top of `DashboardView`.

All view/page components use `"use client"` — there are no server components beyond `layout.tsx`.

### Theming

- Dark mode uses a `.dark` class on `<html>`, toggled via `localStorage("theme")` in the nav (inside `page.tsx`, not `Header`).
- `globals.css` defines all design tokens as CSS variables (HSL format) under `:root` and `.dark`.
- Tailwind colors reference these variables (e.g. `bg-background`, `text-foreground`, `text-muted-foreground`).
- Custom token: `sidebar-accent` for nav item active states.
- Brand palette: `setu-brand-*` (teal/cyan scale) defined in `tailwind.config.ts`.
- Smooth dark mode transitions: temporarily add `theme-transition` class to `<html>`, removed after 500ms.

### MCP servers

- **agentation** MCP server configured (runs via `npx agentation-mcp server` on port 4747)
- **Figma** capture script loaded in `src/app/layout.tsx` for design export
