# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript** (strict mode, path alias `@/*` → `src/*`)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — imported with `@import "tailwindcss"` in `globals.css`, no `tailwind.config` file
- **Geist** font family loaded via `next/font/google`

## Project structure

`src/app/` is the sole source directory. `layout.tsx` wraps every page with the Geist font variables and a full-height flex column body. Dark mode is handled through CSS `prefers-color-scheme` and Tailwind's `dark:` variants — there is no JS-based theme switcher.

The app is currently a blank-slate scaffold; `page.tsx` is the default Next.js welcome page and is meant to be replaced with the lifting diary feature work.
