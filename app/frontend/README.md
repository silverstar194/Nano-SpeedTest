#Nano Frontend
This app was created using the create-react-app. Below is a large list of useful resources and links provided by create-react-app and helps when modifying this project to our own needs.

## Testing
Currently basic unit testing of redux actions and reducers exists. Running `npm test` triggers tests to run and continue to run on file changes.

In addition, `npm test -- --coverage` (yes there are two --) will show the coverage report. Currently only `.js` files are being tested and it is specifically set to ignore additional files such as `index.js` and `serviceWorker.js`. These options can be changed in the `package.json`.

TODO: This will need to be cleaned up before release but I will leave it here for now because it will be useful when setting up the various features.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
