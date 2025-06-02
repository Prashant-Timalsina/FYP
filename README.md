# Timber Craft

**Furniture E-Commerce with Custom Carpentry Services**

---

## Overview

**Timber Craft** is a full-fledged furniture e-commerce platform developed as my Final Year Project (FYP) at Herald College, Kathmandu. Over the course of my last two semesters, I dedicated extensive effort to designing and building this platform, which uniquely combines online furniture sales with custom carpentry services and personalized ordering options.

This project was presented exactly as it is during the viva and project showcase, without any post-presentation modifications or tinkering. It is now fully deployed and hosted for real-world use.

---

## Features

- **E-Commerce Furniture Store:** Browse and purchase a wide variety of furniture products.
- **Custom Ordering:** Customers can request custom furniture tailored to their specifications, bridging the gap between traditional carpentry and modern e-commerce.
- **Carpentry Service Integration:** Directly connect with skilled carpenters for bespoke design and craftsmanship.
- **User Roles:** Includes different user roles such as customers, sellers, and administrators for smooth platform management.
- **Order Tracking & Management:** Seamlessly track order status and manage transactions.
- **Secure Payment Options:** Integrated with reliable payment gateways for secure online transactions.
- **Responsive Design:** Mobile-friendly and accessible on various devices.

---

## Technologies Used

- Frontend: React.js, Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Cloud Storage: Cloudinary (for image hosting)  
- Payment Integration: E-Sewa, Khalti  
- API Testing: Postman  
- Version Control: Git & GitHub  

---

## Installation & Deployment

```bash
# Clone the repository
git clone https://github.com/Prashant-Timalsina/FYP.git

# Navigate to the project directory
cd FYP

# Install dependencies for backend and frontend (assuming separate folders)
npm install

# Run backend server
npm run server

# Run frontend development server
npm run dev

# Open the application at:
http://localhost:4000
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`, and provide your environment-specific values:

# /admin/.env

VITE_BACKEND_URL =

# /backend/.env

MONGODB_URI = 

CLOUDINARY_API_KEY = 

CLOUDINARY_SECRET_KEY = 

CLOUDINARY_NAME = 

ADMIN_EMAIL = "admin@timber.com"
ADMIN_PASSWORD = "12abcd"

JWT_SECRET = 

EMAIL_USER= 
EMAIL_PASS= 

FRONTEND_URL=http://localhost:5173

# /frontend/.env

VITE_BACKEND_URL = http://localhost:4000
FRONTEND_URL = http://localhost:5173

REACT_APP_ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main

