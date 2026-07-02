# Restaurant & Product Management

Users registered with the **Restaurant Owner** role have full CRUD (Create, Read, Update, Delete) permissions over their restaurants and corresponding menu products.

---

## 🏬 Owner Restaurant Dashboard

When logged in as an Owner, the homepage displays a dedicated **My Restaurants** section where the owner can manage all of their establishments.

### 1. Initial State (No Restaurants)

Shows the owner's homepage. Since no restaurants are registered yet, the "My Restaurants" section shows a prompt to add a new establishment.

**Web Client**:
![Owner Dashboard Web](assets/web_owner_dashboard_empty.png)

**Mobile Client**:
<img src="assets/mobile_owner_dashboard_empty.jpg" width="300" alt="Owner Dashboard Empty Mobile" />

### 2. Owner Dashboard (Populated)

Once a restaurant is added, it appears as a tile under the "My Restaurants" section.

**Web Client**:
![Populated Dashboard Web](assets/web_owner_dashboard_populated.png)

**Mobile Client**:
<img src="assets/mobile_owner_dashboard_populated.jpg" width="300" alt="Owner Dashboard Populated Mobile" />

### 3. Creating a Restaurant

Clicking "Add Restaurant" opens a modal form. The owner specifies the Restaurant Name (e.g., Burger Palace), Description, Category (selection dropdown), Location coordinates (Latitude and Longitude), and Cover Image (loaded from device library).

**Web Client**:
![Add Restaurant Modal Web](assets/web_add_restaurant_modal.png)

**Mobile Client**:
<img src="assets/mobile_add_restaurant_empty.jpg" width="300" alt="Add Restaurant Modal Empty Mobile" /> <img src="assets/mobile_add_restaurant_filled.jpg" width="300" alt="Add Restaurant Modal Filled Mobile" />

### 4. New Restaurant Overview (Empty Menu)

Shows the newly created restaurant details page before any dishes are added. Because the current user is the verified owner, additional management controls appear on the screen: **Add Product**, **Edit Restaurant**, and **Delete Restaurant**.

**Web Client**:
![Restaurant Owner View Web](assets/web_restaurant_owner_view.png)

**Mobile Client**:
<img src="assets/mobile_add_product_empty.jpg" width="300" alt="Restaurant Details Empty Mobile" />

### 5. Editing and Deleting a Restaurant (CRUD)

Owners can update the restaurant details or remove the restaurant entirely from the system.

**Web Client**:
![Edit Restaurant Web](assets/web_delete_restaurant_modal.png)

**Mobile Client**:
<img src="assets/mobile_delete_restaurant_modal.jpg" width="300" alt="Edit Restaurant Mobile" />

---

## 🍔 Menu Product Management

Owners can construct and customize their menu lists by adding separate dishes (products) to their restaurant profiles.

### 1. Adding a Dish

Clicking the "Add Product" button triggers a modal where the owner defines the item's details: Product Name (e.g., Beef Burger), Price (in shekels or USD), Description, and Product image (picked from the device gallery or default placeholder).

**Web Client**:
![Add Menu Item Web](assets/web_add_menu_item.png)

**Mobile Client**:
<img src="assets/mobile_add_menu_item_filled.jpg" width="300" alt="Add Product Modal Filled Mobile" />

### 2. Menu Populated

The newly added dish immediately appears on the restaurant's menu list.

**Web Client**:
![Managed Menu Web](assets/web_managed_menu.png)

**Mobile Client**:
<img src="assets/mobile_restaurant_menu_product.jpg" width="300" alt="Restaurant Menu with Product Mobile" />

### 3. Populated Restaurant Menu (Customer View vs Owner View)

Multiple products are added (e.g., French Fries, Milkshake, Beef Burger) to complete the menu. Owners can tap any menu item card to edit its description, adjust pricing, or delete the item completely. Customers will only see the "Add to Cart" action.

**Web Client**:
![Restaurant Details Web](assets/web_restaurant_details.png)

**Mobile Client**:
<img src="assets/mobile_complete_menu.jpg" width="300" alt="Complete Menu Mobile" />

### 4. Editing and Deleting a Dish (CRUD)

Owners can adjust pricing, update the image/description, or remove the dish from the menu.

**Web Client**:
![Edit Dish Web](assets/web_edit_dish.png)

**Mobile Client**:
<img src="assets/mobile_edit_dish.jpg" width="300" alt="Edit Dish Mobile" />
