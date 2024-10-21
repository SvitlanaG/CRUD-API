# CRUD-API

This is a simple CRUD (Create, Read, Update, Delete) API for managing users, built with Node.js and TypeScript. The API allows you to perform various operations on user records such as adding new users, retrieving user information, updating user details, and deleting users.

## Features

- Retrieve a list of all users
- Get user details by ID
- Create a new user
- Update user information
- Delete a user by ID
- Handles invalid input and errors gracefully

## Cloning the Application and Running It

To clone this application and run it, follow these steps:

1. **Clone the repository**:
   Open your terminal and run the following command to clone the repository to your local machine:
   ```bash
   git clone https://github.com/SvitlanaG/CRUD-API.git
   cd CRUD-API
   ```
2. **Install dependencies**:
   Ensure you have Node.js installed. After navigating to the project directory, install the required dependencies by running:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Create a .env file in the root directory of the project and add the following line:
   ```bash
   PORT=4000
   ```
4. **Running the Application**: You can run the application in different environments using the following npm scripts:

- **_Development Mode_**: To run the application in development mode with automatic reloading, use:

  ```bash
  npm run start:dev
  ```

- **_Production Build_**: To compile the TypeScript files into JavaScript and prepare for production, run:

  ```bash
  npm run build
  ```

- **_Start in Production Mode_**: To start the application in production mode, execute:

  ```bash
  npm run start:prod
  ```

- **_Start in Multi-threaded Mode_**: To start the application with a load balancer, execute:

  ```bash
  npm run start:multi
  ```

5. **Running Tests**: To run the tests in watch mode, use:
   ```bash
   npm test
   ```
