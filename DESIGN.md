# Bridge — Design Reference

A living design reference for the Bridge fintech developer-platform prototype. This document covers visual language, layout, components, and interaction patterns.

---

## 1. Product overview

**Bridge** is a developer-facing platform built by Setu that lets fintech companies activate and manage payment/data products (BBPS, UPI, KYC, eSign, Account Aggregator, Insights). The prototype is a Next.js 14 app with no real backend — all state lives in `localStorage`.

---

## 2. Brand & identity

| Element | Value |
|---|---|
| Product name | Bridge |
| Company | Setu |
| Logo | Rounded-square icon with stylised "S" wave motif — `Logo/setulogo.svg` (mark only) and `Logo/setulogo-full.svg` (mark + wordmark) |
| Splash images | `public/splash.png`, `public/splash2.png`, `public/splash-3.png` (used in login dialog left panel) |
| Brand voice | Technical, concise, developer-friendly |

---

## 3. Color system

Colors are defined as CSS custom properties (HSL) in `src/app/globals.css` and mapped into Tailwind via `tailwind.config.ts`. Always use the semantic tokens (`bg-background`, `text-primary`, etc.) rather than raw hex values.

### Light mode tokens

| Token | HSL | Role |
|---|---|---|
| `--background` | `0 0% 100%` | Page / card background |
| `--foreground` | `33 5% 10%` | Body text |
| `--primary` | `187 98% 33%` | Brand teal — buttons, links, active states |
| `--primary-foreground` | `0 0% 100%` | Text on primary |
| `--secondary` | `189 87% 89%` | Soft teal — chip/badge backgrounds |
| `--secondary-foreground` | `187 98% 33%` | Text on secondary |
| `--muted` | `30 6% 96%` | Subtle surfaces, skeleton loaders |
| `--muted-foreground` | `20 5% 45%` | Placeholder / supporting text |
| `--accent` | `190 100% 95%` | Very light teal — hover highlights |
| `--accent-foreground` | `187 98% 33%` | Text on accent |
| `--destructive` | `0 84.2% 60.2%` | Error / danger |
| `--border` | `24 6% 83%` | Dividers, input borders |
| `--ring` | `187 98% 33%` | Focus rings |
| `--sidebar-accent` | `0 0% 96%` | Active nav item background |
| `--radius` | `0.5rem` | Base border radius |

### Dark mode tokens (`.dark`)

| Token | HSL |
|---|---|
| `--background` | `33 5% 5%` |
| `--foreground` | `30 6% 96%` |
| `--primary` | `185 80% 83%` (pale teal) |
| `--muted` | `20 6% 15%` |
| `--muted-foreground` | `24 5% 64%` |
| `--border` | `20 6% 25%` |
| `--sidebar-accent` | `20 6% 15%` |

### Brand palette (`setu-brand-*`)

A 10-step teal/cyan scale for direct use where semantic tokens don't apply:

| Step | Hex |
|---|---|
| 50 | `#E8FBFF` |
| 100 | `#CDF5FA` |
| 500 | `#57D9EA` |
| 700 | `#03C0D9` (primary brand anchor) |
| 800 | `#0293A6` |
| 900 | `#026674` |
| 950 | `#013941` |

### Semantic color usage for product categories

- **Payments products** — teal (`bg-secondary`, `text-primary`) icon backgrounds
- **Data products** — orange (`bg-orange-100 dark:bg-orange-950`, `text-orange-600 dark:text-orange-400`) icon backgrounds
- **Status: success / live** — emerald (`bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400`)
- **Status: in-progress** — amber (`bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400`)
- **Status: not started** — muted (`bg-muted text-muted-foreground`)

---

## 4. Typography

Typography inherits the system font stack via Tailwind defaults.

| Usage | Classes |
|---|---|
| Page heading | `text-2xl font-bold text-foreground` |
| Section heading | `text-xl font-bold` / `text-lg font-semibold` |
| Card title | `text-lg` (via `CardTitle`) |
| Body / form labels | `text-sm font-medium text-foreground` |
| Supporting / secondary | `text-sm text-muted-foreground` |
| Caption / micro labels | `text-xs text-muted-foreground` |
| Sidebar section labels | `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground` |
| Step counter (config sidebar) | `tabular-nums text-[11px] text-muted-foreground` |

---

## 5. Layout

### App shell (homepage `src/app/page.tsx`)

Three-column layout using fixed positioning + margin offset:

```
┌──────────┬────────────────┬────────────────────────────────┐
│ Icon nav │ Secondary panel│ Main content                   │
│  68px    │   216px        │  flex-1                        │
│  fixed   │   fixed        │  margin-left: 68px or 284px    │
└──────────┴────────────────┴────────────────────────────────┘
```

