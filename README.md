# Saksham Raj — Data Analyst & Business Intelligence Portfolio

A production-ready, security-hardened, 3D animated portfolio web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js), **TypeScript**, **Three.js** via React Three Fiber, and **Tailwind CSS**.

![Portfolio Preview](./client/public/profile.jpg)

---

## 🌟 Executive Summary

- **Owner**: Saksham Raj
- **Title**: Data Analyst | Business Intelligence
- **Tagline**: Turning raw data into decisions
- **Contact**: [rajsaksham744@gmail.com](mailto:rajsaksham744@gmail.com) | [+91 9625631438](tel:+919625631438)
- **Profiles**: [LinkedIn](https://www.linkedin.com/in/sakshamraj294) | [GitHub](https://github.com/skshambytes) | [Instagram](https://www.instagram.com/saksham294_/?hl=en)
- **Education**: Bachelor of Computer Applications (BCA), IGNOU (Expected 2026) | Class XII CBSE (82%, 2023)
- **Key Awards**: MS Excel 1st Rank (IICS) 🏆 | HTML 1st Rank (IICS) 🏆 | MS Word 2nd Rank (IICS) 🥈

---

## 🏗️ Architecture & Monorepo Structure

```
├── .github/
│   ├── dependabot.yml           # Automated weekly security updates
│   └── workflows/ci.yml         # CI workflow for typecheck, audit & security tests
├── client/                      # Frontend Application
│   ├── public/
│   │   ├── profile.jpg          # Authentic photo of Saksham Raj
│   │   ├── resume.pdf           # Saksham Raj's CV for download
│   │   ├── favicon.svg          # Modern analytical brand favicon
│   │   ├── robots.txt           # Search crawler instructions
│   │   └── sitemap.xml          # XML Sitemap
│   ├── src/
│   │   ├── components/          # 3D Hero, Tilt Cards, CountUp stats, Skills, ContactForm
│   │   ├── pages/               # Home, PrivacyPolicy, NotFound
│   │   ├── types/               # TypeScript definitions
│   │   └── index.css            # Dark mode glassmorphism styles & Tailwind CSS
│   ├── .env.example             # Frontend environment documentation
│   ├── vite.config.ts           # Production rollup chunking & dev proxy
│   └── tailwind.config.js       # Dark palette with single cyan accent
├── server/                      # Backend API Service
│   ├── src/
│   │   ├── config/              # Environment variable management
│   │   ├── db/                  # MongoDB connection & reconnect resilience
│   │   ├── middleware/          # Rate limiting, central error handling
│   │   ├── models/              # Mongoose Contact model with 90-day TTL index
│   │   ├── routes/              # /api/health, /api/projects, /api/contact
│   │   ├── services/            # GitHub caching service, Nodemailer email dispatcher
│   │   └── utils/               # HMAC IP hashing, CRLF/HTML sanitizer, Turnstile verifier
│   ├── test/
│   │   └── security-test.ts     # Automated 11-point security verification suite
│   ├── .env.example             # Server environment documentation
│   └── Dockerfile               # Multi-stage production container build
├── render.yaml                  # Render deployment blueprint
├── vercel.json                  # Vercel SPA routing & strict HTTP security headers
├── netlify.toml                 # Netlify fallback deployment configuration
└── README.md                    # Project documentation & setup guides
```

---

## 🛡️ Security Implementations

| Security Control | Implementation Details | Status |
| :--- | :--- | :---: |
| **NoSQL Injection Prevention** | `express-mongo-sanitize` strips `$` and `.` operators; strict Zod schema validation ensures only plain strings are accepted. | **PASS** |
| **Email Header Injection (CRLF)** | Form routes reject any `\r` or `\n` carriage returns in single-line headers (`name`, `email`, `subject`). | **PASS** |
| **IP Privacy & Anonymization** | Client IP addresses are never saved in plaintext; stored only as an HMAC-SHA256 hash using a 32+ character `IP_HASH_SALT`. | **PASS** |
| **Automatic 90-Day Data Erasure** | MongoDB TTL index (`expireAfterSeconds: 7776000`) automatically purges contact records 90 days post-submission. | **PASS** |
| **Bot & Abuse Protection** | Hidden honeypot field, sub-1.5s submission speed detector, and Cloudflare Turnstile verification. | **PASS** |
| **Rate Limiting** | 100 req/15 min globally and 5 submissions/hr per IP and email address with generic HTTP 429 responses. | **PASS** |
| **Strict Security Headers** | Helmet sets strict Content-Security-Policy, HSTS with preload, `nosniff`, `frame-ancestors 'none'`, and COOP. | **PASS** |
| **SSRF Protection** | GitHub fetcher strictly calls allowlisted hosts (`api.github.com`, `raw.githubusercontent.com`) with size limits & timeouts. | **PASS** |
| **Bundle Privacy** | Client bundle built with zero environment secrets or credentials. | **PASS** |
| **Vulnerability Audit** | Zero high or critical vulnerabilities in both client and server lockfiles (`found 0 vulnerabilities`). | **PASS** |

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: MongoDB Atlas Database Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free-tier M0 cluster.
2. Under **Database Access**, create a dedicated database user (e.g. `saksham_app`) with **Least Privilege** (`readWrite` role scoped only to the `portfolio` database).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so that your serverless/cloud backend (Render or Railway) can connect.
4. Copy your MongoDB connection string:
   ```
   mongodb+srv://saksham_app:<PASSWORD>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 2: Email Setup (SMTP or Gmail App Password)
1. In your Google Account (`rajsaksham744@gmail.com`), enable **2-Step Verification**.
2. Go to **Security → App Passwords**.
3. Generate a new app password named `Portfolio Website`.
4. Copy the 16-character password to use as `SMTP_PASS`.

### Step 3: Cloudflare Turnstile Bot Protection
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Turnstile**.
2. Click **Add Site**.
   - Site name: `Saksham Raj Portfolio`
   - Domain: your domain (or `localhost` for testing)
   - Widget mode: **Managed**
3. Copy the **Site Key** (public, goes to `client/.env` as `VITE_TURNSTILE_SITE_KEY`).
4. Copy the **Secret Key** (private, goes to `server/.env` as `TURNSTILE_SECRET_KEY`).

### Step 4: Backend Deployment (Render or Railway)
#### Option A: Render
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New + → Web Service**.
3. Connect your GitHub repository:
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
4. Set the Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `<Your MongoDB Connection URI>`
   - `CLIENT_ORIGIN`: `https://your-frontend-site.vercel.app`
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: `rajsaksham744@gmail.com`
   - `SMTP_PASS`: `<Your 16-char App Password>`
   - `CONTACT_TO_EMAIL`: `rajsaksham744@gmail.com`
   - `CONTACT_FROM_EMAIL`: `"Saksham Raj Portfolio" <rajsaksham744@gmail.com>`
   - `TURNSTILE_SECRET_KEY`: `<Your Cloudflare Secret Key>`
   - `IP_HASH_SALT`: `<Generate a random 32+ character string>`
   - `GITHUB_TOKEN`: `<Optional GitHub personal access token>`
5. Click **Create Web Service**. Your backend URL will be: `https://saksham-portfolio-api.onrender.com`.

### Step 5: Frontend Deployment (Vercel or Netlify)
#### Option A: Vercel
1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New → Project**.
2. Import your GitHub repository:
   - Framework Preset: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://saksham-portfolio-api.onrender.com`
   - `VITE_TURNSTILE_SITE_KEY`: `<Your Cloudflare Public Site Key>`
4. Click **Deploy**. Vercel will build and provide your live HTTPS URL.
5. In your Render backend settings, ensure `CLIENT_ORIGIN` matches your new Vercel domain!

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/skshambytes/Portfolio.git
cd Portfolio

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in both folders:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Run Development Servers
In separate terminals:
```bash
# Terminal 1: Backend API (runs on port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (runs on port 5173 with Vite proxy)
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Verification & Security Testing

Run the automated backend security verification test suite anytime:
```bash
cd server
npm run test:security
```

Expected output:
```text
=============================================
  RUNNING SAKSHAM RAJ PORTFOLIO SECURITY SUITE
=============================================

✅ PASS | 1. Empty payload rejected (HTTP 400)
✅ PASS | 2. Oversized field rejected (Zod bounds) (HTTP 400)
✅ PASS | 3. NoSQL operator injection rejected (HTTP 400)
✅ PASS | 4. CRLF / Email header injection rejected (HTTP 400)
✅ PASS | 5. Honeypot traps spambots silently (HTTP 200)
✅ PASS | 6. Sub-second bot submissions blocked (HTTP 400)
✅ PASS | 7. IP Rate Limiting triggers on 5+ submissions (HTTP 429)
✅ PASS | 8. Legitimate submission accepted & processed (HTTP 200)
✅ PASS | 9. Health check returns 200 OK (HTTP 200)
✅ PASS | 10. Projects API returns curated data (HTTP 200)
✅ PASS | 11. Security headers verified (nosniff, strict CSP, no x-powered-by) (HTTP 200)

🎉 ALL SECURITY AND API TESTS PASSED SUCCESSFULLY!
```

---

## 📄 License
Created for Saksham Raj. All rights reserved. Code licensed under MIT.
