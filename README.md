# UNIZIK Sandwich Programme — Portal Frontend

Frontend for the Nnamdi Azikiwe University (UNIZIK), Awka **Sandwich Programme** portal and LMS front door: admission application, fee payment, session enrolment, results, and the student / teacher / admin dashboards.

Built with Next.js 15.5 (App Router), React 19, TypeScript and Tailwind CSS v4.

---

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on **port 3004** with Turbopack (`next dev -p 3004 --turbopack`), so open <http://localhost:3004>.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3004 (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint |

Type-check with `npx tsc --noEmit` — it is not part of `lint`.

---

## Environment

Create `.env.local` (and `.env.production` for deploys). Values are secrets — never commit these files.

```ini
NEXT_PUBLIC_BASE_URL_SANDWHICH=http://localhost:3004
NEXT_PUBLIC_API_URL_SANDWHICH=http://localhost:3004/api
NEXT_PUBLIC_REMOTE_API_URL_SANDWHICH=https://sandwich-api.qverselearning.org/api/v1

NEXT_PUBLIC_LMS_ROOT_URL_SANDWHICH=https://unizik-sandwich.qverselearning.org
NEXT_PUBLIC_LMS_LOGIN_URL_SANDWHICH=https://unizik-sandwich.qverselearning.org/login/index.php

NEXT_PUBLIC_SESSION_PASSWORD_SANDWHICH=…
NEXT_PUBLIC_SESSION_SECRET_SANDWHICH=…
NEXT_PUBLIC_ACCESS_TOKEN_SECRET_SANDWHICH=…
NEXT_PUBLIC_REFRESH_TOKEN_SECRET_SANDWHICH=…
NEXT_PUBLIC_CLIENT_ID_SANDWHICH=…
NEXT_PUBLIC_CLIENT_SECRET_SANDWHICH=…

NEXT_PUBLIC_IS_SANDWICH=true
```

> ⚠️ **`NEXT_PUBLIC_REMOTE_API_URL_SANDWHICH` must use `https://`.**
> The API 301-redirects `http://` to `https://`, and a **CORS preflight cannot follow a redirect**. With `http://` every cross-origin request fails silently — this presented as "programmes are not loading" and took a while to find. The env files are gitignored, so this also has to be set correctly in Vercel.

---

## Domain model

Three rules drive most of the UI. Get these wrong and the symptoms are subtle.

**Levels are years.** Programme titles carry the study year (`"YEAR ONE(DIRECT)"`, `"YEAR TWO Direct(Science Eduction)"`). UNIZIK expresses that as a level: Year One = 100, Year Two = 200, up to Year Six = 600.

**There are no semesters.** Any semester field, filter or column is legacy and should be removed, not populated.

**`academic_level` is the only field that moves.** When a student changes session the server bumps `academic_level` (100 → 200) but leaves `program` as the name they first enrolled under, forever. So a migrated student still reads `program: "YEAR ONE(DIRECT)"` while `academic_level: 200`.

Always resolve the level and year through [`src/lib/academics.utils.ts`](src/lib/academics.utils.ts), which encodes that precedence:

```ts
resolveStudentLevel(user) // "200 Level"
resolveStudyYear(user)    // 2
// precedence: academic_level → level (LMS short code) → program name
```

Two traps in that file:

- `parseStudyYear()` reads programme **titles** — every pattern needs the word "year" or "level", so `parseStudyYear(200)` returns `null`. For a bare `academic_level` use `yearFromAcademicLevel()` or `resolveStudyYear()`.
- Prefer the student's own `academic_session` over the programme-wide active session. Reading the active session first made migrated students show the wrong one.

---

## Fees and payments

**There is one fee.** It is the application fee, charged once per session. In year one it is called the *application fee*; from year two it is the *returning fee*. Amount: `APPLICATION_FEE` in [`src/config/constants.ts`](src/config/constants.ts).

