# Medication Intake Tracker App Server

This is an Express.js server for the Medication Intake Tracker App. The server is containerized using Docker and connects to a PostgreSQL database.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (version 16 or later)
- **npm** or **Yarn**
- **Docker** and **Docker Compose**

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/your-repo/medication-intake-tracker-app-server.git
cd medication-intake-tracker-app-server
```

### 2. Install dependencies

```sh
# Using npm
npm install

# Or using Yarn
yarn install
```

## Running the App

### Local Development

To run the app locally without Docker:

1. **Start the server**:

   ```sh
   npm run start:dev
   ```

   or

   ```sh
   yarn start:dev
   ```

   The server will be running at `http://localhost:8090`.

### With Docker

1. **Build and run the Docker containers**:

   ```sh
   docker-compose up --build
   ```

   This command will build the Docker image for the app and start both the app container and the PostgreSQL container. The app will be accessible at `http://localhost:8090`.

### Stopping the Containers

To stop the running Docker containers:

```sh
docker-compose down
```

This will stop and remove the app and PostgreSQL containers.

## Linting and Formatting

To ensure your code follows the project's linting and formatting rules, use the following commands:

- **Lint the code**:

  ```sh
  npm run lint
  ```

  or

  ```sh
  yarn lint
  ```

- **Fix linting issues**:

  ```sh
  npm run lint:fix
  ```

  or

  ```sh
  yarn lint:fix
  ```

- **Format the code using Prettier**:

  ```sh
  npm run format
  ```

  or

  ```sh
  yarn format
  ```

## Environment Variables

Ensure you have a `.env` file at the root of your project with the required environment variables:

```env
DB_NAME=medication_tracker
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgresql
DB_PORT=5432
PORT=8090
```

## Useful Docker Commands

- **Building the image**:

  ```sh
  docker-compose build
  ```

- **Starting the containers**:

  ```sh
  docker-compose up
  ```

- **Stopping the containers**:

  ```sh
  docker-compose down
  ```

- **Viewing logs**:

  ```sh
  docker-compose logs -f
  ```

## Troubleshooting

If you encounter issues, ensure that:

- Docker and Docker Compose are correctly installed and running.
- The `.env` file contains all required environment variables.
- Ports 8090 (for the app) and 8001 (for PostgreSQL) are not being used by other services.