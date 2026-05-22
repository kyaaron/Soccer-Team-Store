# AI Agent Guidelines & System Architecture (`AGENTS.md`)

Welcome! This file provides instructions, conventions, and architectural guidelines for AI agents working on the **Soccer Team Store** codebase. 

The primary goal is to build an e-commerce website for a fictional soccer team that is **simple, highly understandable, and easy for a human developer to review.**

---

## 1. Core Philosophy & Code Style

As an agent, you must adhere to the following principles:

* **Keep It Simple & Understandable:** Do not introduce complex architectural abstractions (e.g., clean architecture, DDD, heavy custom frameworks) unless explicitly requested. Prefer readable, straightforward code.
* **Agent-Friendly (Agentic Commerce) Support:** The codebase and application should be explicitly designed to be agent-friendly. This means structured API responses, semantic HTML/accessibility attributes on the frontend, clear identifier usage (e.g., `id` or `data-testid` attributes), and simple programmatic access paths to make it easy for autonomous purchasing agents to discover, browse products, and checkout.
* **Minimize Dependencies:** Avoid installing external NPM packages unless they solve a core problem that is complex to build manually (e.g., payment integration, database drivers).
* **Incremental & Reviewable Changes:** 
  * Keep pull requests and changes small and focused on a single feature or fix.
  * Avoid editing unrelated files.
  * Use clear variable and function names so that comments are rarely needed, except to explain non-obvious business logic.
* **No Preemptive Optimization:** Build for current requirements. Do not write code for hypothetical future features.

---

## 2. Team Context & Identity

To align website branding, product data, copy, and visual styles, all agents must use the following team profile:
* **Team Name:** Acme FC
* **Nickname:** The Hammers
* **Established:** 1990
* **Colors:** Navy Blue and White (primary brand colors for UI components and headers)
* **Logo:** Pending design (skip/placeholder for now; do not create or reference a custom logo asset file. Do not use `<svg>` for this; instead use an HTML `<img>` element with `href="#"`)

---

## 3. Tech Stack

* **Frontend:** React (Vite-based SPA) with TailwindCSS
* **Backend:** ExpressJS (REST API)
* **Database & Auth:** Supabase (PostgreSQL with RLS)
* **Package Manager:** `pnpm` (configured as a workspace monorepo)

---

## 4. Recommended Project Structure

To maintain a clean separation of concerns, the repository is structured as a `pnpm` monorepo:

```text
Soccer-Team-Store/
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── components/       # Shared UI components (Button, Card, Navbar, etc.)
│   │   ├── context/          # React Context (AuthContext, CartContext)
│   │   ├── pages/            # Page components (Home, Products, ProductDetail, Cart, Checkout)
│   │   ├── services/         # API calls to backend & Supabase Client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/                  # ExpressJS Server
│   ├── src/
│   │   ├── config/           # Supabase client setup, env variables
│   │   ├── controllers/      # Route handlers (products, orders, users)
│   │   ├── middleware/       # Auth (Supabase JWT verification), error handlers
│   │   ├── routes/           # Express router definitions
│   │   └── index.js          # App entry point
│   └── package.json
├── supabase/                 # Database migrations and seed files
│   ├── migrations/           # SQL migration files
│   └── config.toml
├── pnpm-workspace.yaml       # Monorepo workspaces definition
├── pnpm-lock.yaml
└── AGENTS.md                 # This file
```

---

## 5. Database Schema (Supabase / PostgreSQL)

Use a simple schema design. The primary database tables are:

### `profiles` (managed via Supabase Auth triggers)
* `id` (uuid, primary key, references `auth.users.id`)
* `full_name` (text)
* `avatar_url` (text)
* `updated_at` (timestamp)

### `products`
* `id` (uuid, primary key)
* `name` (text, required)
* `description` (text)
* `price` (numeric, required)
* `image_url` (text)
* `category` (text) — e.g., "kits", "apparel", "accessories"
* `stock` (integer, default: 0)
* `created_at` (timestamp)

### `orders`
* `id` (uuid, primary key)
* `user_id` (uuid, references `profiles.id`, nullable for guest checkouts)
* `status` (text) — e.g., "pending", "paid", "shipped"
* `total_amount` (numeric)
* `shipping_address` (jsonb or text)
* `created_at` (timestamp)

### `order_items`
* `id` (uuid, primary key)
* `order_id` (uuid, references `orders.id` on delete cascade)
* `product_id` (uuid, references `products.id`)
* `quantity` (integer, required)
* `price` (numeric, required) — unit price at the time of purchase

> [!IMPORTANT]
> **Row Level Security (RLS)**: Always enable RLS on Supabase tables.
> * `products`: Public read access, admin-only write access.
> * `profiles`: Users can read/write only their own profile.
> * `orders` and `order_items`: Users can view their own orders; write operations are triggered by checkout flow or managed via a service role on the backend.

---

## 6. Development Guidelines & Workflow

### Frontend
1. **Styling:** Use TailwindCSS for utility-first responsive styling to keep layouts modern and consistent. Avoid using custom Vanilla CSS or other UI libraries unless necessary.
2. **State Management:** Use standard React `useState` and `useContext` (e.g., `CartContext`, `AuthContext`). Do not install Redux/Zustand unless the application scale grows to justify it.
3. **Data Fetching:** Use standard `fetch` or `axios` to communicate with the Express backend.
4. **Images & Logos:** For all images and logos on the site, use a placeholder image for now. Do not use `<svg>` for this; instead, use an HTML `<img>` element with `href="#"` (or `src="#"`).

### Backend
1. **API Design:** Use standard REST principles. Use clean JSON responses.
2. **Authentication:** Verify JWTs issued by Supabase Auth using a middleware.
3. **Database Client:** Use `@supabase/supabase-js` to query database tables.

### Workflow for Agents
* **Before editing a file:** Check if you need an implementation plan. If proposing changes that touch multiple components, create an `implementation_plan.md` in the artifacts directory.
* **Testing:** Ensure local verification scripts/commands work.
* **Code review prep:** Write a short `walkthrough.md` summarizing the changes, files modified, and verification results.
