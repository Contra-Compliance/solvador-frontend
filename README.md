# Solvador — UI Preview

A polished React dashboard interface for exploring settlement activity, workspace metrics, project keys, webhooks, and plan screens.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- shadcn/ui primitives
- React Router
- Lucide icons

## Setup

```bash
npm install
npm run dev
```

The development server opens the interface at `http://localhost:5173`.

## Scripts

```bash
npm run dev      # start the development server
npm run build    # type-check and build the production bundle
npm run preview  # serve the production build locally
npm run lint     # run ESLint
```

## Routes

The dashboard is available at `/`. The navigation also supports `/metrics`, `/settlements`, `/confidential`, `/keys`, `/webhooks`, and `/plans`.

The interface is populated with local preview data so every screen can be explored without configuration. Buttons and controls demonstrate the intended interaction patterns while keeping the project lightweight and self-contained.
