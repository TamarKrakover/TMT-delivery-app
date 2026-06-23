# Product Recommendations Implementation Plan

The goal is to implement a personalized product recommendation section on the `HomePage`. The recommendations are fetched from the existing C++ recommendation server based on the user's last viewed product.

## Why a Backend Route (`/api/recommendations`) is Necessary
React runs in the client browser. Browsers do not support raw TCP socket connections (such as the `net` module used in `recommendationServer.js`) due to security policies. Because the C++ recommendation server only communicates via raw TCP sockets, the frontend **cannot connect to it directly**. 

Instead:
1. `HomePage.jsx` (frontend) makes an HTTP request to the Express API (`GET /api/recommendations/:userId/:productId`).
2. Express (backend) uses the Node.js `net` module to communicate with the C++ server via TCP, fetches the recommended IDs, and queries the database for the matching product objects.
3. Express sends the full product details back to `HomePage.jsx` as an HTTP JSON response.

---

## Proposed Changes

### Backend Changes

#### [MODIFY] [recommendationServer.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/src/services/recommendationServer.js)
- Add a new `get(userId, productId)` method. This method will send the `get {userId} {productId}` string to the C++ server via TCP and return the space-separated string of recommended product IDs.

#### [MODIFY] [UserModel.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/src/models/UserModel.js)
- Add a field `lastViewedProduct` to the user schema/object.
- Add a static method `updateLastViewedProduct(userId, productId)` to find the user in the database and update their `lastViewedProduct` field.

#### [MODIFY] [ProductModel.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/src/models/ProductModel.js)
- Add a new static method `findByGlobalId(productId)` to search the `db.products` array using just the `productId`.
- In `findById(restaurantId, productId, userId)`, if `userId` is present, call `UserModel.updateLastViewedProduct(userId, productId)` to save the product view into the database.

#### [NEW] [recommendationController.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/src/controllers/recommendationController.js)
- Create a new controller with a `getRecommendations` function.
- Accept `userId` and `productId` parameters.
- Call `RecommendationServer.get(userId, productId)`.
- Parse the returned product IDs, look up the full product objects using `ProductModel.findByGlobalId()`, and append the parent `restaurant` object to each product (since the frontend `MenuItem` requires the `restaurant` object to allow adding items to the cart).
- Return the structured array of `{ product, restaurant }` objects.

#### [NEW] [recommendationRoutes.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/src/routes/recommendationRoutes.js)
- Create new routes file defining `GET /:userId/:productId` which points to `recommendationController.getRecommendations`.

#### [MODIFY] [app.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/api/app.js)
- Register the new recommendation routes by adding: `app.use('/api/recommendations', recommendationRoutes);`

---

### Frontend Changes

#### [MODIFY] [productService.js](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/react-client/src/services/productService.js)
- Add a new helper method `getRecommendations(userId, productId)` to fetch the recommendations:
  `getRecommendations: (userId, productId) => request(`/api/recommendations/${userId}/${productId}`)`

#### [MODIFY] [ProductDetailModal.jsx](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/react-client/src/components/modals/ProductDetailModal.jsx)
- Update the component to save the product view to the current user context:
  - When a product is viewed, call a helper in the `AuthContext` to update the local `currentUser` object's `lastViewedProduct` field to `product.id` (updating the frontend context state & localStorage) so it updates instantly without waiting for a re-login.

#### [MODIFY] [AuthContext.jsx](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/react-client/src/contexts/AuthContext.jsx)
- Add an `updateLastViewedProduct(productId)` method that updates `currentUser.lastViewedProduct = productId` in state and saves the updated user to `localStorage`.

#### [MODIFY] [HomePage.jsx](file:///c:/Users/arzua/Desktop/driveBackup/mitkadem/targil/Advanced-Programming/react-client/src/pages/HomePage.jsx)
- Add state variables for `recommendations` and `recommendationsStatus`.
- Implement a `useEffect` that runs when the `HomePage` mounts and when `currentUser` changes:
  1. If `currentUser` is not connected, do nothing (don't show the recommendations section).
  2. If `currentUser` is connected, check `currentUser.lastViewedProduct`.
  3. If no product has been viewed, display the text **"check out your taste!"** with no products underneath.
  4. If a product has been viewed, fetch the recommendations using `productService.getRecommendations(currentUser.id, currentUser.lastViewedProduct)`.
  5. Render the returned products underneath in a row.

## Verification Plan

### Automated Tests
- If applicable, run the node backend tests to ensure the new routes and controller don't break existing endpoints.

### Manual Verification
1. Start the React app, Node.js API, and the C++ Recommendation server.
2. Log in as a user who has never viewed a product. Verify that the homepage displays "check out your taste!".
3. Open a restaurant and click on a product to view it.
4. Navigate back to the homepage. Verify that a GET request is sent to the recommendation server for that user and product.
5. Verify that the returned recommended products are displayed in a horizontal row on the homepage.
6. Verify that logging out hides the recommendations section completely.
