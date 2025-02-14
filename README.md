# Epichomes Website

Epichomes is a platform designed for managing AC and home appliance repair services. It allows users to request repairs, browse available services, and book appointments for home appliance repair.

## Technologies Used

This project utilizes a variety of technologies and tools to ensure a smooth and scalable experience. Below are the major dependencies:

- **Node.js** (v20.15.1)
- **Express.js** - A web application framework for Node.js
- **MongoDB** with **Mongoose** - For database management
- **Cloudinary** - For image storage and management
- **Passport.js** - Authentication middleware
- **Stripe** - Payment processing
- **EJS** - Templating engine
- **Multers** - Middleware for handling file uploads
- **dotenv** - To manage environment variables
- **nodemailer** - For sending emails

## Installation

### Prerequisites
Ensure that you have the following installed:

- [Node.js](https://nodejs.org) (v20.15.1 or higher)
- [MongoDB](https://www.mongodb.com/) or a cloud instance (e.g., MongoDB Atlas)

### Steps to Install

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/epichomes.git
   cd epichomes
   
Install dependencies:
npm install

Create a .env file in the root directory and add the following configuration:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGO_URI=your_mongo_database_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_HOST=your_email_smtp_host
EMAIL_PORT=your_email_smtp_port
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

Run the app in development mode:
npm run dev
