# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 playground project using:
- React 19.1.0
- TypeScript with strict mode enabled
- Tailwind CSS v4
- Turbopack for faster builds
- App Router architecture (`app/` directory)

## Package Manager

Use **pnpm** for all package operations (not npm/yarn).

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack at http://localhost:3000

# Build & Production
pnpm build            # Production build with Turbopack
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

## Architecture

- **App Router**: Uses Next.js App Router (`app/` directory structure)
- **TypeScript paths**: `@/*` maps to project root
- **Styling**: Tailwind CSS with PostCSS
- **Font**: Geist font family via `next/font`
