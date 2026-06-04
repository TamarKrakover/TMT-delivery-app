# TMTproject - Web Server API

## About The Application

This project is a Web Server API serving as the core of a food delivery application (similar to Wolt). 
The server uses an MVC architecture and provides a RESTful API to manage users, restaurants, products, orders, and search functionality. 
All responses are formatted in JSON.

This server acts as a client to the **Product Recommendation System**, communicating via a socket connection to record user actions (e.g., viewing a product).

## Version Management from Exercise 2

The code submitted for Exercise 2 has been "locked" in a dedicated branch named `Ex2`. This ensures that the grader can evaluate the previous submission exactly as it was, and the work on Exercise 3 on the `main` branch (and its feature branches) does not overwrite or interfere with Exercise 2.

![Run Screenshot](runScreenShot.png)

## How to Run

The application is completely containerized and managed using `Docker Compose`.

To build and start both servers, run the following command in the root directory:

```bash
docker compose up --build
```

The Web API Server will run on `http://localhost:8080`, and it will automatically connect to the C++ Recommendation Server via TCP on port `5555`.

## Execution Examples (CURL)

> [!NOTE]
> **Terminal Compatibility:** The `curl` commands below are formatted for Unix-like shells (e.g., Linux, macOS, WSL, or Git Bash) using single quotes for the JSON body. If you are running these in native Windows **PowerShell** or **Command Prompt**, you will need to use `curl.exe` and escape the double quotes appropriately (e.g., `-d "{\"key\": \"value\"}"`).

Here is a demonstration of interacting with the API running on `localhost:8080`:

### Registration (Users)
```bash
curl -i -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"username": "johndoe", "password": "123", "name": "John Doe", "phone": "555-1234", "address": "123 Main St"}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/users/<userID>
```

### Creating a Restaurant (Restaurants)
```bash
curl -i -X POST http://localhost:8080/api/restaurants -H "Content-Type: application/json" -H "x-user-id: <userID>" -d '{"name": "McDonalds", "address": "456 Burger St"}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/restaurants/<restaurantID>
```

### Adding a Product (Products)
```bash
curl -i -X POST http://localhost:8080/api/restaurants/<restaurantID>/products -H "Content-Type: application/json" -H "x-user-id: <userID>" -d '{"name": "Big Mac", "price": 5.99}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/restaurants/<restaurantID>/products/<productID>
```

### Creating an Order (Orders)
```bash
curl -i -X POST http://localhost:8080/api/orders -H "Content-Type: application/json" -H "x-user-id: <userID>" -d '{"restaurantId": "<restaurantID>", "productIds": ["<productID>"], "totalPrice": 5.99}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/orders/<orderID>
```

### Search (Search)
```bash
curl -i http://localhost:8080/api/search/Mac
```
**Expected Output:**
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8

[
  {
    "id": "<productID>",
    "restaurantId": "<restaurantID>",
    "name": "Big Mac",
    "description": "",
    "price": 5.99
  }
]
```

## Available RESTful API Endpoints

> [!IMPORTANT]
> **Authentication:** Endpoints marked with **(Auth required)** expect a custom HTTP header named `x-user-id`. The value of this header must be a valid User ID obtained from the Login (`POST /api/tokens`) endpoint.

### Authentication and Registration
- `POST /api/users` - Create a new user. **(Public)**
  - *Required JSON body:* `username`, `password`, `name`, `phone`, `address`
- `POST /api/tokens` - Login and get user token. **(Public)**
  - *Required JSON body:* `username`, `password`
- `GET /api/users/:id` - Retrieve user details. **(Auth required)**

### Restaurants
- `GET /api/restaurants` - List all restaurants. **(Public)**
- `GET /api/restaurants/:id` - Get specific restaurant details. **(Public)**
- `POST /api/restaurants` - Create a new restaurant. **(Auth required)**
  - *Required JSON body:* `name`, `address`
  - *Optional JSON body:* `description` (defaults to empty), `category` (defaults to 'General')
- `PATCH /api/restaurants/:id` - Edit a restaurant. **(Auth required)**
  - *Optional JSON body:* `name`, `address`, `description`, `category` (Only send what you want to update)
- `DELETE /api/restaurants/:id` - Delete a restaurant. **(Auth required)**

### Products
- `GET /api/restaurants/:id/products` - List restaurant products. **(Public)**
- `GET /api/restaurants/:id/products/:pId` - Get a specific product. **(Public / Optional Auth to track views)**
- `POST /api/restaurants/:id/products` - Add a product. **(Auth required)**
  - *Required JSON body:* `name`, `price`
  - *Optional JSON body:* `description` (defaults to empty)
- `PATCH /api/restaurants/:id/products/:pId` - Update a product. **(Auth required)**
  - *Optional JSON body:* `name`, `price`, `description` (Only send what you want to update)
- `DELETE /api/restaurants/:id/products/:pId` - Delete a product. **(Auth required)**

### Orders
- `POST /api/orders` - Create an order. **(Auth required)**
  - *Required JSON body:* `restaurantId`, `productIds` (must be an array)
- `GET /api/orders` - List user orders. **(Auth required)**
- `GET /api/orders/:id` - Get specific order details. **(Auth required)**
- `PATCH /api/orders/:id` - Update an order. **(Auth required)**
  - *Required JSON body:* `productIds` (must be an array)
- `DELETE /api/orders/:id` - Delete/cancel an order. **(Auth required)**

### Search
- `GET /api/search/:query` - Search for restaurants or products matching the query. **(Public)**

## Architecture & Design Notes

* **Environment:** NodeJS with Express framework.
* **Data Persistence:** In-memory databases using volatile data structures. Data is wiped upon server restart.
* **Error Handling:** All errors return standard HTTP status codes (400, 401, 403, 404, 500) and a consistent JSON format: `{"error": "Description of the error"}`.
* **Resource IDs:** Unique identifiers are generated on the server using timestamps and prefixes (e.g., `u_` for users, `r_` for restaurants, `p_` for products, `o_` for orders).
* **Architecture Pattern (MVC):** The server is built strictly using the Model-View-Controller (MVC) pattern.
* **Design Principles:** SOLID principles and Loose Coupling are strictly followed for modularity, testability, and future extensibility.
* **Integration:** The Express web server connects over TCP to the C++ Recommendation Server from Ex 2.

### Project Structure
```text
.
├── README.md
├── docker-compose.yml
|   ├── api/                       # Web API Server (NodeJS/Express)
│     ├── Dockerfile.api
│     ├── package.json
│     ├── package.json
│     └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
|   ├── cpp/                       # Recommendation Server (C++)
│     ├── Dockerfile
│   └── src/
└── data/                      
```
