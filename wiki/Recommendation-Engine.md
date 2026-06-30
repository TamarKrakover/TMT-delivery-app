# C++ Recommendation Engine

A core component of TMT Delivery is the high-performance **C++ Recommendation Engine** (`tmt-server`). It tracks user product interactions and uses a Collaborative Filtering algorithm to generate real-time product recommendations.

---

## 🔌 TCP Socket Communication Protocol

The Node.js Express server acts as a TCP client to the C++ server running on port `5555`. Communication uses a line-oriented string command protocol:

```
                  Node.js API                        C++ Server
                     (Port 8080)                        (Port 5555)
                          |                                  |
   Record interaction     |-------- `post userId p1 p2` ---->|
   (or updates)           |<------- `201 Created` -----------|
                          |                                  |
   Retrieve suggestions   |-------- `get userId p1` -------->|
                          |<------- `200 Ok p2 p3` ----------|
```

The C++ server supports four main commands:
* **`post <userId> <productId1> <productId2>...`**: Initializes a user profile and logs initial product interactions.
* **`patch <userId> <productId1> <productId2>...`**: Appends product interactions to an existing user profile.
* **`delete <userId> <productId1> <productId2>...`**: Removes specific product interactions from a user's profile.
* **`get <userId> <productId>`**: Computes and returns the top recommended product IDs for the user relative to the target product.

---

## 🧮 Collaborative Filtering Algorithm

The recommendations are computed dynamically in C++ (`Recommender.cpp`) using user history overlaps:

1. **Filtering Candidates**: Given a target user $A$ viewing a target product $P$, the recommender iterates through all other user profiles $B_i$ to find who has also viewed/purchased $P$.
2. **Calculating Similarity Weight**: For each candidate user $B_i$, the system calculates an overlap weight:
   $$W_i = \text{Count of items in } B_i\text{'s history that target user } A \text{ has also interacted with.}$$
3. **Scoring Recommendations**: For all items $I_k$ in $B_i$'s history:
   * Skip $I_k$ if it is the target product $P$.
   * Skip $I_k$ if user $A$ has already seen it.
   * Add $W_i$ to the recommendation score of $I_k$.
4. **Sorting & Tie-Breaking**: Items are sorted by score descending. If a tie occurs, a lexicographical tie-breaker (`NaturalCompare`) is applied to product IDs.
5. **Output**: The top 10 scoring product IDs are returned.

---

## 🔍 Recommendation Walkthrough: Moshik and User 2

This walkthrough demonstrates the recommendation engine in action as shown in the chronological screenshots:

### 1. Moshik (User 1) Activity
* **Action**: Moshik places an order containing 3 items from **Burger Palace**:
  * `Beef Burger`
  * `French Fries`
  * `Milkshake`
* **Behind the Scenes**: Node.js logs these three interactions to the C++ server:
  ```
  post moshik_id beef_burger_id fries_id milkshake_id
  ```
  Moshik's history is recorded as: `[beef_burger_id, fries_id, milkshake_id]`.

### 2. User 2 Views Beef Burger
<img src="images/1782859671142.jpg" width="300" alt="User 2 View Beef Burger" />

* **Action**: A different user, `user2`, logs in and enters the details page of the `Beef Burger`.
* **Behind the Scenes**: Node.js logs `user2` viewing `Beef Burger` and saves the interaction to the C++ server:
  ```
  post user2_id beef_burger_id
  ```
  At this stage, `user2`'s history is: `[beef_burger_id]`.

### 3. Recommendations Generation
When `user2` requests recommendations based on the `Beef Burger` page view, the C++ engine runs `recommend("user2_id", "beef_burger_id")`:
1. Find other users who have interacted with `beef_burger_id` $\rightarrow$ Found `moshik_id`.
2. Compute similarity between `user2_id` (`[beef_burger_id]`) and `moshik_id` (`[beef_burger_id, fries_id, milkshake_id]`):
   * Overlap is `beef_burger_id`.
   * Similarity weight $W = 1$.
3. Distribute weight to unseen products in Moshik's history:
   * `fries_id` score = $+1$
   * `milkshake_id` score = $+1$
4. Return recommendations: `[fries_id, milkshake_id]`.

### 4. Recommendation Rendered to User 2
<img src="images/1782859671162.jpg" width="300" alt="User 2 Recommendations" />

* **Result**: On `user2`'s Home screen under **"Recommended for you"**, the items `French Fries` and `Milkshake` are dynamically displayed. Because Moshik ordered them, and `user2` had one shared preference (`Beef Burger`), the system recommended what Moshik liked!
