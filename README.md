## ShowPass: Ticket Booking, Wallet & Admin System

A high-performance Single Page Application (SPA) built with **React**, **Vite**, **styled-components**, **React Router v6**, and **Axios**. The frontend provides a seamless workflow for users to browse events, select seats on an interactive grid, hold temporary 5-minute seat reservations, and complete idempotent wallet payments. It also features a comprehensive Admin Dashboard for managing events, bulk seat creation, system-wide bookings, and transaction audit logs.

This repository serves as the frontend submission for the full-stack ticket booking assessment.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Setup & Local Development](#setup--local-development)
- [Pages & Routes Overview](#pages--routes-overview)
- [Feature Overview](#feature-overview)
  - [Authentication Flow](#authentication-flow)
  - [Wallet System](#wallet-system)
  - [Event Browsing & Interactive Seat Selection](#event-browsing--interactive-seat-selection)
  - [Reservation & Countdown Timer](#reservation--countdown-timer)
  - [Idempotent Payment Confirmation](#idempotent-payment-confirmation)
  - [User Booking Management](#user-booking-management)
  - [Admin Dashboard](#admin-dashboard)
- [Key Design Decisions](#key-design-decisions)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Folder Structure](#folder-structure)

---

## Live Demo

- **Live URL**: [https://showpass-three.vercel.app/](https://showpass-three.vercel.app/)

> **Note on Testing Roles**: Both standard user accounts and admin accounts access the application through the primary authentication system (`/login`). Upon login, the application inspects the signed JWT role claim (`USER` or `ADMIN`) and automatically routes administrators to `/admin/events` and regular users to `/events`. Attempting to access protected admin routes without an admin role will automatically redirect users to `/admin/login` (which routes back to the main login portal).

---

## Tech Stack

- **Core Library**: [React 18](https://react.dev/) (`^18.3.1`)
- **Build Tool**: [Vite](https://vitejs.dev/) (`^5.3.1`) with `@vitejs/plugin-react` (`^4.3.1`)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (`^6.24.0`)
- **HTTP Client**: [Axios](https://axios-http.com/) (`^1.7.0`)
- **Styling**: [styled-components](https://styled-components.com/) (`^6.4.4`)
- **State Management**: React Context API (`AuthContext`)

---

## Setup & Local Development

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd ticket-booking-frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-api-domain.com
```

> **IMPORTANT (Mixed Content Warning)**: If the frontend is deployed over HTTPS (such as on Vercel), `VITE_API_URL` **must** point to an `https://` backend URL. Modern web browsers block unencrypted HTTP requests from HTTPS pages as insecure mixed content.

### 3. Running Locally

Start the Vite development server:

```bash
npm run start:dev
```

The app will be accessible at `http://localhost:5173`.

### 4. Building for Production

To build the static production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### 5. Client-Side Routing Configuration (Vercel)

To support HTML5 client-side routing on Vercel (preventing 404 errors on browser refresh or deep links), the project includes a `vercel.json` file in the root directory:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Pages & Routes Overview

| Route                                  | Access Level      | Description                                                                                                          |
| :------------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------- |
| `/login`                               | Public            | Authentication page for existing Users and Admins.                                                                   |
| `/signup`                              | Public            | User registration page.                                                                                              |
| `/events`                              | User (Protected)  | Browse active events with dates, prices, and available seat metrics.                                                 |
| `/events/:id`                          | User (Protected)  | Event details & interactive seat grid for choosing available seats.                                                  |
| `/booking/confirm/:reservationGroupId` | User (Protected)  | Reservation checkout page with 5-minute countdown timer & idempotent wallet payment.                                 |
| `/wallet`                              | User (Protected)  | Wallet management: view balance, top-up funds, and view transaction history.                                         |
| `/bookings`                            | User (Protected)  | Personal booking history with status filters (`CONFIRMED` / `CANCELLED`) & refund/cancel action.                     |
| `/admin/events`                        | Admin (Protected) | Event management: create events, edit details, cancel events (with auto-refunds), & bulk seat creation.              |
| `/admin/events/:id/seats`              | Admin (Protected) | Visual seat map overview filtered by status (`AVAILABLE`, `RESERVED`, `BOOKED`).                                     |
| `/admin/bookings`                      | Admin (Protected) | System-wide booking dashboard with User ID, Event ID, and Status filters, plus manual cancellation & refund trigger. |
| `/admin/transactions`                  | Admin (Protected) | System-wide transaction audit log with User ID, Type, and Reason filters.                                            |
| `/` / `*`                              | Public / Redirect | Smart fallback route: redirects to `/login` if unauthenticated, `/admin/events` for Admins, and `/events` for Users. |

---

## Feature Overview

### Authentication Flow

- **Registration & Login**: Clean form interfaces connecting to backend endpoints.
- **JWT Storage**: JWT token and decoded user profile claims are stored in `localStorage`.
- **Axios Interceptors**: Automatically attaches `Bearer <token>` to outgoing HTTP requests and redirects to `/login` upon receiving `401 Unauthorized` responses.
- **Role Guards**: Route wrappers (`ProtectedRoute`, `AdminRoute`) enforce client-side navigation restrictions based on the user's role (`USER` vs `ADMIN`).

### Wallet System

- **Real-Time Balance Display**: View available wallet balance formatted in Indian Rupees (₹).
- **Idempotent Top-Up**: Users can credit funds to their wallet. Each top-up request generates a unique UUID (`crypto.randomUUID()`) sent via the `x-idempotency-key` header.
- **Transaction History**: Paginated record of all wallet activity showing transaction type (`CREDIT` / `DEBIT`), amount, reason (`TOPUP`, `BOOKING`, `REFUND`), balance after, and timestamps.

### Event Browsing & Interactive Seat Selection

- **Catalog**: Lists all active events with date formatting and price per seat.
- **Interactive Grid**: Visual representation of seats supporting states: `AVAILABLE`, `RESERVED`, and `BOOKED`.
- **Seat Multi-Selection**: Real-time selection toggles with dynamic total cost calculation.

### Reservation & Countdown Timer

- **Seat Hold**: Selecting seats and clicking "Reserve" calls the backend hold API, creating a temporary reservation group.
- **5-Minute Expiry**: The confirmation page calculates remaining seconds from `expiresAt` and renders a live 1-second interval countdown timer. Payment buttons are disabled if the reservation expires.

### Idempotent Payment Confirmation

- **Single-Key Lifecycle**: When entering the booking confirmation page, a UUID idempotency key is generated **once** on component mount (`useState(() => crypto.randomUUID())`).
- **Retry Safety**: If a payment attempt fails due to insufficient wallet balance (HTTP 402), the user can navigate to `/wallet`, add funds, and return to retry confirmation. Because the idempotency key remains stable in component state, re-submitting uses the exact same key, guaranteeing protection against double charges or duplicate bookings.

### User Booking Management

- **History & Filtering**: View all user bookings filtered by status (`CONFIRMED` or `CANCELLED`).
- **Self-Service Cancellation**: Users can cancel confirmed bookings, which releases seats and credits a full refund to their wallet.

### Admin Dashboard

- **Event Operations**: Create new events, update existing event metadata/prices, and cancel events (which automatically triggers system refunds for all confirmed bookings).
- **Bulk Seat Creation**: Generate seats in bulk specifying seat count and custom prefix (e.g., prefix `S` -> `S1` to `S10`).
- **Seat Map Inspection**: View event seat status distribution on a visual status grid.
- **Global Booking Dashboard**: Inspect all system bookings with User ID, Event ID, and Status filtering, along with admin booking cancellation and refund capability.
- **Transaction Audit Log**: Monitor system-wide wallet transactions with filtering by User ID, Transaction Type (`CREDIT`/`DEBIT`), and Reason (`TOPUP`, `BOOKING`, `REFUND`).

---

## Key Design Decisions

1. **Token & Auth Persistence in `localStorage`**  
   `localStorage` was chosen for persisting authentication tokens and user profile state. This ensures a persistent login session across page refreshes and browser reopens without unnecessary re-authentication calls.

2. **Component-State Preservation for Idempotency Keys**  
   The idempotency key for confirming a booking is initialized once per reservation attempt on component mount via `useState(() => crypto.randomUUID())`. By avoiding key regeneration during retries, any network failure or wallet top-up retry sends the identical key to the backend, enabling safe server-side idempotency handling.

3. **React Context API for Global Auth State**  
   Given the focused scope of authentication and user session management in the frontend, standard React Context (`AuthContext`) was selected over heavier state libraries like Redux or Zustand. This keeps the bundle lightweight and maintainable.

4. **Styled Components & Minimalist Design System**  
   The UI is styled using `styled-components` backed by a centralized theme system (`theme.js`). A clean, neutral visual palette (slate background, crisp 1px borders, strong typography contrast) was implemented deliberately—avoiding unnecessary visual clutter or heavy gradients—to prioritize transaction clarity, accessibility, and high performance.

---

## Assumptions

- **Currency Conversion**: Users enter monetary amounts in Rupees (₹). The frontend converts Rupees to paise (`amount * 100`) before dispatching payloads to the backend API, and converts backend values in paise back to Rupees (`paise / 100`) for display.
- **Simulated Payment Gateway**: All booking payments are processed internally via deductions from the user's wallet balance. No external third-party payment provider (e.g., Stripe, Razorpay) is involved.
- **Client-Side vs. Server-Side Security**: Client-side route guards utilize claims decoded from the stored JWT for navigation control. Definitive authorization and access control are strictly enforced by the backend server on every API endpoint.

---

## Known Limitations

- **Seat Details in Admin Overview**: The Admin Seat Overview page (`/admin/events/:id/seats`) displays individual seat statuses (`AVAILABLE`, `RESERVED`, `BOOKED`), but does not display user identity details for reserved/booked seats because seat objects returned by the backend API do not include reservation or user metadata.
- **Automated Test Suite**: No automated unit or end-to-end test suites (e.g., Vitest, React Testing Library, Cypress) are included in this frontend project. Manual verification was performed across all routes and API interaction flows.

---

## Folder Structure

```
ticket-booking-frontend/
├── .env                       # Environment configuration file
├── .env.example               # Template environment file
├── .gitignore                 # Git ignore configuration
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts
├── vercel.json                # Vercel SPA client-side rewrite rules
├── vite.config.js             # Vite configuration
└── src/
    ├── App.jsx                # Main Application component & routes definition
    ├── main.jsx               # Application entry point
    ├── api/                   # Base Axios instance & HTTP service helpers
    │   ├── axiosClient.js
    │   └── httpService.js
    ├── components/            # Shared UI elements & Layout components
    │   ├── ui.js
    │   └── layout/
    │       └── Navbar.jsx
    ├── context/               # Application React Contexts
    │   └── AuthContext.jsx
    ├── features/              # Feature-based modular architecture
    │   ├── admin/
    │   │   ├── api/
    │   │   │   ├── adminBookingsService.js
    │   │   │   ├── adminEventsService.js
    │   │   │   ├── adminSeatOverviewService.js
    │   │   │   └── adminTransactionsService.js
    │   │   └── pages/
    │   │       ├── AdminBookings.jsx
    │   │       ├── AdminEvents.jsx
    │   │       ├── AdminSeatOverview.jsx
    │   │       └── AdminTransactions.jsx
    │   ├── auth/
    │   │   ├── api/
    │   │   │   ├── loginService.js
    │   │   │   └── signupService.js
    │   │   └── pages/
    │   │       ├── Login.jsx
    │   │       └── Signup.jsx
    │   ├── bookings/
    │   │   ├── api/
    │   │   │   ├── bookingConfirmService.js
    │   │   │   └── bookingsService.js
    │   │   └── pages/
    │   │       ├── BookingConfirm.jsx
    │   │       └── Bookings.jsx
    │   ├── events/
    │   │   ├── api/
    │   │   │   ├── eventsService.js
    │   │   │   └── seatSelectionService.js
    │   │   └── pages/
    │   │       ├── Events.jsx
    │   │       └── SeatSelection.jsx
    │   └── wallet/
    │       ├── api/
    │       │   └── walletService.js
    │       └── pages/
    │           └── Wallet.jsx
    ├── routes/                # Route guard wrappers
    │   ├── AdminRoute.jsx
    │   └── ProtectedRoute.jsx
    └── styles/                # Global styles & Styled-Components theme
        ├── GlobalStyle.js
        └── theme.js
```
