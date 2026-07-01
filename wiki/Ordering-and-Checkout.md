# Ordering, Cart & Checkout Process

This section covers the end-to-end customer purchasing journey, shopping cart drawer management, category filter interactions, theme customization, and checking the order history page.

---

## 🛒 Shopping Cart & Placing Orders

Customers can add products to their carts from multiple restaurant menus. The shopping cart calculates totals, allows item quantity adjustments, and handles checkout processing.

### 1. Initiating an Order
<img src="images/1782859670871.jpg" width="300" alt="Add Product to Cart" />

* A user (User 1 - Moshik) browses the Burger Palace menu, clicks on a dish (e.g. Beef Burger) to open the details modal, and clicks **Add to Order** to add it to the cart.

### 2. Multi-Item Cart Drawer
<img src="images/1782859670890.jpg" width="300" alt="Populated Cart" />

* Multiple items are added to the cart (French Fries, Milkshake, Beef Burger). The Cart Screen aggregates all items, showing details, subtotal calculations, and a clear **Checkout** call-to-action button.

### 3. Order Completion & Success
<img src="images/1782859670921.jpg" width="300" alt="Order Placed" />

* Tapping "Checkout" sends an order payload to the backend REST API, storing the order details in MongoDB. A successful response displays a confirmation message, and the cart is cleared.

---

## 🌓 Categories & Styling Themes

The app is inspired by Wolt's visual layout and offers a category filtering banner and full Light/Dark mode transitions.

### 1. Category Banner (Burgers, Pizza, Asian, Desserts)
<img src="images/1782859670939.jpg" width="300" alt="Category Banner" />

* Located at the top of the Home page. Selecting a category icon instantly filters the displayed restaurants list.

### 2. Light Mode UI
<img src="images/1782859670958.jpg" width="300" alt="Light Mode" />

* Swapping between Light and Dark mode using the sun/moon icon in the header. The system updates styling tokens instantly and saves the user preference in the browser/device local storage.

---

## 📜 User Profile & Order History

Each user has a profile page showing details, coordinates, and their complete order history.

### User Profile Page
<img src="images/1782859670997.jpg" width="300" alt="User Profile Order History" />

* Shows the logged-in user profile page. Under the **Order History** section, we can see the recently placed orders, including the order details from Burger Palace (3 specific products: Beef Burger, French Fries, Milkshake) showing as processing/completed.
