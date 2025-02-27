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