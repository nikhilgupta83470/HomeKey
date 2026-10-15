# House Broker Website (Starter Project)

A responsive full-stack starter for a house broker:
- Admin-only property and landlord management
- Client registration / login and flat requirement form (Family, Student, Working professional, Bachelor, Couple, etc.)
- Property photos and listing details
- Client dashboard showing only public property information
- MongoDB storage
- Email notification on new client registration / requirement submission (notification only; sensitive form data stays in DB)
- Razorpay payment-order scaffold (test mode; keys required)

## Stack
- Client: React + Vite + Tailwind CSS
- Server: Node.js + Express + MongoDB + JWT
- Images: local uploads (use Cloudinary/S3 for production)
- Email: Nodemailer
- Payments: Razorpay order creation scaffold

## 1. Prerequisites
Install Node.js LTS and MongoDB (local MongoDB or MongoDB Atlas).

## 2. Configure backend
```bash
cd server
npm install
copy .env.example .env
```
Open `server/.env` and set `MONGO_URI`, `JWT_SECRET`, admin credentials, email credentials and Razorpay test keys.
Create your admin account through the seed script:
```bash
npm run seed:admin
npm run dev
```
The server runs at `http://localhost:5000`.

For Gmail SMTP, create a Google App Password (2-Step Verification must be enabled). Never use your normal Gmail password.
For Razorpay, create test keys in the Razorpay dashboard. Do not use live keys until testing and legal/business setup are complete.

## 3. Configure frontend
In a second terminal:
```bash
cd client
npm install
copy .env.example .env
npm run dev
```
Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Admin
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`, then run `npm run seed:admin`.
Login with those credentials. Change the password after first login. Admin can add properties and landlords and view client records.

## Important security/privacy notes
- The client form includes optional sensitive questions. Keep these optional, explain why you ask them, and obtain explicit consent before collecting them.
- The app sends an email alert, not the entire client record. Full personal details are available only after an authenticated admin logs in. Emailing full personal/legal details creates avoidable privacy risk.
- This is a development starter, not a production security audit. Before launch add HTTPS, rate limiting, CAPTCHA, secure file storage, audit logs, retention/deletion controls, and review applicable Indian privacy laws.
- The payment endpoint creates a Razorpay order only. Add server-side signature verification and a verified webhook before treating a payment as successful. Never trust a frontend success message alone.
- Uploaded images are stored locally in `server/uploads` for development. Use private/managed object storage for production.

## Modular file structure update

The original HomeKey UI and styling are preserved. Frontend page markup has been moved into separate files under `client/src/pages/`, and reusable UI elements are in `client/src/components/`. Shared requirement defaults are in `client/src/constants/emptyRequirement.js`. The existing `client/src/style.css` was kept unchanged to preserve the original colors, spacing, and visual design. Existing backend files and API behavior were retained to minimize functional changes.

Frontend pages:
- `HomePage.jsx`
- `AuthPage.jsx`
- `OverviewPage.jsx`
- `PropertiesPage.jsx`
- `LandlordsPage.jsx`
- `ClientsPage.jsx`
- `RequirementsPage.jsx`
- `PaymentPage.jsx`
- `ContactPage.jsx`

Reusable components:
- `Navbar.jsx`
- `Footer.jsx`
- `NoticeBanner.jsx`
- `Field.jsx`
