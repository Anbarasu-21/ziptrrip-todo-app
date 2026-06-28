# Features and Functionalities Documentation

This document describes all implemented functionalities and features of the **Ziptrrip Tasks** application.

---

## 1. Backend REST API Features
Implemented using **Node.js** and **Express.js**, storing structured data in `backend/data/todos.json`.

- **Get All Todos (`GET /api/todos`)**:
  - Retrieves all todos.
  - Supports query param filtering: `status` (pending/in-progress/completed), `priority` (low/medium/high), and `category`.
  - Supports query param searching: `search` (partial text matches in title or description).
  - Supports query param sorting: `sortBy` (`createdAt` descending, `dueDate` ascending, `priority` descending weight).
- **Get Todo By ID (`GET /api/todos/:id`)**:
  - Retrieves a single todo's full metadata. Returns `404 Not Found` if the ID does not exist.
- **Create Todo (`POST /api/todos`)**:
  - Adds a new task. Validates that `title` is provided (returns `400 Bad Request` if blank).
  - Automatically generates a unique `id` (using UUID v4) and timestamps (`createdAt`, `updatedAt`).
- **Update Todo (`PUT /api/todos/:id`)**:
  - Updates title, description, status, priority, due date, or category.
  - Automatically keeps `createdAt` original timestamp intact and updates `updatedAt` to the current time.
- **Delete Todo (`DELETE /api/todos/:id`)**:
  - Permanently removes the todo from file store. Returns `404 Not Found` if the ID is missing.

---

## 2. Frontend User Interface Features
Built with **React** inside a **Vite Multi-Page Application (MPA)** architecture.

### Page 1: Todo List Dashboard (`index.html`)
The main dashboard serves as the central control panel for task tracking.
- **Task Creation Panel (Sidebar)**:
  - Full-featured form to add tasks.
  - Controls: Title, optional Description, Priority selector, Category tag selector, and Due Date picker.
  - Form validation: Prevents submission without a title.
- **Filters & Search Panel**:
  - **Dynamic Search**: Live search filtering tasks by matching text in title/description.
  - **Status Filter**: Dropdown options for *All Statuses*, *Pending*, *In Progress*, and *Completed*.
  - **Priority Filter**: Dropdown options for *Low*, *Medium*, and *High*.
  - **Category Filter**: Dropdown options for tags like *Work*, *Personal*, *Shopping*, *Finance*, etc.
  - **Sorting**: Quick toggles to sort by *Date Created*, *Due Date*, or *Priority weight*.
- **Todo Grid**:
  - Responsive cards adjusting to screen resolutions.
  - Fast Completion Toggle: Click the status circle directly on the card to toggle between *completed* and *pending*.
  - Visual Badges: Distinct visual indicator badges for priority, status, category, and due date.
  - Hover Animations: Fluid scale transitions (+1.02x elevation and hover border highlighting).
  - Delete Action: Quick-delete button prompting browser confirmation.
  - Details Link: Direct button leading to Page 2.

### Page 2: Todo Details Page (`todo.html`)
A standalone page dedicated to viewing and updating a single task.
- **Query Parameter Loading**: Reads the `?id=<id>` query parameter, initiating an API call to load specific details.
- **Detailed Metadata Info Sidebar**:
  - Displays the task Category and Due Date with icons.
  - Displays original `Created At` and last `Updated At` date/times.
- **Detailed Title & Content View**:
  - Renders priority and status badges.
  - Renders long description text inside a dedicated block preserving white-spaces.
- **Toggled Edit Mode**:
  - Clicking "Edit Task" transforms the details page into a comprehensive update form inline.
  - Users can change all attributes and click "Save" to commit or "Cancel" to revert.
- **Back Navigation**:
  - Clickable navigation button to safely return back to the main list dashboard.

---

## 3. UI/UX & Aesthetic Features
- **Modern Color Palette**: Sleek Indigo/Purple design theme with tailored, accessible alert colors (red for danger, green for success, amber for warning).
- **Responsive Fluid Layout**: Standard CSS Grid structures converting automatically from sidebar layouts on desktop to linear stack layouts on mobile devices.
- **Theme Switcher (Dark/Light)**:
  - Persists selected theme inside browser `localStorage`.
  - Appies `data-theme="dark"` attribute to the document element, adapting variable properties immediately with smooth animations.
- **Empty States**: Friendly illustration and helper instructions when there are no tasks matching query parameters.
- **Robust Error Catching**: Displays distinct warning banner notifications with a retry button if the backend server goes offline.
