import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import NanoRouter from './NanoRouter';
import * as serviceWorker from './serviceWorker';

import table from './reducers/table';
import transactions from './reducers/transactions';
import pastResults from './reducers/pastResults';
import nodes from 'reducers/nodes';
import { reducer as formReducer } from 'redux-form';
import ads from 'reducers/ads';
import toasts from 'reducers/toasts';

import rootEpic from './epics/table';
import transactionsMiddleware from './middleware/transactionsMiddleware';

import fetchAndUpdateAd from 'util/fetchAndUpdateAd';
import { addNodes } from 'actions/nodes';
import { addPastResults } from 'actions/pastResults';

import { fetchWrapper, fetchPastResults } from 'util/helpers';
import { initToastStore, makeToast } from 'util/toasts';


import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { createMiddleware } from 'redux-beacon';
import GoogleAnalytics, { trackEvent } from '@redux-beacon/google-analytics';


const history = createHistory();

// Redux Beacon --->
const eventsMap = {
    SWITCH_TAB: trackEvent(action => ({
        category: 'tabs',
        action: 'Active tab changed',
    })),

    FETCH_TRANSACTION: trackEvent(action => ({
        category: 'transactions',
        action: 'Go button clicked',
    })),

    ADV_SETTINGS_OPENED: trackEvent(action => ({
        category: 'advSettings',
        action: 'Advanced settings modal opened',
    })),
};

const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
// <--- Redux Beacon

const initialState = {};

// call this in order to get argument needed for applyMiddleware (when creating the store)
const epicMiddleware = createEpicMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        table,
        transactions,
        pastResults,
        nodes,
        form: formReducer,
        routerReducer,
        ads,
        toasts
    }),
    initialState,
    composeEnhancers(
        applyMiddleware(epicMiddleware, transactionsMiddleware, gaMiddleware, routerMiddleware(history))
    )
);

// Runs our epic (requires a 'root' epic and makes us import from one 'root epics' file in order to work.  Just
// importing from epics/table rn since it is our only one so far)
epicMiddleware.run(rootEpic);

initToastStore(store);

fetchAndUpdateAd(store);

fetchWrapper('nodes/list', {
    method: 'GET'
}).then((data) => {
    store.dispatch(addNodes(data.nodes));
}).catch((err) => {
    console.warn('Error while fetching nodes');
    makeToast({
        text: 'Having Trouble Communicating with the Server',
        status: 'danger'
    });
});

fetchPastResults()
.then((response) => {
    store.dispatch(addPastResults({...response}));
});

const root = (
    <Provider store={store}>
        <NanoRouter/>
    </Provider>
);

ReactDOM.render(root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
