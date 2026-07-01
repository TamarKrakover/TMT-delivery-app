# Restaurant & Product Management

Users registered with the **Restaurant Owner** role have full CRUD (Create, Read, Update, Delete) permissions over their restaurants and corresponding menu products.

---

## 🏬 Owner Restaurant Dashboard

When logged in as an Owner, the homepage displays a dedicated **My Restaurants** section where the owner can manage all of their establishments.

### 1. Initial State (No Restaurants)

Shows the owner's homepage. Since no restaurants are registered yet, the "My Restaurants" section shows a prompt to add a new establishment.

**Web Client**:
![Owner Dashboard Web](../runScreenShot/ownerDashboardWebPlaceholder.png) *(MISSING: Add screenshot here)*

**Mobile Client**:
<img src="images/1782859671029.jpg" width="300" alt="Owner Dashboard Empty Mobile" />

### 2. Owner Dashboard (Populated)

Once a restaurant is added, it appears as a tile under the "My Restaurants" section.

**Web Client**:
*(MISSING: Add populated dashboard screenshot here)*

**Mobile Client**:
<img src="images/1782859670939.jpg" width="300" alt="Owner Dashboard Populated Mobile" />

### 3. Creating a Restaurant

Clicking "Add Restaurant" opens a modal form. The owner specifies the Restaurant Name (e.g., Burger Palace), Description, Category (selection dropdown), Location coordinates (Latitude and Longitude), and Cover Image (loaded from device library).

**Web Client**:
![Add Restaurant Modal Web](../runScreenShot/run2.png)

**Mobile Client**:
<img src="images/1782859670997.jpg" width="300" alt="Add Restaurant Modal Empty Mobile" /> <img src="images/1782859670958.jpg" width="300" alt="Add Restaurant Modal Filled Mobile" />

### 4. New Restaurant Overview (Empty Menu)

Shows the newly created restaurant details page before any dishes are added. Because the current user is the verified owner, additional management controls appear on the screen: **Add Product**, **Edit Restaurant**, and **Delete Restaurant**.

**Web Client**:
![Restaurant Owner View Web](../runScreenShot/run5.png)

**Mobile Client**:
*(MISSING: Add Restaurant Details Empty screenshot here)*

### 5. Editing and Deleting a Restaurant (CRUD)

Owners can update the restaurant details or remove the restaurant entirely from the system.

**Web Client**:
![Edit Restaurant Web](../runScreenShot/editRestaurantWebPlaceholder.png) *(MISSING: Add Edit/Delete screenshot here)*

**Mobile Client**:
![Edit Restaurant Mobile](images/editRestaurantMobilePlaceholder.jpg) *(MISSING: Add Edit/Delete screenshot here)*

---

## 🍔 Menu Product Management

Owners can construct and customize their menu lists by adding separate dishes (products) to their restaurant profiles.

### 1. Adding a Dish

Clicking the "Add Product" button triggers a modal where the owner defines the item's details: Product Name (e.g., Beef Burger), Price (in shekels or USD), Description, and Product image (picked from the device gallery or default placeholder).

**Web Client**:
![Add Menu Item Web](../runScreenShot/run6.png)

**Mobile Client**:
<img src="images/1782859670921.jpg" width="300" alt="Add Product Modal Filled Mobile" />

### 2. Menu Populated

The newly added dish immediately appears on the restaurant's menu list.

**Web Client**:
![Managed Menu Web](../runScreenShot/run7.png)

**Mobile Client**:
<img src="images/1782859670890.jpg" width="300" alt="Restaurant Menu with Product Mobile" />

### 3. Populated Restaurant Menu (Customer View vs Owner View)

Multiple products are added (e.g., French Fries, Milkshake, Beef Burger) to complete the menu. Owners can tap any menu item card to edit its description, adjust pricing, or delete the item completely. Customers will only see the "Add to Cart" action.

**Web Client**:
![Restaurant Details Web](../runScreenShot/run4.png)

**Mobile Client**:
<img src="images/1782859670871.jpg" width="300" alt="Complete Menu Mobile" />

### 4. Editing and Deleting a Dish (CRUD)

Owners can adjust pricing, update the image/description, or remove the dish from the menu.

**Web Client**:
![Edit Dish Web](../runScreenShot/editDishWebPlaceholder.png) *(MISSING: Add Edit/Delete screenshot here)*

**Mobile Client**:
![Edit Dish Mobile](images/editDishMobilePlaceholder.jpg) *(MISSING: Add Edit/Delete screenshot here)*
