# Energy Consumption Analytics System

Full-stack MERN application with role-based access control for managing and analyzing household or commercial energy consumption.

## Structure

- `API/` – Node.js + Express + MongoDB backend
- `Client/` – React.js frontend with Chart.js dashboards

## Backend (`API/`)

### Environment

Create `API/.env`:

```env
MONGO_URI=mongodb://localhost:27017/energy_analytics
JWT_SECRET=your_strong_secret_here
PORT=5000
```

### Install and run

```bash
cd "D:\Energy Consumption Analysis\Energy\API"
npm install
npm run dev
```

Key features:

- JWT authentication (`/api/auth/login`)
- Seed super admin (`POST /api/auth/seed-super-admin`)
- Role-based middleware (`super_admin`, `admin`, `user`)
- Admin/super admin consumption CRUD with automatic bill calculation
- Aggregations:
  - `/api/analytics/area-wise`
  - `/api/analytics/city-wise`
  - `/api/analytics/user-wise`
  - `/api/analytics/monthly-trends`
  - `/api/analytics/extremes`

## Frontend (`Client/`)

### Install and run

```bash
cd "D:\Energy Consumption Analysis\Energy\Client"
npm install
npm start
```

The dev server runs on port 3000 and proxies `/api` requests to `http://localhost:5000`.

Dashboards:

- Super Admin
  - Create `Admin` and `User` accounts
  - View area-wise, city-wise, user-wise consumption
  - Monthly trends and highest/lowest consumers
- Admin
  - Update monthly energy records for users
  - Auto-calculated bill amount based on units
  - View global monthly trends
- User
  - View own consumption history
  - Monthly trends and bill history

