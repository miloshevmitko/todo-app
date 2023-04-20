# Todo App - Server

This directory contains the Todo App server code.\
It provides a RESTful API for executing CRUD operations on the todo items.

This project is using the [Express](https://expressjs.com/) framework to create the REST endpoints and MongoDB for storing the items.\
The database is located on Mongo Atlas cloud so all you need to provide is a connection string in the environment variables to connect to it.

## Requirements

- Node 18
- Yarn 1
- [Docker Desktop >= v4](https://docs.docker.com/desktop/)
- [Docker Compose v2](https://docs.docker.com/compose/)
- [Docker Engine >= v20](https://docs.docker.com/engine)

## Usage

1. Run `$ yarn` to install all dependencies.
2. Copy the `.env.local` file to `.env`. There shouldn't be a need to change the values in it.\
  Note: If you make changes to the `SERVER_PORT` or `SERVER_NAMESPACE` you will need to update the `REACT_APP_API_BASE_URL` variable in the client.
3. Run the tests to make sure everything working as expected `$ yarn test`.
4. Start the application in development mode `$ yarn start`.

To start the application using docker run the following commant in the `./server` directory:

`$ docker compose up --build`

Once the server is running (either with docker or standalone) it will support live-updates and will be available on [http://localhost:9001](http://localhost:9001) 

## Technical debt

- It's missing a proper error handling and logging.
- A few more tests are required.

## Available Scripts

A list of all the available scripts you can run in this project:

### `yarn start`

This will run the app in the development mode.\
With the default settings the server will run on [http://localhost:9001](http://localhost:9001)

It uses `nodemon` to support live-reload to reflect all updates as you make them.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn coverage`

This will run all the tests and then provide you with the coverage.

### `yarn build`

Makes a production ready build of the code (outputs to the `build` folder).
After creating the build you can run `yarn start:prod` to run the app from the build code.
