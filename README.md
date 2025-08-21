# Express Best Practice

A Node.js Express application demonstrating best practices for building scalable and maintainable web applications with authentication, user management, and session management using Redis.

## Features

- **Modular Structure:** Code is organized by features, making it easy to add new functionality.
- **Separation of Concerns:** Clear separation between controllers, services, models, and other components.
- **Authentication:** Using JWT for authentication with Passport.js.
- **Authorization:** Role-based access control for protecting routes.
- **Database Migrations:** Using Sequelize CLI for managing database schema changes.
- **Database Seeding:** Populating the database with initial data using Sequelize CLI.
- **Centralized Error Handling:** A global error handler to manage all application errors.
- **Request Validation:** Using Joi to validate incoming request data.
- **Logging:** Using Morgan and Winston for logging HTTP requests and application events.
- **Security:** Using Helmet to set security-related HTTP headers.

## Getting Started

### Running with Docker (Recommended)

This is the recommended way to run the application, as it sets up all the required services in a consistent environment.

#### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

#### Running the Application

1.  **Build and start the services:**
    ```bash
    docker-compose up --build -d
    ```
    This command will build the Docker image for the application and start the `app`, `db`, and `redis` services in detached mode.

2.  **Run database migrations:**
    ```bash
    docker-compose run --rm app npx sequelize-cli db:migrate
    ```

3.  **Run database seeders (optional):**
    ```bash
    docker-compose run --rm app npx sequelize-cli db:seed:all
    ```

The application will be available at `http://localhost:3000`.

#### Stopping the Application

To stop the services, run:
```bash
docker-compose down
```

### Manual Setup

If you prefer to run the application without Docker, you can follow these steps.

#### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/express-best-practice.git
   ```
2. Navigate to the project directory:
    ```bash
    cd express-best-practice
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up your environment variables by creating a `.env` file in the root of the project. You can use the `.env.example` file as a template.
    ```
    NODE_ENV=development
    PORT=3000

    # Database
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=express_best_practice_dev
    DB_PORT=5432

    # JWT
    JWT_SECRET=thisisasecret
    JWT_ACCESS_EXPIRATION_MINUTES=30

    # Redis
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

#### Database Setup

1. Make sure your PostgreSQL and Redis servers are running.
2. Run the migrations to create the database tables:
    ```bash
    npm run migrate
    ```
3. Run the seeders to populate the database with initial data:
    ```bash
    npm run seed
    ```

#### Running the Application

To run the application in development mode (with hot-reloading):

```bash
npm run dev
```

To run the application in production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /v1/auth/register`: Register a new user.
- `POST /v1/auth/login`: Login and get an access token.
- `POST /v1/auth/logout`: Logout and invalidate the access token.

### User Management (Admin only)

- `POST /v1/users`: Create a new user.
- `GET /v1/users`: Get a list of all users.
- `GET /v1/users/:userId`: Get a single user by their ID.
- `PATCH /v1/users/:userId`: Update a user's details.
- `DELETE /v1/users/:userId`: Delete a user.

### Session Management (Admin only)

- `GET /v1/sessions`: Get all active sessions.
- `DELETE /v1/sessions/:token`: Terminate a session.


## Project Structure
```
.
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── index.js
│   │   │   │   └── user.route.js
│   │   ├── controllers/
│   │   │   └── user.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   └── validators/
│   │       └── user.validator.js
│   ├── config/
│   │   ├── config.js
│   │   └── morgan.js
│   ├── models/
│   │   └── user.model.js
│   ├── services/
│   │   └── user.service.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── catchAsync.js
│   ├── app.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```
