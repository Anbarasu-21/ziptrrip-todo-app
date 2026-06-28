# Ziptrrip Tasks - Backend REST API Documentation

The backend service runs on port `5000` by default. Base path: `http://localhost:5000/api`.

---

## Todo Object Schema
Each Todo item in the system is structured as follows:

```json
{
  "id": "c1388094-1a98-4c4f-9a74-d4fbbcf9d249",
  "title": "Design Figma Mockups",
  "description": "Create the light and dark layouts for the user profile views.",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-07-15T00:00:00.000Z",
  "category": "Work",
  "createdAt": "2026-06-28T07:12:00.000Z",
  "updatedAt": "2026-06-28T07:15:30.000Z"
}
```

---

## Endpoints

### 1. Get All Todos
Returns a list of todos matching the filter queries.

* **Path**: `/todos`
* **Method**: `GET`
* **Query Parameters**:
  * `search` (string, optional): Partial match search on `title` and `description`.
  * `status` (string, optional): Filter by status: `pending` | `in-progress` | `completed`.
  * `priority` (string, optional): Filter by priority: `low` | `medium` | `high`.
  * `category` (string, optional): Filter by category tags (e.g. `Work`, `Personal`).
  * `sortBy` (string, optional): Sort by: `createdAt` | `dueDate` | `priority`.
* **Response**: `200 OK`
  ```json
  [
    {
      "id": "c1388094-1a98-4c4f-9a74-d4fbbcf9d249",
      "title": "Design Figma Mockups",
      "description": "Create the light and dark layouts.",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-07-15T00:00:00.000Z",
      "category": "Work",
      "createdAt": "2026-06-28T07:12:00.000Z",
      "updatedAt": "2026-06-28T07:15:30.000Z"
    }
  ]
  ```

---

### 2. Get Todo By ID
Retrieves details of a specific todo item.

* **Path**: `/todos/:id`
* **Method**: `GET`
* **Response (Success)**: `200 OK`
  ```json
  {
    "id": "c1388094-1a98-4c4f-9a74-d4fbbcf9d249",
    "title": "Design Figma Mockups",
    "description": "Create the light and dark layouts.",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-07-15T00:00:00.000Z",
    "category": "Work",
    "createdAt": "2026-06-28T07:12:00.000Z",
    "updatedAt": "2026-06-28T07:15:30.000Z"
  }
  ```
* **Response (Not Found)**: `404 Not Found`
  ```json
  {
    "error": "Todo item not found"
  }
  ```

---

### 3. Create Todo
Creates a new todo item and stores it.

* **Path**: `/todos`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "title": "Submit Assignment",
    "description": "Publish code to github and email the hiring team.",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-06-29",
    "category": "Urgent"
  }
  ```
* **Response (Success)**: `201 Created`
  * Contains the full created object with auto-generated `id`, `createdAt`, and `updatedAt`.
* **Response (Validation Error)**: `400 Bad Request`
  ```json
  {
    "error": "Title is required"
  }
  ```

---

### 4. Update Todo
Updates attributes of an existing todo.

* **Path**: `/todos/:id`
* **Method**: `PUT`
* **Request Body**: (all fields are optional drop-ins)
  ```json
  {
    "status": "completed",
    "priority": "medium"
  }
  ```
* **Response (Success)**: `200 OK`
  * Returns the updated todo object with updated timestamp fields.
* **Response (Not Found)**: `404 Not Found`
  ```json
  {
    "error": "Todo item not found or could not be updated"
  }
  ```

---

### 5. Delete Todo
Permanently deletes a todo item.

* **Path**: `/todos/:id`
* **Method**: `DELETE`
* **Response (Success)**: `200 OK`
  ```json
  {
    "message": "Todo item deleted successfully"
  }
  ```
* **Response (Not Found)**: `404 Not Found`
  ```json
  {
    "error": "Todo item not found"
  }
  ```
