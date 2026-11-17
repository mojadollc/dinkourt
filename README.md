# Dinkourt

Nationwide pickleball court marketplace and venue management SaaS — Philippines.

## Stack

- **Monorepo**: Turborepo + npm workspaces
- **Web**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Mobile**: Expo (React Native) + Expo Router
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth (web) + JWT (mobile)
- **Payments**: PayMongo webhooks
- **Shared**: `@dinkourt/shared` — fee calculation, types

## Structure

```
dinkourt/
├── apps/
│   ├── web/          # Next.js — Admin + Owner dashboards + API
│   └── mobile/       # Expo — Player marketplace app
└── packages/
    ├── db/           # Prisma schema + client
    └── shared/       # Shared types + fee calculator
```

## Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full platform control, owner approval, fee config, analytics |
| `OWNER` | Venue management, courts, bookings, memberships, tournaments |
| `STAFF` | Venue operations (scoped permissions) |
| `PLAYER` | Mobile app — discover, book, join memberships & tournaments |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp apps/web/.env.example apps/web/.env
# Edit DATABASE_URL, NEXTAUTH_SECRET, PAYMONGO keys
```

### 3. Database
```bash
npm run db:migrate    # Run migrations
npm run db:generate   # Generate Prisma client
cd packages/db && npx prisma db seed  # Seed demo data
```

### 4. Run
```bash
npm run dev           # Starts web (port 3000) + mobile (Expo)
```

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dinkourt.com | admin123! |
| Owner | owner@dinkourt.com | owner123! |
| Player | player@dinkourt.com | player123! |

## Booking Fee Engine

Configured per-venue by the admin. Supports:
- `NONE` — no fee
- `FIXED` — fixed ₱ amount per booking
- `PERCENTAGE` — % of booking amount
- `FIXED_PLUS_PERCENTAGE` — both combined

Fee can be charged to the **player** (added to total) or **venue** (deducted from settlement).
Each booking stores a `feeSnapshot` for immutable audit trail.

## SaaS Plans

| Plan | Monthly | Annual |
|------|---------|--------|
| Business | ₱1,699 | ₱16,990 |
