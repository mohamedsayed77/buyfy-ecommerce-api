# Buyfy E-Commerce API

This repository contains the Buyfy E-Commerce API, a scalable and robust backend for e-commerce applications. Built with Node.js, Express, and MongoDB, it supports key features such as authentication, user management, product management, reviews, and more.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Scripts](#scripts)
6. [Endpoints](#endpoints)
7. [Error Handling](#error-handling)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- User Authentication (Signup, Login, Password Reset)
- Role-based Access Control (Admin, Manager, User)
- CRUD operations for:
  - Categories
  - Subcategories
  - Products
  - Brands
  - Reviews
- Wishlist Management
- Address Management
- Image Uploads and Processing (using `Multer` and `Sharp`)
- Pagination, Filtering, Sorting, and Search for Products
- Global Error Handling

---

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- Bcrypt.js
- Multer
- Sharp
- Nodemailer
- Express-Validator

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mohamedsayed77/buyfy-ecommerce-api.git
   cd buyfy-ecommerce-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the required environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:
   - Development:
     ```bash
     npm run start:dev
     ```
   - Production:
     ```bash
     npm run start:prod
     ```

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
DB_LINK=<your_mongodb_connection_string>
JWT_SECRET_KEY=<your_jwt_secret>
JWT_EXPIRATION_TIME=30d
EMAIL_HOST_USERNAME=<your_email_username>
EMAIL_HOST_PASSWORD=<your_email_password>
BASE_URL=<your_api_base_url>
NODE_ENV=development
```

---

## Scripts

- **Start Development Server:** `npm run start:dev`
- **Start Production Server:** `npm run start:prod`
- **Run Tests:** `npm test`
- **Lint Code:** `npm run lint`
- **Fix Lint Errors:** `npm run fix`

---

## Endpoints

### Authentication

- **POST** `/api/v1/auth/signup` - Register a new user
- **POST** `/api/v1/auth/login` - Login user
- **POST** `/api/v1/auth/forgetPassword` - Request password reset
- **POST** `/api/v1/auth/resetPassword` - Reset password

### Categories

- **GET** `/api/v1/categories` - Get all categories
- **POST** `/api/v1/categories` - Create a new category
- **GET** `/api/v1/categories/:id` - Get a specific category by ID
- **PUT** `/api/v1/categories/:id` - Update a specific category
- **DELETE** `/api/v1/categories/:id` - Delete a specific category

### Subcategories

- **GET** `/api/v1/categories/:categoryId/subcategories` - Get all subcategories for a category
- **POST** `/api/v1/categories/:categoryId/subcategories` - Create a new subcategory
- **GET** `/api/v1/subcategories/:id` - Get a specific subcategory by ID
- **PUT** `/api/v1/subcategories/:id` - Update a specific subcategory
- **DELETE** `/api/v1/subcategories/:id` - Delete a specific subcategory

### Products

- **GET** `/api/v1/products` - Get all products
- **POST** `/api/v1/products` - Create a new product
- **GET** `/api/v1/products/:id` - Get a specific product by ID
- **PUT** `/api/v1/products/:id` - Update a specific product
- **DELETE** `/api/v1/products/:id` - Delete a specific product

### Brands

- **GET** `/api/v1/brands` - Get all brands
- **POST** `/api/v1/brands` - Create a new brand
- **GET** `/api/v1/brands/:id` - Get a specific brand by ID
- **PUT** `/api/v1/brands/:id` - Update a specific brand
- **DELETE** `/api/v1/brands/:id` - Delete a specific brand

### Reviews

- **GET** `/api/v1/products/:productId/reviews` - Get all reviews for a product
- **POST** `/api/v1/products/:productId/reviews` - Create a new review
- **GET** `/api/v1/reviews/:id` - Get a specific review by ID
- **PUT** `/api/v1/reviews/:id` - Update a specific review
- **DELETE** `/api/v1/reviews/:id` - Delete a specific review

### Wishlist

- **GET** `/api/v1/wishlist` - Get the wishlist for the authenticated user
- **POST** `/api/v1/wishlist` - Add a product to the wishlist
- **DELETE** `/api/v1/wishlist/:productId` - Remove a product from the wishlist

### Address

- **GET** `/api/v1/address` - Get all addresses for the authenticated user
- **POST** `/api/v1/address` - Add a new address
- **DELETE** `/api/v1/address/:addressId` - Delete a specific address

### User Management (Admin Only)

- **GET** `/api/v1/admin` - Get all users
- **POST** `/api/v1/admin` - Create a new user
- **GET** `/api/v1/admin/:id` - Get a specific user by ID
- **PUT** `/api/v1/admin/:id` - Update a specific user
- **DELETE** `/api/v1/admin/:id` - Delete a specific user
- **PUT** `/api/v1/admin/changepassword/:id` - Change password for a specific user

---

## Error Handling

The application uses a global error handler to manage all operational errors and provides standardized error responses with the following structure:

```json
{
  "status": "error",
  "message": "Error message",
  "stack": "Stack trace (only in development mode)"
}
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

---

## License

This project is licensed under the ISC License.