Acceptance fee and tuition are **legacy** — see [Known debt](#known-debt).

### Is the fee owed?

[`useSessionFee()`](src/hooks/useSessionFee.ts) answers this, and the two cases need different evidence:

| Student | Evidence that it is paid |
|---|---|
| Year one | `application_payment_status === "FULLY_PAID"` |
| Year two+ | A **settled payment tagged to their current `academic_session`** |

`application_payment_status` **cannot** answer it for a returning student: it stays `FULLY_PAID` from the original application even after the student enrols into a new session. Treating it as evidence marks every migrated student as settled and hides the prompt. Absent a session-tagged payment the fee is treated as outstanding — unpaid is the correct default for a new obligation — and the notice says the inference was made rather than stating it flatly.

### Payment flows

Both end at a CredoCentral checkout URL taken from the response.

| | Year one | Year two+ |
|---|---|---|
| Initiate | `GET /application/retry-purchase` | `POST /account/pay-return-fee` |
| Body | — | `{ program_id, program_name, callback_url }` |
| Programme choice | Already chosen at signup | **Required first** |
| Surface | `ApplicationPaymentCard` on `/admission` | Fee notice on the dashboard, or `ReturningFeeCard` on `/admission` |
| Verify | `GET /application/verify-purchase?transRef=` | `GET /verify-return-fee-payment?transRef=` |

The returning fee is charged **against a programme**, so nothing offers to take payment until one is picked. The picker is [`ReturningFeeProgrammePicker`](src/components/payments/ReturningFeeProgrammePicker.tsx) — shared by the dashboard dialog and the admission card so the two cannot drift. It renders the same programme tree as the application step (`GET /odl/our-programs?parent_id=0`, a nested `{ id, name, children }` array) through the form-free accordion.

### Gateway callbacks

The gateway appends `?transRef=<ref>`.

| Fee | Callback route | Middleware |
|---|---|---|
| Application (new student) | `/admission/payments/verify-admission` | public |
| **Returning** | `/admission/payments/verify-return-fee` | protected |
| Acceptance *(legacy)* | `/admission/payments/verify-acceptance` | protected |
| Tuition *(legacy)* | `/admission/payments/verify-tuition` | protected |

Prefix with `NEXT_PUBLIC_BASE_URL_SANDWHICH`. The returning-fee callback is sent to the API as `callback_url` in the request body, so it follows the environment instead of being hardcoded server-side.

The returning-fee callback is **auth-protected**, unlike the new-student one — only a signed-in student pays it. A browser redirect carries the session cookie and works; a server-side webhook GET would get a `307`.

> On a successful verify, invalidate the `student-payment-history` query. The fee notice reads it, and without that it keeps showing a just-paid fee as outstanding.

---

## Session enrolment

A student moves themselves into a new session from the dashboard: `POST /account/upgrade-session { session_id }`. Enrolling is only half of it — the returning fee for the new session is owed immediately, so the flow continues straight into programme choice and payment rather than leaving the student to find it.

Admins manage sessions from **Session migrations**:

| Action | Endpoint |
|---|---|
| List | `GET /admin/all-sessions` |
| Create | `POST /admin/add-session` `{ name: "2026/2027" }` |
| Activate | `PATCH /admin/modify-session` `{ id }` — the updated session becomes active |

---

## Design system

Brand colours are sampled from the UNIZIK crest: **ocean** (blue) and **ember** (orange), each a `50`–`950` ramp in oklch, defined in [`src/app/globals.css`](src/app/globals.css). Typeface is **Outfit** via `next/font/google`. Dark mode is `next-themes`.

Use the tokens (`ocean-600`, `ember-500`, `bg-card`, `text-muted-foreground`), never hardcoded greys or blues — hardcoded colours are the usual cause of text that vanishes in dark mode.

Helper utilities in `globals.css`: `.shell`, `.lift`, `.crest-surface`, `.ember-surface`, `.ring-gradient`, `.glass-light`, `.bg-grid`, `.reveal`.

Two gotchas:

- **[`src/app/themes/theme-default.css`](src/app/themes/theme-default.css) is imported last** and has an unscoped `:root`, so it overrides `globals.css`. Tokens added to `globals.css` can be silently clobbered there.
- **Keep the ramps complete.** `ember` stopped at `900` while `ocean` ran to `950`, so `dark:bg-ember-950/30` generated *no CSS at all* — the surface stayed light while light-coloured text was painted on it. A missing ramp step fails silently; check the token exists before using it.

### Icons

**HugeIcons only** — not Lucide — and always through the wrapper:

```tsx
import { Icon } from "@/components/ui/icon";
import { PieChartIcon } from "@hugeicons/core-free-icons";

<Icon icon={PieChartIcon} className="size-5" />
```

`lucide-react` is still a dependency and remains in some shadcn primitives; see [Known debt](#known-debt).

---

## Conventions

**Auth is a custom JWT cookie, not NextAuth.** [`src/lib/session.ts`](src/lib/session.ts) signs and verifies it with `jose`; `src/auth.ts` is entirely commented out and `src/hooks/useAuth.ts` is dead code. `next-auth` survives only as a module augmentation for the `UserInterface` type. Read the session through `useAuth()` from [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx), which refreshes from `GET /application/profile` via `/api/user`.

**Unwrap API responses defensively.** Endpoints return a bare array, `{ data: [...] }`, or a Laravel paginator (`{ data: { data: [...], total } }`) depending on the route. Use `extractRows` / `extractTotal` from [`src/lib/admin.analytics.ts`](src/lib/admin.analytics.ts). `rows ?? []` is **not** a guard — it passes a paginator object straight through and `.map` throws, or `.length` quietly yields `undefined`.

**Student data belongs to student-scoped routes.** `/application/profile`, `/account/result/get-user-result` and `/account/user-payment-history` take no identifier and read the bearer token. Avoid `/admin/*` routes with a client-supplied email for a student's own data — `/admin/course/grading?student_email=` is a potential IDOR.

---

## Project structure

```
src/
  app/
    (root)/              marketing site
    (authentication)/    sign in, sign up, forgot password
    (application)/       admission, application form, payment callbacks
    (dashboard)/         student, teacher, admin dashboards
    actions/             server actions, grouped by area
    api/                 route handlers (session, user)
  components/
    ui/                  shadcn primitives + Icon wrapper
    payments/            shared payment flows
    forms/               form fields, programme accordion
  config/                constants, types, nav config
  contexts/              Auth, StudentStatus, Toast, …
  hooks/                 data-fetching and view-model hooks
  lib/                   session, academics, analytics, utils
  middleware.ts          route protection
```

---

## Known debt

- **Acceptance fee and tuition are legacy** but still referenced across many files, and their pages under `dashboard/student/history/student-payments/{acceptance,tuition}` remain reachable by URL, along with the `/application/acceptance-fee-payment` and `/application/tuition-fee-payment` actions. Only the application / returning fee is charged.
- **`lucide-react` is still used** by several shadcn primitives (`dialog`, `dropdown-menu`, `checkbox`, `accordion`, `breadcrumb`, `calendar`, …). The sidebar, nav and `select` are converted; the rest are not.
- **Hardcoded session**: `getAdmittedApplicants` pins `academicSession=2024/2025` in its query string ([`src/app/actions/applications.ts`](src/app/actions/applications.ts)), so it will show stale students once the session rolls over.
- **`dashboard/admin/profile/page.tsx` is a stub.**
- **Teacher dashboard and parts of the admission flow** are still on the old styling and Lucide.
- **No student-scoped enrolled-courses endpoint** is confirmed; the current call goes through `/admin/course/grading?student_email=`.

---

## 🧑‍💻 Developer Workflow

### 1. Pull the latest `develop`

```bash
git checkout develop
git pull origin develop
```

### 2. Create a feature branch

```bash
git checkout -b feature/add-student-profile
```

### 3. Commit as you go

```bash
git add .
git commit -m "feat: add student profile form"
```

### 4. Push

```bash
git push -u origin feature/add-student-profile
```

### 5. Open a Pull Request

- Create the PR **from your feature branch into `develop`**
- Add a clear title and description, and request a review

Make sure the **base** branch is `develop` and **compare** is `feature/your-feature-name`.

### 6. Merge into `develop`

Once reviewed and approved. Only admins merge `develop` into `main`.

---

## 🔁 Branching Strategy

| Branch | Purpose | Who can push |
|---|---|---|
| `main` | Production-ready code | ✅ Admin only |
| `develop` | Active development integration branch | ✅ All developers |
| `feature/*` | Individual features or fixes | ✅ Creator only |

### Branch protection

| Branch | Protected | PR required | Direct push blocked | Merge restricted |
|---|---|---|---|---|
| `main` | ✅ | ✅ | ✅ | ✅ Admin only |
| `develop` | ✅ | ✅ | ✅ | ❌ Open to devs |

### Naming

- **Feature**: `feature/add-login-form`
- **Bugfix**: `bugfix/fix-header-alignment`
- **Hotfix**: `hotfix/reset-password-issue`

### Commit messages

- `feat: add student enrollment form`
- `fix: correct grade calculation bug`
- `chore: update dependencies`

---

## 📦 Tech Stack

- **Framework**: Next.js 15.5 (App Router), React 19
- **Language**: TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui, HugeIcons
- **Data**: TanStack Query v5, Next.js server actions
- **Forms**: React Hook Form + Zod
- **Auth**: custom JWT session cookie (`jose`) — *not* NextAuth
- **Charts**: Recharts
- **Theming**: next-themes
- **Toasts**: Sonner

---

## 📬 Need help?

Open an [issue](https://github.com/Kingsintersect/sandwich-interface/issues).
