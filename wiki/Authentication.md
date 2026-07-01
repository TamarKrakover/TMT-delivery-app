# Authentication & User Management

The application features a secure signup and sign-in module with robust validation rules, account type roles, and profile picture customization.

---

## 🔐 Sign In & Authentication Flow

### Login Screen

When users open the app, they are presented with the **Login Screen**. Form controls validate that fields are filled out. Tapping "Sign up" redirects to the registration form.

**Web Client**:
![Login Screen Web](../runScreenShot/loginWebPlaceholder.png) *(MISSING: Add screenshot here)*

**Mobile Client**:
<img src="images/1782859671162.jpg" width="300" alt="Login Screen Empty Mobile" /> <img src="images/1782859671073.jpg" width="300" alt="Login Screen Filled Mobile" />

---

## 📝 User Registration & Input Validation

The registration module allows creating either a **Regular User** (Customer) or a **Restaurant Owner**. It enforces real-time input validations:

* **Username & Full Name**: Mandatory fields, cannot be empty.
* **Account Type (Roles)**: Interactive cards to choose between `Customer` and `Owner` roles.
* **Password Validation**: Enforced via regex to be **at least 8 characters long**, containing **letters, numbers, and at least one special character**.
* **Coordinates (Latitude & Longitude)**: Must be valid floating-point numbers. These coordinates are used for dynamic distance calculations to nearby restaurants.
* **Profile Image Upload**: Integrated with Expo Image Picker, allowing the user to select an existing image from their device gallery or capture a photo using their camera.

### 1. Registering as a Restaurant Owner (or Customer)

Filling out registration details with the role card set to **Restaurant Owner** (Owner) or **Customer**. Valid fields remove the real-time red warning messages.

**Web Client**:
![Registration Screen Web](../runScreenShot/run1.png)

**Mobile Client**:
<img src="images/1782859671142.jpg" width="300" alt="Registration Screen Empty Mobile" /> <img src="images/1782859671123.jpg" width="300" alt="Registration Screen Filled Mobile" />

### 2. Successful Registration

Upon successful API registration, a custom success modal is shown, prompting the user to navigate back to the Sign In screen to log in.

**Web Client**:
![Registration Success Web](../runScreenShot/registrationSuccessWebPlaceholder.png) *(MISSING: Add screenshot here)*

**Mobile Client**:
<img src="images/1782859671096.jpg" width="300" alt="Registration Success Mobile" />

---

## 👤 Multi-User Switching

The application supports multiple users and tracks their specific activity histories (logged views and orders) for collaborative recommendation logic.

### 1. Logging Out (User 1)

Tapping the logout button under the profile screen signs the user out, clearing the session headers and local storage, and returning the user to the login screen.

**Web Client**:
![User Logout Web](../runScreenShot/logoutWebPlaceholder.png) *(MISSING: Add screenshot here)*

**Mobile Client**:
<img src="images/1782859671162.jpg" width="300" alt="Login Screen Mobile" />

### 2. Logging In as User 2

Signing in as `user2` to inspect the collaborative recommendations based on the previous user's order actions.

**Web Client**:
![User 2 Login Web](../runScreenShot/loginUser2WebPlaceholder.png) *(MISSING: Add screenshot here)*

**Mobile Client**:
<img src="images/1782859670741.jpg" width="300" alt="User 2 Home Recommendations Mobile" />
