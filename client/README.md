# Todo App - Client

This directory contains the Todo App client code.\
It provides a UI for executing CRUD operations on the todo items.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Requirements

- Node 14
- Yarn 1

## Libraries Used

- React (main frontend library)
- RTK Query (used for data fetching and management)
- MaterialUI (component library)
- MSW (API mocking)
- TypeScript (JavaScript flavor with static type checking)

## Usage

1. Run `$ yarn` to install all dependencies.
2. Copy the `.env.local` file to `.env`. There shouldn't be a need to change the values in it.\
  Note: Make sure the backend is running on the same host and port as in the `REACT_APP_API_BASE_URL`.
3. Run the tests to make sure everything working as expected `$ yarn test`.
4. Start the application in development mode `$ yarn start`.

## Possible improvements

- A new feature that would allow the user to "complete" an item from the list.\
Once the item has been completed it will move to the bottom of the list in a separate category.
- An option to sort the list by date created. At the moment they are always displayed newest to oldest.
- Toggle option that will allow the user to see "All Items" or just "Completed" or "Not completed".

## Technical debt

- Negative scenarios, such as errors thrown on the backend are not covered with the unit tests.
- All text nodes are hardcoded. Should be moved and used from a single file or other l10n solution.
- We can use MSW to mock all requests and run the application without the backend in development mode.

## Available Scripts

A list of all the available scripts you can run in this project:

### `yarn start`

This will run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn coverage`

This will run all the tests and then provide you with the coverage.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
