# Grace Haven Backend (Express + MongoDB)

A standalone backend API for Grace Haven with JWT authentication, role-based access, and resources for products, bookings, and orders.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- bcrypt for password hashing

## Getting Started

1. Install dependencies:
```
cd backend
npm install
```

2. Create your environment file:
```
cp .env.example .env
```
Fill in `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`.

3. Run the server:
```
npm run dev
```
Server starts on `http://localhost:5000` by default.

## API Overview

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me  (Bearer token)

Products:
- GET  /api/products
- POST /api/products            (admin)
- PUT  /api/products/:id        (admin, owner)
- DELETE /api/products/:id      (admin, owner)

Bookings:
- POST /api/bookings            (user)
- GET  /api/bookings/mine       (user)
- GET  /api/bookings/for-my-products  (admin)
- PATCH /api/bookings/:id/status      (admin)

Orders:
- POST /api/orders              (user)
- GET  /api/orders/mine         (user)
- GET  /api/orders/for-my-products (admin)

## Notes
- Include `Authorization: Bearer <token>` for protected routes.
- Admin == tailor. Product.owner is set to the admin who created it.
- CORS is configured with `CLIENT_ORIGIN`.

## Deploying
- Recommended: Deploy to a Node host (Render, Railway, Fly.io, etc.). Set env vars there.
- Use MongoDB Atlas for a managed database.
