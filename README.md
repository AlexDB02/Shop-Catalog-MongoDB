![enter image description here](https://web.gcompostela.org/wp-content/uploads/2022/10/Universidad-La-DeLa-Salle-Bajio-logo.png)
# Clothing Stores
## Final Project for Geo-Referenced Systems.

### Team Members:
* Becerra Díaz Alejandro.
* González Hernández Juan Pablo.
* Núñez Guerrero Melanie Guadalupe.
* Peña Bravo María Cecilia.
* Trujillo Ramírez César Andrés.
### Professor Frausto Ramírez Juan de Dios.
#### 12/11/2024.
##### Software Engineering and Computer Systems - 712.

---

## **Index**

1. [Introduction](#clothing-stores)  
2. [Application Description](#application-description)  
3. [Technologies Used and Prerequisites](#technologies-used-and-prerequisites)  
4. [Environment Variable Configuration](#environment-variable-configuration)  
5. [Running the Project with Docker](#running-the-project-with-docker)  
6. [Project Structure](#project-structure)  
7. [Roles in the Application](#roles-in-the-application)  
   - [Client Users](#client-users)  
   - [Administrators](#administrators)  
8. [Role Comparison Table](#role-comparison-table)  
9. [Data Model](#data-model)  
   - [User Entity](#user-entity)  
   - [Category Entity](#category-entity)  
   - [Store Entity](#store-entity)  
   - [Branch Entity](#branch-entity)  
   - [Product Entity](#product-entity)  
10. [Relationships](#relationships)  
11. [General Endpoints for Postman](#general-endpoints-for-postman)  
   - [Categories](#categories)  
   - [Stores](#stores)  
   - [Branches](#branches)  
   - [Products](#products)  
   - [Users](#users)  
12. [Search Endpoints with Filters](#search-endpoints-with-filters)  
13. [Filters and Details Connection](#filters-and-details-connection)  
14. [Flutter Screens per Entity](#flutter-screens-per-entity)  
   - [Categories](#categories-1)  
   - [Stores](#stores-1)  
   - [Branches](#branches-1)  
   - [Products](#products-1)  
   - [Users](#users-1)  
15. [Screen Interaction Flow](#screen-interaction-flow)  
16. [Functional Requirements Clarification](#functional-requirements-clarification)  
17. [Summary](#summary)

---

## **Application Description**

The application is a mobile catalog that allows users to explore clothing stores organized by style categories. It provides functionalities to locate branches on a map, browse product catalogs, and manage user profiles. Administrators have full access to tools for managing categories, stores, branches, and products.

---

## **Technologies Used and Prerequisites**

The project uses the following technologies:
- **Node.js**: For building the RESTful API.
- **MongoDB**: NoSQL database used to store categories, stores, branches, products, and users.
- **Docker**: For containerizing the application to simplify deployment.
- **Postman**: Tool for testing API endpoints.
- **Express.js**: Framework for managing routes and backend logic.

---

## **Environment Variable Configuration**

The following environment variables are required to run the application:

| **Variable**               | **Description**                                             |
|----------------------------|-----------------------------------------------------------|
| `PORT`                     | Port on which the API will run (default `3000`).           |
| `MONGODB_URI`              | MongoDB connection URL.                                    |
| `EMAIL_SERVICE`            | Email service provider (e.g., `gmail`).                   |
| `EMAIL_USER`               | Email service user.                                        |
| `EMAIL_PASS`               | Email service password.                                    |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username.                                   |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password.                                   |

---

## **Running the Project with Docker**

1. **Prerequisites:**
   - Ensure Docker is installed on your system.

2. **Build the image:**
   ```bash
   docker build -t shop-catalog-api .
   ```

3. **Run the container:**
   ```bash
   docker run -d -p 3000:3000 --name shop-catalog-api --env-file .env shop-catalog-api
   ```

4. **Environment variables in Docker:**
   - Ensure all necessary variables are defined in a `.env` file in the same directory as `docker-compose.yml`.

5. **Additional commands:**
   - **Stop the container:**
     ```bash
     docker stop shop-catalog-api
     ```
   - **Remove the container:**
     ```bash
     docker rm shop-catalog-api
     ```

---

## **Project Structure**

The project is organized as follows:
```
/controllers
/models
/routes
/utils
.env
docker-compose.yml
package.json
```

---

## **Roles in the Application**

### **Client Users**
- **Permissions:**
  - View categories, stores, branches, and products.
  - Full CRUD over their profile:
    - Create, view, update, and delete their account.
- **Registration:**
  - Users register directly from the mobile application.
- **Restrictions:**
  - Cannot modify categories, stores, branches, or products.
  - No access to administrative functionalities or other users' data.

---

### **Administrators**
- **Permissions:**
  - Full CRUD over all entities:
    - Categories, stores, branches, and products.
    - Users: List, view, and delete users as necessary.
- **Registration:**
  - Administrators are registered via code or by the development team.
- **Restrictions:**
  - Cannot register or edit their own role as administrators.
  - Limited to operating within the system's scope (no access to external protected data).

---

## **Role Comparison Table**

| **Functionality**           | **Client User** | **Administrator** |
|-----------------------------|-----------------|-------------------|
| View categories             | ✔️              | ✔️               |
| View stores                 | ✔️              | ✔️               |
| View branches               | ✔️              | ✔️               |
| View products               | ✔️              | ✔️               |
| CRUD on own profile         | ✔️              | ✔️               |
| CRUD on categories          | ❌              | ✔️               |
| CRUD on stores              | ❌              | ✔️               |
| CRUD on branches            | ❌              | ✔️               |
| CRUD on products            | ❌              | ✔️               |
| User management             | ❌              | ✔️ (list, view, delete) |

---

## **Data Model**

### **User Entity**
- `id`: UUID (Primary Key).  
- `email`: String.  
- `password`: String.  
- `name`: String.  
- `role`: Enum (`client`, `admin`).  
- `image`: String (Profile image URL).  

### **Category Entity**
- `id`: UUID (Primary Key).  
- `name`: String.  
- `description`: String.  
- `image`: String (Representative image URL).  

### **Store Entity**
- `id`: UUID (Primary Key).  
- `name`: String.  
- `description`: String.  
- `category_id`: UUID (Foreign key to `Category`).  
- `main_address`: String.  
- `main_phone`: String.  
- `website`: String.  
- `image`: String (URL of the image).  

### **Branch Entity**
- `id`: UUID (Primary Key).  
- `store_id`: UUID (Foreign key to `Store`).  
- `name`: String.  
- `address`: String.  
- `latitude`: Float.  
- `longitude`: Float.  
- `services`: Array[String].  
- `schedules`: JSON (Opening and closing hours by day).  
- `image`: String (Image URL).  

#### **`schedules` example in JSON**
```json
{
  "schedules": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" },
    "wednesday": { "open": "09:00", "close": "18:00" },
    "thursday": { "open": "09:00", "close": "18:00" },
    "friday": { "open": "09:00", "close": "18:00" },
    "saturday": { "open": "10:00", "close": "14:00" },
    "sunday": null
  }
}
```
---

### **Product Entity**
- `id`: UUID (Primary Key).  
- `store_id`: UUID (Foreign key to `Store`).  
- `name`: String.  
- `description`: String.  
- `price`: Float.  
- `image`: String (Image URL).  

---

## **Relationships**

1. **Category - Stores:**  
   - A category has multiple stores (`category_id`).  
2. **Store - Branches:**  
   - A store has multiple branches (`store_id`).  
3. **Store - Products:**  
   - A store has multiple products (`store_id`).  

---

## **General Endpoints for Postman**

### **Base route**
http://fashionfinder.ddns.net:3000/api/

### **Categories**
1. **List all categories:**  
   - **GET** `/categories`  
2. **View a specific category:**  TO-DO. Available in filter feature.
   - **GET** `/categories/:id`  
3. **Create a new category:**  
   - **POST** `/categories` (Admin only).  
4. **Update a category:**  
   - **PUT** `/categories/:id` (Admin only).  
5. **Delete a category:**  
   - **DELETE** `/categories/:id` (Admin only).  

---

### **Stores**
1. **List all stores:**  
   - **GET** `/stores`  
2. **List stores by category:**  
   - **GET** `/categories/:id/stores`  
3. **View store details:**  
   - **GET** `/stores/:id`  
4. **Create a new store:**  
   - **POST** `/stores` (Admin only).  
5. **Update a store:**  
   - **PUT** `/stores/:id` (Admin only).  
6. **Delete a store:**  
   - **DELETE** `/stores/:id` (Admin only).  

---

### **Branches**
1. **List all branches:**  
   - **GET** `/branches`  
2. **List branches of a specific store:**  TO-DO. Available in filter feature.
   - **GET** `/stores/:id/branches`  
3. **View branch details:**  
   - **GET** `/branches/:id`  
4. **Create a new branch:**  
   - **POST** `/branches` (Admin only).  
5. **Update a branch:**  
   - **PUT** `/branches/:id` (Admin only).  
6. **Delete a branch:**  
   - **DELETE** `/branches/:id` (Admin only).  

---

### **Products**
1. **List all products:**  
   - **GET** `/products`  
2. **List products by store:**  TO-DO. Available in filter feature.
   - **GET** `/stores/:id/products`  
3. **View product details:**  
   - **GET** `/products/:id`  
4. **Create a new product:**  
   - **POST** `/products` (Admin only).  
5. **Update a product:**  
   - **PUT** `/products/:id` (Admin only).  
6. **Delete a product:**  
   - **DELETE** `/products/:id` (Admin only).  

---

### **Users**
1. **Register a new user:**  
   - **POST** `/users/register`  
2. **View user profile:**  
   - **GET** `/users/me`  
3. **Update user profile:**  
   - **PUT** `/users/me`  
4. **Delete user profile:**  
   - **DELETE** `/users/me`  
5. **List all users:**  
   - **GET** `/users` (Admin only).  
6. **View a specific user:**  
   - **GET** `/users/:id` (Admin only).  

---

## **Search Endpoints with Filters**

1. **List all (stores, branches, products):**  
   - **GET** `/search?type=<type>&query=<query>`  
     This endpoint filters by type (`stores`, `branches`, `products`) and search criteria (`query`).

   **Examples:**
   - `/search?type=stores&query=H&M`: Returns all stores named "H&M".  
   - `/search?type=branches&query=Blvd.`: Returns branches with "Blvd." in their address.  
   - `/search?type=products&query=shirt`: Returns products containing "shirt" in their name.  

2. **View search result details:**  
   - **GET** `/search/:id`  
     Returns the details of the selected item (store, branch, or product).  

---

## **Filters and Details Connection**

1. **Redirect logic:**
   - If it’s a **store**:  
     Redirects to `/stores/:id` to view store details and related branches and products.
   - If it’s a **branch**:  
     Redirects to `/branches/:id` to view location, services, and schedule.
   - If it’s a **product**:  
     Redirects to `/products/:id` to view description, price, and associated store.

2. **Interactive Cards:**
   - Each card in the search results links to the corresponding detailed endpoint.

3. **Flow Example:**
   - User searches for "Zara" → Selects a store card → Redirected to `/stores/:id` → Views the product catalog and branches.  

---

## **Flutter Screens per Entity**

### **Categories**
1. **Category Listing Screen:**  
   - Displays cards with icons, names, and descriptions.  
   - Admin-only buttons for Create, Edit, Delete.

2. **Category Form Screen:**  
   - Admin-only screen to create/edit categories.  
   - Fields: Name, Description, Image.  

---

### **Stores**
1. **Store Listing Screen:**  
   - Displays cards with store names, categories, and addresses.  
   - Admin-only buttons for Create, Edit, Delete.  

2. **Store Detail Screen:**  
   - Displays detailed information about the store.  
   - Includes buttons to view products and branches.

3. **Store Form Screen:**  
   - Admin-only screen to create/edit stores.  
   - Fields: Name, Category, Address, Phone, Image, Website.  

---

### **Branches**
1. **Branch Listing Screen:**  
   - Displays cards with branch names and addresses.  
   - Admin-only buttons for Create, Edit, Delete.  

2. **Branch Detail Screen:**  
   - Displays branch location, services, and schedule.  
   - Includes an interactive map.

3. **Branch Form Screen:**  
   - Admin-only screen to create/edit branches.  
   - Fields: Name, Address, Latitude, Longitude, Services, Image.  

---

### **Products**
1. **Product Listing Screen:**  
   - Displays cards with product names, prices, and descriptions.  
   - Admin-only buttons for Create, Edit, Delete.  

2. **Product Detail Screen:**  
   - Displays product details, such as description, price, and store.  

3. **Product Form Screen:**  
   - Admin-only screen to create/edit products.  
   - Fields: Name, Price, Description, Image, Store Association.  

---

### **Users**
1. **User Registration Screen:**  
   - Form for creating a new user account.  

2. **User Profile Screen:**  
   - Displays user data with options to edit or delete the account.  

---

## **Screen Interaction Flow**

1. **Category selection:**  
   - User selects a category → Navigates to related stores.  

2. **Store selection:**  
   - User selects a store → Navigates to store details → Views product catalog or branches.  

3. **Branch or Product selection:**  
   - User selects a branch or product → Navigates to corresponding details.  

---

## **Functional Requirements Clarification**

1. View and list all categories.  
2. View category details, including related stores.  
3. Create, edit, and delete categories (Admin only).  
4. View and list all stores.  
5. Filter stores by category.  
6. View store details, including catalog and branches.  
7. Create, edit, and delete stores (Admin only).  
8. View and list all branches.  
9. View branch details, including location, services, and schedules.  
10. Create, edit, and delete branches (Admin only).  
11. View and list all products.  
12. Filter products by store.  
13. View product details, including name, price, and description.  
14. Create, edit, and delete products (Admin only).  
15. Register, edit, and delete user profiles (clients only for their own profile).  
16. List and delete users (Admin only).  
17. Conduct general searches with filters for stores, branches, or products.  
18. Redirect search results to detailed entity views.  
19. Navigate from categories to stores, branches, and products hierarchically.  
20. Display branch locations on an interactive map.  
21. Design **at least 4** intuitive screens for each entity and function.  

---

## **Summary**

The application acts as a directory of clothing stores organized by style categories. Users can explore all local stores offering a specific style. Upon selecting a store, detailed information, including geographic location, product catalog, and available branches, is displayed. For example, selecting the "Formal Wear" category might list stores like Zara, H&M, and Calvin Klein. Clicking Zara reveals its catalog and branches, with branch selection providing specific location details.

---
