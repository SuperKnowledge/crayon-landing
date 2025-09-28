# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`. `app/layout.tsx` defines fonts/theme and wraps every page, while `app/page.tsx` renders the landing experience. Serverless handlers sit under `app/api`, e.g. `app/api/waitlist/route.ts` for signup submissions. Reusable interactive pieces belong in `components/` (client components flagged with `"use client"`). Global styles and Tailwind layers are in `app/globals.css`; static assets go in `public/`. Build tooling and linting live in `next.config.ts`, `tailwind.config.ts`, and `eslint.config.mjs`.

## Build, Test, and Development Commands
Run `npm install` once to pull dependencies. `npm run dev` starts the local server with Turbopack hot reload. `npm run build` produces an optimized production bundle, and `npm run start` serves that bundle for smoke testing. `npm run lint` must pass before opening a PR; it executes the ESLint configuration shared across the repo.

## Coding Style & Naming Conventions
Use TypeScript with React function components and hooks. Keep two-space indentation, and note that ESLint prefers double quotes unless interpolation requires otherwise. Favor PascalCase filenames for exported components (`components/CrayonScene.tsx`). Group Tailwind utility classes by layout → typography → effects to stay consistent with existing files. Prefer lightweight inline comments only for non-obvious math or animation tweaks.

## Testing Guidelines
There is no automated test harness yet, so scope changes carefully and document manual QA. When introducing logic beyond styling, add lightweight Jest or Testing Library coverage in a `__tests__/` folder and wire the command into `package.json`. At minimum, describe manual verification steps and validate that `npm run build` and waitlist API flows still succeed.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in history. Each PR should include: a concise summary, screenshots or recordings for UI changes, reproduction steps for bug fixes, and a checklist of commands run (`npm run lint`, builds, manual flows). Reference related issues and call out any environment or schema changes explicitly.

## Environment & Configuration Tips
The waitlist API expects `GOOGLE_SCRIPT_URL` in `.env.local`. Example:
```env
GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
```
Never commit secrets; add new config keys to `SETUP.md` with setup notes.
