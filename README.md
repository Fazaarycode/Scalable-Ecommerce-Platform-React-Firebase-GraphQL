# Scalable-Ecommerce-Platform
 Assessment Overview

Title: Architect and Build a Scalable E-commerce Platform
Duration: 2-3 days

1. Project Description

Develop a scalable e-commerce system where users can browse products, add them to a cart, and complete a checkout process. The system must be designed to handle high traffic, real-time updates, and secure user authentication with Firebase. Architectural decisions should be documented in a separate file.
2. Functional Requirements

User Authentication (Firebase)
• Users can sign up and log in using:
• Email/Password
• Google Sign-In
• Users can view and update their profile.
• Firebase RBAC should be implemented:
• Admin can manage products, orders, and users.
• Customer can browse, purchase, and track orders.

Product Management
• Admin can add, edit, or delete products.
• Products should include:
• Name
• Image
• Price
• Stock availability
• Category
• Discount support
• Customers can filter and search products by category, price, and availability.

Shopping Cart & Checkout
• Users can add/remove products from the cart.
• Display cart total price dynamically.
• Cart should persist for both guest and logged-in users.
• Checkout requires:
• Shipping address
• Payment method (Mock Payment, Stripe integration optional)
• Orders should be created with statuses:
• Pending, Shipped, Delivered

API Requirements
• Authentication Middleware using Firebase.
• Endpoints:
• POST /auth/login – Firebase login
• GET /products – Fetch all products
• GET /products/:id – Fetch product details
• POST /cart – Add item to cart
• GET /cart – Retrieve user’s cart
• POST /checkout – Process order
• GET /orders – Retrieve user’s order history
• POST /admin/products – Add new product (Admin Only)
• PUT /admin/orders/:id – Update order status (Admin Only)
3. Architectural & Technical Requirements

Frontend (Next.js + TypeScript)
• Next.js or React.js for SEO and performance.
• Firebase Authentication SDK for auth management.
• React Query or Axios for efficient API handling.
• TailwindCSS or Material UI for UI styling.
• Redux/Zustand/Context API for state management.
• Lazy loading and caching for performance.

Backend (Node.js + Express or NestJS)
• Express.js or NestJS for API development.
• PostgreSQL (with Prisma/TypeORM) or Firestore for database.
• Firebase Admin SDK for authentication verification.
• Role-Based Access Control (RBAC) for authorization.
• Event-driven processing (e.g., WebSockets for real-time stock updates).
• Rate limiting & logging (using Winston or Bunyan).

Database Design
• Use PostgreSQL with a structured relational schema:
• Users (id, name, email, role, created_at)
• Products (id, name, description, price, stock, category)
• Orders (id, user_id, total_price, status, created_at)
• Order_Items (order_id, product_id, quantity, price)
• If using Firestore, implement efficient indexing & queries.

Deployment Strategy
• Backend: Deploy using Firebase Functions.
• Frontend: Deploy on Vercel, Firebase Hosting, or AWS S3 with CloudFront.
• Microservices architecture for scalable backend.
• GraphQL API instead of REST.
• Unit tests using Jest, Cypress, or Playwright.
• Swagger/OpenAPI for API documentation.

Submission Guidelines
1. GitHub Repository with clear project structure. Invite devzimozi 
2. README.md with setup instructions and architecture overview.
3. Deployed version link (Firebase/Vercel).
4. Postman Collection for API testing.
5. Architecture Document (ARCHITECTURE.md) explaining:
• Chosen technologies & reasons.
• System design (diagrams if possible).
• Performance optimizations.

Moving the project to Public as there is no response from evaluating team.
