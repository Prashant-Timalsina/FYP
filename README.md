# Timber Craft

A full-stack furniture e-commerce platform and custom carpentry service management system. Developed as a Final Year Project (FYP) at Herald College, Kathmandu.

## Project Overview

**Timber Craft** bridges the gap between traditional carpentry and modern e-commerce. It allows users to not only purchase ready-made furniture but also request bespoke pieces tailored to specific requirements. This project was presented in its current state for the official viva and project showcase, representing the culmination of two semesters of development.

---

## Key Features

### User Experience
- **Furniture Marketplace:** Browse, filter, and purchase a diverse range of furniture products.
- **Custom Carpentry Requests:** A dedicated interface for customers to submit specifications for bespoke designs.
- **Order Tracking:** Real-time status updates and comprehensive transaction management.
- **Responsive UI:** Fully optimized for mobile, tablet, and desktop viewing.

### Admin & Operations
- **Multi-Role System:** Distinct workflows for Customers, Sellers, and Administrators.
- **Service Integration:** Backend logic to connect customers with skilled craftsmen.
- **Secure Payments:** Integrated with local payment gateways (eSewa, Khalti) for the Nepali market.
- **Media Management:** Automated image handling via Cloudinary.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Storage** | Cloudinary |
| **Payment** | eSewa, Khalti |
| **Testing** | Postman |

---

## Architecture & Environment Setup

### 1. Installation
```bash
# Clone the repository
git clone [https://github.com/Prashant-Timalsina/FYP.git](https://github.com/Prashant-Timalsina/FYP.git)
cd FYP

# Install dependencies (ensure you run this in both /backend and /frontend if separated)
npm install
```

### 2. Configuration

Create a `.env` file in the respective directories based on the requirements below:

#### Backend (`/backend/.env`)
```env
MONGODB_URI = your_mongodb_uri
CLOUDINARY_API_KEY = your_key
CLOUDINARY_SECRET_KEY = your_secret
CLOUDINARY_NAME = your_cloud_name

ADMIN_EMAIL = "admin@timber.com"
ADMIN_PASSWORD = "your_secure_password"

JWT_SECRET = your_jwt_token
EMAIL_USER = your_smtp_user
EMAIL_PASS = your_smtp_password

FRONTEND_URL = http://localhost:5173
```

#### Frontend (`/frontend/.env`)

```env
VITE_BACKEND_URL = http://localhost:4000
FRONTEND_URL = http://localhost:5173
REACT_APP_ESEWA_PAYMENT_URL = [https://rc-epay.esewa.com.np/api/epay/main](https://rc-epay.esewa.com.np/api/epay/main)
```

### 3. Execution

```bash
# Start the backend server
npm run server

# Start the frontend development environment
npm run dev
```
---

## Development Context

* **Institution:** Herald College, Kathmandu
* **Timeline:** Developed over two academic semesters.
* **Status:** Finalized and hosted. This repository reflects the version verified during the official academic viva.

---

**Developed by [Prashant-Timalsina](https://github.com/Prashant-Timalsina)**
