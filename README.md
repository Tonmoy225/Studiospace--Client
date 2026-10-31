# StudioSpace

**Live site:** https://your-studiospace.vercel.app  (replace with your link)
**Server repo:** https://github.com/your-username/studiospace-server

StudioSpace is a peer-to-peer marketplace where creators discover and book photo studios, film stages, podcast lounges, music suites and art workshops by the hour.

## Features
- Home with Swiper hero slider, 6 top-rated studios from MongoDB, category browsing, booking steps and host guarantee
- Explore page with live search, category filter, sorting, skeleton loaders and empty states
- Email/password and Google login with BetterAuth + MongoDB, password validation on register
- Private routes that survive page reload (no redirect to login when already logged in)
- Full studio CRUD (add, update, delete with confirm modal) with owner-only protection
- Booking system with status badges, cancel for pending bookings, host dashboard to confirm / complete
- JWT in HTTPOnly cookie (protected API returns 401), double-booking prevention, light/dark theme toggle

## Tech Stack
Next.js (App Router), Tailwind CSS, DaisyUI, Swiper, React Hot Toast, BetterAuth (MongoDB adapter), JWT, Express.js, MongoDB

## Run Locally
1. `git clone` this repo and run `npm install`
2. Copy `.env.example` to `.env.local` and fill all values
3. Start the server repo first (`npm run dev` on port 5000)
4. Run `npm run dev` and open http://localhost:3000

## Examiner Test Credentials
- Email: examiner@studiospace.com
- Password: Examiner123
(create this account on /register before submitting)