- **Icon nav**: `fixed left-0 top-0 bottom-0 z-50 w-16` — always visible on `md+`
- **Secondary panel**: `fixed left-[68px] top-2 bottom-2 w-[216px] z-40` — slides in/out with `framer-motion`; hidden on `home` and `products` tabs (unless eSign is activated)
- **Main content**: `md:ml-[68px]` (no secondary panel) or `md:ml-[284px]` (secondary panel visible)
- Main content panels use `my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)]` to give a floating card appearance against `bg-muted/50` page background

### KYC flow layout (`/kyc`, `/kyc/bbps`, `/kyc/insights`)

```
┌──────────────────────────────────────────────────────────┐
│ Header (breadcrumb + progress)                          │
├──────────────┬───────────────────────────────────────────┤
│ Sidebar      │ Main form area                            │
│ step list    │                                           │
│ (desktop)    │                                           │
└──────────────┴───────────────────────────────────────────┘
```

Components: `Header`, `Sidebar`, `Breadcrumb`, `StepHeader`, `FileUploadField`

### Bottom fade

A `pointer-events-none fixed bottom-0` gradient overlay (`h-[120px]`, `bg-gradient-to-t from-background`) masks the bottom scroll edge across all pages.

---

## 6. Navigation

### Icon nav items

| Icon | Label | Tab |
|---|---|---|
| `House` | Home | `home` |
| `Speedometer` | Dashboard | `dashboard` |
| `BookOpen` | Docs | `docs` |
| `SquaresFour` | Products | `products` |
| `Faders` | Configuration | `configuration` |
| `GearSix` | Settings | `settings` |

**Active state**: `bg-sidebar-accent text-foreground`, icon `weight="fill"`  
**Inactive state**: `text-muted-foreground`, icon `weight="regular"`, hover `hover:text-foreground hover:bg-foreground/8`  
**Icon size**: `22px` for nav, `20px` for utility buttons (theme, reset)

### Nav bottom row

- **Reset credits** (`ArrowCounterClockwise`) — dev utility
- **Dark mode toggle** (`Moon` / `Sun`)
- **User avatar** — initials in `bg-orange-500` circle when logged in; `?` placeholder when anonymous

### Tooltips

All nav icons have `<Tooltip side="right">` via Radix + shadcn. `delayDuration={200}`.

### Secondary panel

Contextual per active tab:
- **Home** (post-activation): "Products in use" + "Continue setup" sections
- **Dashboard**: "Your products" list
- **Docs**: Full product list grouped by category (PAYMENTS / DATA)
- **Settings**: `["Account", "Credits & usage", "Team", "API Keys", "Webhooks"]`
- **Configuration**: Product switcher (UPI / eSign) + step list with numbered items

---

## 7. Products catalog

### Categories and products

**PAYMENTS**
| ID | Title | Description | Features |
|---|---|---|---|
| `bbps` | BBPS | Power payments over BBPS | BBPS BOU, BBPS COU |
| `upi` | UPI | Power seamless UPI payment journeys | Recur, Deeplinks, Flash, Reserve, Third Party Verification |
| `pg` | Payment Gateway | Accept online payments with ease | Cards, Net banking, UPI, Wallets |
| `payouts` | Payouts | Disburse payments at scale | Bank transfers, UPI payouts, Bulk disbursals |
| `creditline` | Credit Line | Enable credit for your customers | Instant approval, Flexible limits, EMI options |

**DATA**
| ID | Title | Description | Features |
|---|---|---|---|
| `kyc` | KYC | Verify individuals or businesses | Bank account verification, PAN, eKYC Setu, DigiLocker |
| `esign` | eSign Gateway | India's best Aadhaar eSign | Aadhaar eSign, Digital signatures, Document workflow |
| `aa` | Account Aggregator | Financial data with consent | Consent management, Financial data, Multi-FIP |
| `insights` | Insights | Customer financial data analytics | Credit scoring, Risk analysis, Income verification |

### Product card anatomy

