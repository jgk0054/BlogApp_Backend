# Backend README

## Project
**Blogging Application - Backend**

## Libraries/Frameworks
- Express
- Bcrypt
- JSON Web Tokens (JWT)

## Key Modules

### authRoutes.js
- **Purpose**: Defines authentication-related routes.
- **Endpoints**:
  - `/login` (POST): For user login.
  - `/register` (POST): For user registration.
  - `/user/:id` (GET): Fetches user details by ID.

### authController.js
- **Purpose**: Handles the logic for user login, registration, and fetching user details by ID.

### auth.js
- **Purpose**: Middleware to check for a valid token and user authentication.

### userModel.js
- **Purpose**: Provides a class `User` that interacts with the database for user-related operations.
- **Methods**:
  - `findUserByUsername(username)`: Fetches a user by their username.
  - `findById(id)`: Fetches a user by their ID.
  - `createUser(...)`: Inserts a new user into the database.
