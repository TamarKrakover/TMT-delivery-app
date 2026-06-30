# Search & Navigation

The application provides a flexible search system that scans the MongoDB database for matches in both restaurant information (names/descriptions) and individual product items.

---

## 🔍 Search Bar & Search Page Flow

The search input is located prominently in the navigation structure of the homepage.

### 1. Navigating to the Search Input
<img src="images/1782859671073.jpg" width="300" alt="Search Icon" />

* Clicking the search bar or search tab in the navigation bar takes the user to the search input screen.

### 2. Typing a Query
<img src="images/1782859671096.jpg" width="300" alt="Search Input" />

* The user types a query (e.g., "burger") into the search banner. The input triggers search handlers in the frontend.

### 3. Search Results (Matching Restaurants & Products)
<img src="images/1782859671123.jpg" width="300" alt="Search Results" />

* The API queries MongoDB, searching both the Restaurants collection and Products collection for name or description matches containing the search term. The Search Screen displays matching restaurants as well as individual dishes matching the query, allowing users to tap and open products directly from the search results.
