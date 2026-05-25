# Repository Guidelines

## Project Structure & Module Organization

This is a private Next.js 14 TypeScript prototype using the App Router. Route entry points live in `src/app/`, including `/`, `/login`, `/kyc`, `/kyc/bbps`, `/kyc/insights`, and `/esign/credits`. Reusable product views and layout pieces live in `src/components/`; shadcn-style primitives are isolated in `src/components/ui/`. Shared helpers are in `src/lib/`, and shared TypeScript models are in `src/types/`. Static assets are split between `public/`, `Logo/`, `Images/`, and `Reference image/`.

## Build, Test, and Development Commands

```bash
npm install      # Install dependencies from package-lock.json
npm run dev      # Start the local Next.js dev server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run lint     # Run Next.js linting
```

Use `npm run build` before handing off larger changes because this app relies on strict TypeScript and client-only dynamic imports.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and the `@/*` import alias from `tsconfig.json`. Keep route files named `page.tsx` and component files in PascalCase, for example `DashboardView.tsx` or `FileUploadField.tsx`. UI primitives should follow existing shadcn patterns in `src/components/ui/`, using Radix wrappers, `cn()` from `@/lib/utils`, and Tailwind classes. Prefer design tokens from `src/app/globals.css` and `tailwind.config.ts` over hard-coded colors. Custom UI currently uses `@phosphor-icons/react`; reserve `lucide-react` for shadcn primitives.

## Testing Guidelines

No automated test suite is configured yet. For changes, run `npm run lint` and `npm run build`, then manually verify the affected routes in the browser. For UI work, check both light and dark themes, responsive layouts, and key flows such as login gating, KYC steps, dashboard tabs, and sheets/dialogs. If tests are added later, colocate them near the feature or place them under a clear `tests/` directory with names like `ComponentName.test.tsx`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, sentence-case messages such as `Add Settings page...`, `Refactor Smart Insights panel...`, and `Update CLAUDE.md...`. Follow that style and keep each commit focused. Pull requests should include a concise summary, affected routes/components, validation steps run, linked issues when applicable, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

This prototype has no backend; auth and progress flags are stored in `localStorage`. Do not commit real API keys, credentials, customer data, or production secrets. Treat mocked onboarding and insights data as UI-only placeholders unless a backend integration is explicitly added.
