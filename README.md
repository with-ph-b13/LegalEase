# LegalEase ⚖️

LegalEase is a premium, modern legal consultation marketplace connecting clients with top-tier legal experts. Clients can browse lawyer profiles, request consultations, manage their hiring history, make secure payments using Stripe, and leave ratings/reviews. Lawyers can manage their profiles, toggle availability/publish status, and track their billing history.

## Live URL
🔗 **[LegalEase Platform (Placeholder)](https://legalease-marketplace.vercel.app)**

---

## 🌟 Key Features

### 👤 User Roles & Dashboard Shells
- **Client (User):** Request consultations, pay hiring fees securely, track hire requests, and review lawyers.
- **Lawyer:** Customize legal profile, publish/unpublish, accept/reject consultations, and track revenue.
- **Admin:** Promote users, moderate profiles (publish/unpublish/delete), monitor platform-wide transactions, and view interactive charts/KPIs.

### 💳 Stripe Payments Infrastructure
- **Pay to Publish:** Lawyers pay a one-time publishing fee of $99 to activate their profile publicly.
- **Hiring Fee:** Clients make secure payments to confirm booking consultations.
- **Financial Auditability:** Secure Stripe webhook signature validation with demo fallback. Fully logged transactions.

### ⚙️ Polish & Security
- **Shortlist:** Add profiles to shortlist with localized guest caching that syncs to database upon registration.
- **Dark Mode:** Global DaisyUI 5 state manager with OS preference detection and persistent toggle.
- **Email Notifications:** Logged in `backend/logs/emails.log` upon signup, payment completion, hiring request updates, or new reviews.
- **Auto-Unpublish:** Profiles automatically unpublish if active cases reach `UNPUBLISH_THRESHOLD` (default 10).
- **Rate Limiting:** IP limits for Authentication (100 reqs/15m) and Payments (30 reqs/m) via `express-rate-limit`.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), Tailwind CSS (v4), DaisyUI (v5), Lucide React, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js (Google OAuth), JWT, Stripe SDK, Zod, express-rate-limit
- **State Management:** React Context (Auth, Theme, Shortlist)

---

## 📦 Project Setup

### Prerequisites
- Node.js (v18+)
- pnpm (v11+)
- MongoDB running locally or a MongoDB Atlas URI

### Installation
1. Clone the repository and install dependencies in the root:
   ```bash
   pnpm install
   ```

2. Create environment configurations:
   - Backend env: `/backend/.env` (refer to `/backend/.env.example`)
   - Frontend env: `/.env.local`

3. Seed the database:
   ```bash
   pnpm --filter legalease-backend run seed
   ```

4. Start both servers concurrently:
   ```bash
   pnpm dev
   ```

---

## 🔑 Demo Accounts

To test the application, you can use the seeded demo accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@legalease.com` | `admin123` |
| **Lawyer** | `jane@smith.com` | `password123` |
| **Client** | `john@doe.com` | `password123` |

---

## 📜 Development Scripts

Run scripts from the workspace root using pnpm:

- `pnpm dev` — Start Next.js and backend concurrent servers
- `pnpm install` — Install all workspace dependencies
- `pnpm --filter legalease-backend run seed` — Seed the MongoDB database
- `pnpm --filter legalease-backend run build` — Build backend TypeScript source
