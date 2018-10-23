import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'react-redux';
import { Provider } from 'react-redux';
import NanoRouter from './NanoRouter';
import * as serviceWorker from './serviceWorker';

// TODO - uncomment once we have a reducer to pass in as first arg
// const store = createStore(
//     combineReducers({
//         // reducers
//     }),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

const root = (
    // <Provider store={store}>
        <NanoRouter />
    // </Provider>
);

ReactDOM.render(root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
