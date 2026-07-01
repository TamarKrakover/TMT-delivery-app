# Authentication & User Management

The application features a secure signup and sign-in module with robust validation rules, account type roles, and profile picture customization.

---

## 🔐 Sign In & Authentication Flow

When users open the app, they are presented with the **Login Screen**. Users must enter valid credentials. If authentication fails, clear error indicators or custom error modals are presented.

### Login Screen
<img src="images/1782859670701.jpg" width="300" alt="Login Screen" />

* Form controls validate that fields are filled out. Tapping "Sign up" redirects to the registration form.

---

## 📝 User Registration & Input Validation

The registration module allows creating either a **Regular User** (Customer) or a **Restaurant Owner**. It enforces real-time input validations:

* **Username & Full Name**: Mandatory fields, cannot be empty.
* **Account Type (Roles)**: Interactive cards to choose between `Customer` and `Owner` roles.
* **Password Validation**: Enforced via regex to be **at least 8 characters long**, containing **both letters and numbers**.
* **Coordinates (Latitude & Longitude)**: Must be valid floating-point numbers. These coordinates are used for dynamic distance calculations to nearby restaurants.
* **Profile Image Upload**: Integrated with Expo Image Picker, allowing the user to select an existing image from their device gallery or capture a photo using their camera.

### 1. Registering as a Restaurant Owner
<img src="images/1782859670722.jpg" width="300" alt="Registration Screen" />

* Filling out registration details with the role card set to **Restaurant Owner** (Owner). Valid fields remove the real-time red warning messages.

### 2. Successful Registration
<img src="images/1782859670741.jpg" width="300" alt="Registration Success" />

* Upon successful API registration, a custom success modal is shown, prompting the user to navigate back to the Sign In screen to log in.

---

## 👤 Multi-User Switching

The application supports multiple users and tracks their specific activity histories (logged views and orders) for collaborative recommendation logic.

### 1. Logging Out (User 1)
<img src="images/1782859671029.jpg" width="300" alt="User Logout" />

* Tapping the logout button under the profile screen signs the user out, clearing the session headers and local storage, and returning the user to the login screen.

### 2. Logging In as User 2
<img src="images/1782859671048.jpg" width="300" alt="User 2 Login" />

* Signing in as `user2` to inspect the collaborative recommendations based on the previous user's order actions.
