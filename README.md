# VStore E-Commerce Admin

A full-stack admin dashboard for managing an e-commerce storefront, including products, orders, and payments.

**Live Demo:** [vstore-admin.vercel.app](https://vstore-admin.vercel.app)

> Academic project developed by a university student for learning and demonstration purposes.

---

## Description

VStore Admin is a multi-tenant store management dashboard built with Next.js. It allows store owners to manage their product catalog, track orders, configure billboards and categories, and monitor revenue via a built-in analytics dashboard. The system exposes a REST API consumed by a separate storefront application, and integrates VNPay for online payment processing.

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Radix UI, shadcn/ui
- Recharts (analytics charts), Framer Motion

**Backend**
- Next.js API Routes (REST)
- Prisma ORM
- Clerk (authentication & session management)

**Database**
- MongoDB

**Storage**
- Cloudinary (product image uploads)

**Payments**
- VNPay (Vietnamese online payment gateway)

---

## Features

- Multi-store support — each authenticated user can create and manage multiple independent stores
- Product management — create/edit products with multiple images, sizes, colors, stock tracking, and featured/archived flags
- Order management — view incoming orders, update order status (Pending → Confirmed → Shipping → Delivered / Cancelled)
- Billboard & category management — control storefront banners and product categorization
- VNPay payment integration — generate payment URLs and handle IPN (Instant Payment Notification) callbacks
- Revenue dashboard — total revenue, sales count, stock overview, and monthly revenue bar chart
- Dark / light theme toggle
- REST API — all store data is accessible via a versioned API for use by a companion storefront

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/pho-veteran/e-commerce-admin.git
cd e-commerce-admin

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in the values in .env (see Environment Variables section below)

# 4. Push the Prisma schema to MongoDB
npx prisma db push

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `DATABASE_URL` | MongoDB connection string |
| `CLOUDINARY_URL` | Cloudinary API URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `ADMIN_BASE_URL` | Base URL of this admin app (default: `http://localhost:3000`) |

---

## Project Structure

```
app/
  (auth)/          # Sign-in / sign-up pages (Clerk)
  (dashboard)/     # Protected store dashboard pages and API routes
  (root)/          # Root redirect logic (store selection / creation)
  api/             # REST API route handlers per store resource
actions/           # Server-side data-fetching helpers (revenue, stats)
components/        # Shared UI components and page-level components
  ui/              # Base design-system components (inputs, tables, modals…)
  modals/          # Global modal dialogs (store creation, confirmations)
hooks/             # Custom React hooks
lib/               # Prisma client, utility functions
model/             # VNPay model factory
prisma/
  schema.prisma    # MongoDB data models
providers/         # App-level context providers (theme, toasts, modals)
```

---

## Author

Developed by **pho-veteran** as part of a university software engineering course.  
GitHub: [github.com/pho-veteran](https://github.com/pho-veteran)
