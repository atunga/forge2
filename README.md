# Forge

A unified workspace for industrial vending inventory and ERP operations. Includes customer inventory, reorder workflows, min/max recommendations, vending and ERP simulators, and a machine library with AutoCrib and CribMaster icons.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Demo mode includes sample customers, stations, inventory, and recommendations. Demo changes are stored in memory and reset when the server restarts.

## Use PostgreSQL

Set `DEMO_MODE=false` and `DATABASE_URL` in `.env.local`. Prisma CLI and the seed script load `.env`, so provide the same database URL in `.env` or your shell environment.

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

The seed script clears existing database records before loading sample data. Use it with a development database.

## Stack and design

Next.js 16, React 19, TypeScript, Tailwind CSS, tRPC, and Prisma. The interface uses Sansita and DM Sans with a Raizorcrest-inspired charcoal, cream, orange, and sage palette. Machine illustrations use red and black for AutoCrib and yellow and black for CribMaster; they depict machine families rather than exact product renderings.

```bash
npm run build
npm run lint
```
