# Project Documentation

## Project Overview
This project is an e-commerce web application that allows users to browse, like, comment, add products to the cart, and make purchases. It also includes an admin panel for managing users, orders, products, and monitoring financial details like payments. The admin can view user activities and transaction histories, ensuring efficient management of the platform.

---

## Features and Functionality

### User Features:
1. **User Registration and Login**:
   - Users can register with their email and password or via Google/Stripe authentication.
   - Secure login using password hashing.

2. **Browse Products**:
   - Users can view product listings with details like price, description, and images.

3. **Like Products**:
   - Users can like products to keep a record of their favorites.

4. **Add to Cart**:
   - Users can add products to the cart for later purchase.

5. **Comment on Products**:
   - Users can leave reviews or comments on specific products.

6. **Checkout and Payment**:
   - Users can make purchases using payment gateways (e.g., Stripe).
   - Upon successful payment, orders are recorded.

---

### Admin Features:
1. **User Management**:
   - View all registered users and their details (e.g., username, location, activities).

2. **Product Management**:
   - Add, update, and delete products.

3. **Order Management**:
   - View all orders, payment statuses, and shipping details.

4. **Financial Overview**:
   - Track payments and display total revenue in the admin wallet.

5. **Activity Monitoring**:
   - Monitor user activity, including likes, comments, and cart additions.

---

## Folder Structure
The folder structure is organized to ensure clarity and scalability:

```
project-root/
├── controllers/
│   ├── adminController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── orderModel.js
│   └── commentModel.js
├── routes/
│   ├── adminRoutes.js
│   └── userRoutes.js
├── services/
│   └── paymentService.js
├── utils/
│   └── helpers.js
├── .env
├── server.js
└── package.json
```

---

## Database Schema

### Users Table:
| Column      | Type         | Description                 |
|-------------|--------------|-----------------------------|
| id          | UUID         | Unique user identifier      |
| username    | VARCHAR(255) | User’s name                 |
| email       | VARCHAR(255) | User’s email address        |
| password    | TEXT         | Hashed password             |
| location    | TEXT         | User’s location             |
| created_at  | TIMESTAMP    | Registration date           |

### Products Table:
| Column        | Type         | Description                 |
|---------------|--------------|-----------------------------|
| id            | UUID         | Unique product identifier   |
| name          | VARCHAR(255) | Product name                |
| description   | TEXT         | Product description         |
| price         | DECIMAL      | Product price               |
| stock         | INTEGER      | Available stock quantity    |
| created_at    | TIMESTAMP    | Product creation date       |

### Orders Table:
| Column        | Type         | Description                 |
|---------------|--------------|-----------------------------|
| id            | UUID         | Unique order identifier     |
| user_id       | UUID         | Associated user             |
| product_id    | UUID         | Associated product          |
| quantity      | INTEGER      | Number of products ordered  |
| total_price   | DECIMAL      | Total order amount          |
| payment_status| VARCHAR(50)  | Payment status              |
| created_at    | TIMESTAMP    | Order date                  |

### Comments Table:
| Column        | Type         | Description                 |
|---------------|--------------|-----------------------------|
| id            | UUID         | Unique comment identifier   |
| user_id       | UUID         | Comment author              |
| product_id    | UUID         | Commented product           |
| content       | TEXT         | Comment text                |
| created_at    | TIMESTAMP    | Comment date                |

---

## API Endpoints

### User Routes:
1. **POST /api/users/register** - Register a new user.
2. **POST /api/users/login** - Log in a user.
3. **GET /api/users/profile** - Fetch user profile.

### Product Routes:
1. **GET /api/products** - List all products.
2. **POST /api/products/:id/like** - Like a product.
3. **POST /api/products/:id/comment** - Comment on a product.

### Order Routes:
1. **POST /api/orders** - Place an order.
2. **GET /api/orders** - List user orders.

### Admin Routes:
1. **GET /api/admin/users** - View all users.
2. **GET /api/admin/orders** - View all orders.
3. **POST /api/admin/products** - Add a new product.

---

## Workflow
1. **User Registration**:
   - A user registers and logs in.
   - Auth middleware validates the session.

2. **Admin Operations**:
   - Admin adds products.
   - Admin monitors user activities and payments.

3. **User Actions**:
   - Users browse products, add to cart, like, and comment.
   - Checkout triggers payment services.

4. **Database Operations**:
   - All activities are logged and stored in the database for tracking.

---

## Payment Integration
- **Stripe** will handle payment transactions.
- Payments will be linked to user accounts and logged in the admin’s wallet.

---

## Notes
- **Security**: Use hashed passwords and secure tokens.
- **Scalability**: Modular folder structure allows for easy feature additions.
- **Testing**: Ensure all endpoints are tested for edge cases.

---

## Next Steps
1. Implement database models.
2. Build out controllers and route logic.
3. Integrate frontend with backend API.
4. Test thoroughly before deployment.

---

## Conclusion
This documentation serves as a guide for the project development. Follow the outlined structure to ensure clarity and scalability.

