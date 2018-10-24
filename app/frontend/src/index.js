import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers, createStore} from 'redux';
import { Provider } from 'react-redux';
import NanoRouter from './NanoRouter';
import * as serviceWorker from './serviceWorker';

import navigation from './reducers/navigation';

const initialState = {
    navigation: {
        activeTab: '' // initialize the starting tab to be our default home page
    }
}

const store = createStore(
    combineReducers({
        navigation
    }),
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const root = (
    <Provider store={store}>
        <NanoRouter />
    </Provider>
);

ReactDOM.render(root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
