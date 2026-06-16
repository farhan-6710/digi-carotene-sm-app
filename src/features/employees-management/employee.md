# Team Management — Supabase Setup

Run the migrations in Supabase before using the Employees Management page in the app.

---

## 1. Migration files

**New project** — run in Supabase → SQL Editor (once each, in order):

1. `scripts/employees-table.sql` — creates `public.employees`
2. `scripts/employee-assignments.sql` — creates `public.employee_assignments`

**Existing project** (already created `employees` / `employee_assignments`) — the app works as-is. Optionally run:

- `scripts/rename-employees-to-team-members.sql` once to rename tables and columns in place (the app detects either schema automatically).

---

## 2. `employees` field reference

| Column Name     | Type            | Nullable | Default              | Description                          |
|-----------------|-----------------|----------|----------------------|--------------------------------------|
| `id`            | uuid            | No       | `gen_random_uuid()`  | Primary key                          |
| `employee_name` | text            | No       | —                    | Full name (required)                 |
| `email`         | text            | No       | —                    | Work email (required, unique)        |
| `mobile_number` | text            | Yes      | —                    | Phone number (optional)              |
| `role`          | text            | No       | `'executive'`        | `executive`, `manager`, or `admin`   |
| `created_at`    | timestamptz     | No       | `now()`              | Record creation time                 |
| `updated_at`    | timestamptz     | No       | `now()`              | Last update (auto via trigger)       |

---

## 3. Roles

| DB value    | UI label  | Typical use                          |
|-------------|-----------|--------------------------------------|
| `executive` | Executive | Day-to-day team members              |
| `manager`   | Manager   | Team leads / account managers        |
| `admin`     | Admin     | Internal admins with elevated access |

---

## 4. App feature layout

```
src/features/employees-management/
  pages/EmployeesManagementPage.tsx
  pages/EmployeeDetailPage.tsx
  hooks/useEmployeesQuery.ts
  hooks/useEmployeeDialog.ts
  hooks/useEmployeesManagement.ts
  components/EmployeeDialog.tsx
  components/EmployeesTable.tsx
  utils/employeesRepository.ts
  types/types.ts
```

Route: `/admin/employees-management`  
Member detail: `/admin/employees-management/:employeeId`

---

## 5. Member ↔ client assignments

Run **`scripts/employee-assignments.sql`** after `employees` and `clients` tables exist.

**One table** — `employee_assignments`:

| Column       | Purpose                          |
|--------------|----------------------------------|
| `employee_id`| Which team member                |
| `client_id`  | Which client they work on        |
| `started_at` | When assignment started          |
| `ended_at`   | `NULL` = active, date = past     |

- **Active client** → row where `ended_at` is `NULL`
- **Past / history** → row where `ended_at` is set
- **Multiple active clients per member** → allowed (one row per client)
- **Same client twice while active** → not allowed (unique index)

Query from either side:

- Member → clients: `WHERE employee_id = ?`
- Client → members: `WHERE client_id = ? AND ended_at IS NULL`
