# Ordering, Cart & Checkout Process

This section covers the end-to-end customer purchasing journey, shopping cart drawer management, category filter interactions, theme customization, and checking the order history page.

---

## 🛒 Shopping Cart & Placing Orders

Customers can add products to their carts from a single restaurant at a time. If a user attempts to add a product from a different restaurant, a prompt will ask them if they want to clear their current cart before adding the new item. The shopping cart calculates totals, allows item quantity adjustments, and handles checkout processing.

### 1. Initiating an Order (Product Details)

A user browses a menu, clicks on a dish (e.g. Beef Burger) to open the details modal, and clicks **Add to Order** to add it to the cart.

**Web Client**:
![Product Details Modal Web](../runScreenShot/run8.png)

**Mobile Client**:
<img src="images/1782859670852.jpg" width="300" alt="Product Details Mobile" />

### 2. Multi-Item Cart Drawer

Multiple items are added to the cart (French Fries, Milkshake, Beef Burger). The Cart Screen (or side drawer) aggregates all items, showing details, subtotal calculations, allows editing item quantities (increment/decrement), deleting items, and displays a clear **Checkout** call-to-action button.

**Web Client**:
![Shopping Cart Web](../runScreenShot/run9.png)

**Mobile Client**:
<img src="images/1782859670833.jpg" width="300" alt="Populated Cart Mobile" />

### 3. Order Completion & Success

Tapping "Checkout" sends an order payload to the backend REST API, storing the order details in MongoDB. A successful response displays a confirmation message, and the cart is cleared/updates in real-time.

**Web Client**:
![Order Confirmed Web](../runScreenShot/run10.png)

**Mobile Client**:
<img src="images/1782859670815.jpg" width="300" alt="Order Placed Success Mobile" />

---

## 🌓 Categories & Styling Themes

The app is inspired by Wolt's visual layout and offers a category filtering banner and full Light/Dark mode transitions.

### 1. Category Banner (Burgers, Pizza, Asian, Desserts)
*(MISSING: Add Category Banner screenshot here)*

* Located at the top of the Home page. Selecting a category icon instantly filters the displayed restaurants list.

### 2. Light / Dark Mode UI

Swapping between Light and Dark mode using the sun/moon icon in the header. The system updates styling tokens instantly and saves the user preference in the browser/device local storage.

**Web Client (Dark Mode)**:
![Dark Mode Web](../runScreenShot/darkMode.png)

**Mobile Client (Dark Mode)**:
<img src="images/1782859671048.jpg" width="300" alt="Dark Mode Mobile" />

---

## 📜 User Profile & Order History

Each user has a profile page showing details, coordinates, and their complete order history.

### User Profile Page

Shows the logged-in user profile page. Under the **Order History** section, we can see the recently placed orders, including the order details from Burger Palace (3 specific products: Beef Burger, French Fries, Milkshake) showing as processing/completed. For owners, on web, a "My Restaurants" section displays all registered restaurants.

**Web Client**:
![User Profile Web](../runScreenShot/run11.png)

**Mobile Client**:
<img src="images/1782859670778.jpg" width="300" alt="User Profile Order History Mobile" />
