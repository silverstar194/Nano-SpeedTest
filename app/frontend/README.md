# Nano Frontend
This app was created using the create-react-app. Below are instructions on how to get started and other useful resources.

## Table of Contents

- [Getting Started](#getting-started)
  - [npm start](#npm-start)
- [Testing](#testing)

For the project to build, **these files must exist with exact filenames**:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br>
Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

## Getting Started
1. Clone this repo by running `git clone https://github.com/silverstar194/Nano-SpeedTest.git`
2. Install node in order to use `npm` commands - `brew install node` (install here for windows: https://nodejs.org/en/)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Testing
Currently basic unit testing of redux actions and reducers exists. Running `npm test` triggers tests to run and continue to run on file changes.

In addition, `npm test -- --coverage` (yes there are two --) will show the coverage report. Currently only `.js` files are being tested and it is specifically set to ignore additional files such as `index.js` and `serviceWorker.js`. These options can be changed in the `package.json`.
