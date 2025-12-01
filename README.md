# Fluxo | Intelligent Field Service Management

**Fluxo** is a modern Field Service Management (FSM) SaaS designed to streamline operations between back-office dispatchers and field technicians. It features dynamic form generation based on service types, role-based dashboards, and real-time state management.

## ⚡ Quick Access (Demo Credentials)

You can access the live demo using the "Quick Access" buttons on the login screen or manually using these credentials:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Dispatcher** | `demo.admin@fluxo.com` | `fluxo123` | Create Orders, Assign Tasks, Global Dashboard |
| **Technician** | `demo.tech@fluxo.com` | `fluxo123` | Execute Orders, Dynamic Forms, Mobile View |

## 🏗 Architecture & Tech Stack

This project follows a **Feature-Based Architecture** to ensure scalability and maintainability, mimicking production-ready standards found in enterprise solutions like Pilot Solutions.

* **Core:** React 19 + TypeScript + Vite.
* **State Management:** Zustand (Global Auth & UI state).
* **UI Framework:** Material UI (v6) with a custom "Split Screen" auth layout.
* **Forms:** `react-jsonschema-form` (RJSF) for rendering dynamic workflows based on DB schemas.
* **Backend:** Supabase (PostgreSQL) with Row Level Security (RLS).
* **Testing:** Vitest + React Testing Library (Planned).

## 🚀 Key Features

### 1. Role-Based Access Control (RBAC)
* **Dispatchers** see a comprehensive table of all operations.
* **Technicians** see a focused, mobile-first card view of their assigned tasks.
* Security is enforced both at the UI level (Protected Routes) and Database level (RLS Policies).

### 2. Dynamic Workflow Engine
Work orders are not static. Fluxo uses JSON Schema stored in PostgreSQL to generate specific forms for different job types (e.g., Fiber Installation vs. HVAC Maintenance) without changing frontend code.

### 3. Professional Authentication Flow
* Custom Split-Screen Login/Register UI.
* Automatic Profile creation via Database Triggers.
* Meta-data handling (First Name/Last Name) during registration.

## 📂 Project Structure

```text
src/
├── features/           # Domain-driven features
│   ├── auth/           # Login, Register, Demo Logic
│   ├── dashboard/      # Role-specific views
│   └── work-orders/    # Order management logic
├── store/              # Global State (Zustand)
├── lib/                # Third-party config (Supabase)
├── routes/             # Navigation & Protected Routes
└── types/              # TypeScript Interfaces (DB generated)
```

## 🛠️ Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/lautarocristiani/fluxo.git
cd fluxo
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure Environment Variables**

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**4. Database Setup**

Run the SQL script located in db/schema.sql in your Supabase SQL Editor to create tables, triggers, and seed data.

**5. Run the app**

```bash
npm run dev
```