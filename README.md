# TMTproject - Web Server API

## About The Application

This project is a Web Server API serving as the core of a food delivery application (similar to Wolt). 
The server uses an MVC architecture and provides a RESTful API to manage users, restaurants, products, orders, and search functionality. 
All responses are formatted in JSON.

This server acts as a client to the **Product Recommendation System**, communicating via a socket connection to record user actions (e.g., viewing a product).

## Version Management from Exercise 2

The code submitted for Exercise 2 has been "locked" in a dedicated branch named `Ex2`. This ensures that the grader can evaluate the previous submission exactly as it was, and the work on Exercise 3 on the `main` branch (and its feature branches) does not overwrite or interfere with Exercise 2.

## How to Run

The application is completely containerized and managed using `Docker Compose`.

To build and start both servers, run the following command in the root directory:

```bash
docker compose build
docker compose up
```

The Web API Server will run on `http://localhost:8080`, and it will automatically connect to the C++ server.

## Execution Examples (CURL)

Here is a demonstration of interacting with the API running on `localhost:8080`:

### Registration (Users)
```bash
curl -i -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"username": "johndoe", "password": "123", "name": "John Doe", "phone": "555-1234", "address": "123 Main St"}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/users/u_1717235555_123
```

### Creating a Restaurant (Restaurants)
```bash
curl -i -X POST http://localhost:8080/api/restaurants -H "Content-Type: application/json" -d '{"name": "McDonalds", "address": "456 Burger St"}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/restaurants/r_1717235555_456
```

### Adding a Product (Products)
```bash
curl -i -X POST http://localhost:8080/api/restaurants/r_1717235555_456/products -H "Content-Type: application/json" -d '{"name": "Big Mac", "price": 5.99}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/restaurants/r_1717235555_456/products/p_1717235555_789
```

### Creating an Order (Orders)
```bash
curl -i -X POST http://localhost:8080/api/orders -H "Content-Type: application/json" -H "x-user-id: u_1717235555_123" -d '{"restaurantId": "r_1717235555_456", "productIds": ["p_1717235555_789"], "totalPrice": 5.99}'
```
**Expected Output:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/orders/o_1717235555_001
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
    "id": "p_1717235555_789",
    "restaurantId": "r_1717235555_456",
    "name": "Big Mac",
    "description": "",
    "price": 5.99
  }
]
```

## Available RESTful API Endpoints

### Authentication and Registration
- `POST /api/users` - Create a new user.
- `GET /api/users/:id` - Retrieve user details.
- `POST /api/tokens` - Login and get user token.

### Restaurants
- `GET /api/restaurants` - List all restaurants.
- `POST /api/restaurants` - Create a new restaurant.
- `GET /api/restaurants/:id` - Get specific restaurant details.
- `PATCH /api/restaurants/:id` - Edit a restaurant.
- `DELETE /api/restaurants/:id` - Delete a restaurant.

### Products
- `GET /api/restaurants/:id/products` - List restaurant products.
- `POST /api/restaurants/:id/products` - Add a product.
- `GET /api/restaurants/:id/products/:pId` - Get a specific product.
- `PATCH /api/restaurants/:id/products/:pId` - Update a product.
- `DELETE /api/restaurants/:id/products/:pId` - Delete a product.

### Orders
- `POST /api/orders` - Create an order (Auth required).
- `GET /api/orders` - List user orders (Auth required).
- `GET /api/orders/:id` - Get specific order details.
- `PATCH /api/orders/:id` - Update an order.
- `DELETE /api/orders/:id` - Delete/cancel an order.

### Search
- `GET /api/search/:query` - Search for restaurants or products matching the query.

## Architecture & Design Notes

* **Environment:** NodeJS with Express framework.
* **Data Persistence:** In-memory databases using volatile data structures. Data is wiped upon server restart.
* **Design Principles:** SOLID principles and Loose Coupling are strictly followed for modularity, testability, and future extensibility.
* **Integration:** The Express web server connects over TCP to the C++ Recommendation Server from Ex 2.

### Project Structure
```text
.
├── README.md
├── docker-compose.yml
|   ├── server/                    # Web API Server (NodeJS/Express)
│   ├── Dockerfile.server
│   ├── app.js
│   ├── package.json
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
|   ├── cpp/                       # Recommendation Server (C++)
│   ├── Dockerfile
│   └── src/
└── data/                      
```
