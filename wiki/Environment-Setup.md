# Environment Setup & Running the Application

To build, compile, and run the complete TMT Delivery stack, we utilize Docker Compose. This ensures all services (frontend clients, backend servers, recommendation engine, and database) boot up in a unified network.

---

## 🚀 Step-by-Step Execution

### 1. Build and Run Backend & Web Clients
To raise the MongoDB database, the C++ recommendation engine, the Node.js Express server, and the React Web Client, open a terminal in the root project directory and run:

```bash
docker compose up --build
```
*(Note: Keep this terminal open and running!)*

#### Running Services:
* **React Web Frontend**: Accessible locally at `http://localhost:3000`
* **Node.js Express REST API**: Accessible locally at `http://localhost:8080`
* **MongoDB Instance**: Accessible at `mongodb://localhost:27017`
* **C++ Recommendation Engine**: Runs on port `5555` inside the container network.

---

### 2. Run the React Native Mobile Client (Expo)
Open a **new, separate terminal** so the backend remains running. You have two options to launch the mobile app:

**Option A: Via Docker Profile**
```bash
docker compose --profile mobile up --build
```

**Option B: Locally (Recommended for Emulators)**
If you want to run the app on an Android Emulator or iOS Simulator, or via the Expo Go app on your physical phone, run it locally:
```bash
cd mobile-client
npm install
npm start
```
*Once the Metro Bundler starts:*
- **Emulators**: Press `a` in the terminal to open the Android Emulator, or `i` for the iOS Simulator.
- **Physical Device**: Download the **Expo Go** app (Note: requires **version 56**) on your smartphone and scan the QR code displayed in the terminal to run the app on your own device.

---

## 🏗️ Services Overview (`docker-compose.yml`)

The system comprises 5 containerized services configured as follows:

| Service Name | Container Name | Port(s) | Description |
| :--- | :--- | :--- | :--- |
| `server` | `tmt-server` | `5555:5555` | The C++ Recommendation Engine built via CMake, tracking histories and running collaborative filtering algorithms. |
| `mongodb` | `tmt-mongodb` | `27017:27017` | MongoDB instance storing dynamic users, restaurants, products, and order histories via Mongoose ODM. |
| `web-server`| `tmt-web-server` | `8080:8080` | Node.js Express API routing traffic, storing data in MongoDB, and communicating with the C++ server via TCP. |
| `client` | `tmt-client` | `3000:3000` | Single Page Application (SPA) React Web Client. |
| `mobile-client`| `tmt-mobile-client`| `8081:8081` | Expo-based React Native mobile app bundle. |