```
┌──────────────────────────────────┐
│ [Icon]  (colored bg, 40×40)      │
│                                  │
│ Title (text-lg font-bold)        │
│ Description (text-sm muted)      │
│                                  │
│ [feature] [feature] [feature]    │  ← `rounded-full bg-muted` chips
│                                  │
│ [CTA button]  [Secondary button] │
└──────────────────────────────────┘
```

Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`  
Card style: `shadow-none border border-border/40`

---

## 8. Flows

### Auth flow

1. Unauthenticated user clicks a product CTA
2. `pendingHref` ref stores destination
3. `Dialog` overlay opens with `LoginOverlay` (split-panel: splash image left + form right)
4. On success → onboarding survey (`OnboardingSurvey`) if first login
5. After survey (or skip) → navigate to `pendingHref`

Login state in localStorage: `bridge_auth`, `bridge_email`

### KYC flow (`/kyc`)

Multi-step form for business KYC / UPI merchant onboarding. Steps driven by `currentStep` index with `Sidebar` (step indicator) + `StepHeader`.  
Completion sets `kyc_completed = "true"` in localStorage.

### BBPS BOU KYC (`/kyc/bbps`)

Similar multi-step form for BBPS onboarding. Fires `canvas-confetti` on completion.

### Account Aggregator / Insights KYC (`/kyc/insights`)

Multi-step form for AA/Insights onboarding.

### eSign activation flow

1. Click "Start using eSign" → checks auth → `esign_activated = "true"` in localStorage
2. Redirects to `configuration` tab with `configProduct = "esign"`
3. Home tab shows 3-step tracker: KYC → Configure → Buy Credits
4. Credits purchased at `/esign/credits`

### UPI Configuration wizard (`ConfigurationView`)

8 steps:
1. **Environment** — Sandbox vs Production radio cards
2. **API Credentials** — Client ID + Secret with copy button
3. **Webhooks** — URL input + event toggles
4. **Settlement Account** — Bank details form
5. **Transaction Limits** — Min/max per-transaction + daily limit sliders/inputs
6. **Payment Modes** — UPI, cards, net banking toggles
7. **VPA Handle** — Custom VPA prefix input
8. **Go-Live Checklist** — Final review with checklist items + "Launch" CTA

eSign configuration wizard has 3 steps: Configure product → Test product → Add details for production.

---

## 9. Components

### Primitives (`src/components/ui/`)

All follow the shadcn/ui pattern wrapping Radix UI.

| File | Component(s) |
|---|---|
| `button.tsx` | `Button` — variants: `default`, `outline`, `ghost`, `destructive` |
| `input.tsx` | `Input` |
| `input-group.tsx` | `InputGroup`, `InputGroupInput`, `InputGroupAddon`, `InputGroupButton`, `InputGroupTextarea` — compound input with prefix/suffix addons |
| `field.tsx` | `Field`, `FieldLabel`, `FieldError` — form field wrapper |
| `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `dialog.tsx` | `Dialog`, `DialogContent`, `DialogTitle`, etc. |
| `select.tsx` | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` |
| `checkbox.tsx` | `Checkbox` |
| `badge.tsx` | `Badge` |
| `separator.tsx` | `Separator` |
| `tooltip.tsx` | `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` |
| `popover.tsx` | `Popover`, `PopoverTrigger`, `PopoverContent` |
| `sheet.tsx` | `Sheet` — right-side drawer (500px wide in AI Insights) |
| `calendar.tsx` | `Calendar` (via `react-day-picker`) |
| `textarea.tsx` | `Textarea` |
| `label.tsx` | `Label` |
| `kbd.tsx` | `Kbd` — keyboard shortcut badge |

### Custom components

| File | Purpose |
|---|---|
| `Header.tsx` | KYC flow top bar with breadcrumb + progress |
| `Sidebar.tsx` | KYC step indicator (vertical list, desktop) + `MobileStepIndicator` |
| `Breadcrumb.tsx` | KYC breadcrumb nav |
| `BbpsBreadcrumb.tsx` | BBPS-specific breadcrumb |
| `InsightsBreadcrumb.tsx` | Insights-specific breadcrumb |
| `StepHeader.tsx` | Step title + description heading block |
| `FileUploadField.tsx` | Drag-and-drop / click-to-upload field |
| `OnboardingSurvey.tsx` | Post-signup multi-step survey dialog |
| `DashboardView.tsx` | Dashboard tab: KPI cards, Highcharts, transaction table |
| `DocsView.tsx` | Docs tab: product API documentation + "Ask Setu AI" chat panel |
| `SettingsView.tsx` | Settings tab: account, credits, team, API keys, webhooks |
| `ConfigurationView.tsx` | UPI 8-step configuration wizard |
| `EsignConfigurationView.tsx` | eSign 3-step configuration wizard |
| `AIInsightsSummary.tsx` | AI-powered UPI transaction analysis sheet (see §12) |

---

## 10. Icons

Library: `@phosphor-icons/react`

**Weight conventions**:
- `weight="duotone"` — decorative / product icons in cards
- `weight="fill"` — active / selected state in nav
- `weight="regular"` — nav items (inactive), utility buttons

Do **not** use `lucide-react` in new components (it's used internally by shadcn/ui primitives only).

Common icon → concept mappings:
- `Receipt` → BBPS
- `CurrencyCircleDollar` → UPI
- `CreditCard` → Payment Gateway
- `Wallet` → Payouts
- `Coins` → Credit Line
- `MagnifyingGlass` → KYC
- `PenNib` → eSign
- `TreeStructure` → Account Aggregator
- `ChartLine` → Insights
- `GearSix` → Settings
- `Faders` → Configuration
- `SquaresFour` → Products / Home empty state

---

## 11. Animation & motion

Library: `framer-motion`

### Tab transitions

`AnimatePresence mode="wait"` wraps the main content area. Each tab is a keyed `motion.div`:
```
initial:  { opacity: 0, y: 8 }
animate:  { opacity: 1, y: 0 }
exit:     { opacity: 0, y: -6 }
duration: 0.2s, ease: "easeOut"
```

### Secondary panel slide-in
```
initial:  { opacity: 0, x: -12 }
animate:  { opacity: 1, x: 0 }
exit:     { opacity: 0, x: -12 }
duration: 0.18s, ease: "easeOut"
```

### Theme transition

On dark mode toggle: `theme-transition` class added to `<html>` for 500ms, triggering CSS transitions on `background-color` (0.4s), `color` / `border-color` / `box-shadow` / `fill` / `stroke` (0.3s).

### Global keyframes (globals.css)

| Class | Effect |
|---|---|
| `animate-progress-bar` | Width 0→100% over 3s (KYC progress bar) |
| `animate-gradient-breathe` | Opacity + scale pulse 6s (splash gradient overlay) |

### Confetti

`canvas-confetti` fires on BBPS KYC completion (`/kyc/bbps`).

---

## 12. AI Insights panel (`AIInsightsSummary`)

Entry: animated beam-effect button on Dashboard (teal border on hover, left-to-right beam runs twice on mount).

Opens a right-side `Sheet` (500px wide):

| Section | Details |
|---|---|
| Header | Title, date range, refresh + close buttons |
| Summary | 3-bullet highlights in `bg-muted` card |
| Notable Changes | Collapsible with `AnimatePresence` expand/collapse |
| Risk Signals | Collapsible, red icon accent |
| Inline Q&A | User pills (right-aligned) + streamed assistant answers |
| Floating footer | Gradient fade + textarea + rotating suggestion chip ticker |

Suggestion chips cycle every 2s (ticker mode). A `Rows` icon expands the full list. Simulated streaming: `setInterval` at 18ms/char.

---

## 13. Dashboard (`DashboardView`)

- **KPI cards** — 5-column grid, metric + delta indicator (`ArrowUp` green / `ArrowDown` red)
- **Charts** (Highcharts, client-side only):
  - Volume over time (line/area)
  - Payment mode split (variable-pie)
  - Transaction flow (sankey)
- **Transaction table** — paginated, 20 mock rows with date, payment ID, TXN ID, merchant ref, RRN, amount
- **Time filter** — "Last 7 days" / "Last 30 days" / "Last 90 days" / "Custom" (scales mock data with multipliers)
- Charts auto-adapt theme via `getChartTheme(isDark)` helper

---

## 14. Theming

Dark mode uses a `.dark` class on `<html>`, toggled via `localStorage("theme")`. System preference respected on first load.

CSS variable approach means all shadcn/ui components and Tailwind utilities update automatically — no component-level dark: overrides needed beyond the token definitions in `globals.css`.

---

## 15. Auth & state

All persistent state is `localStorage`-only (no backend):

| Key | Value |
|---|---|
| `bridge_auth` | `"true"` when logged in |
| `bridge_email` | User email string |
| `bridge_survey` | JSON survey answers |
| `bridge_survey_completed` | `"true"` or `"skipped"` |
| `kyc_started` | `"true"` |
| `kyc_completed` | `"true"` |
| `esign_activated` | `"true"` |
| `esign_config_completed` | `"true"` |
| `esign_credits` | `"1l"` / `"3l"` / `"5l"` |
| `billing_pack_id` | Billing plan ID |
| `billing_purchased_at` | Timestamp |
| `theme` | `"dark"` / `"light"` |

---

## 16. Skeleton loading states

Dynamic-imported views each have a `loading` fallback passed to `next/dynamic`:
- Animated `bg-muted rounded animate-pulse` placeholder blocks
- Dashboard: 5-column grid of `h-24` cards
- Settings: 3 stacked `h-32` cards
- Configuration: progress bar + single large card
- Docs: 2-column (sidebar + content) layout
