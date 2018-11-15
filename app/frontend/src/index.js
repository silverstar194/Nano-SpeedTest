import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import NanoRouter from './NanoRouter';
import * as serviceWorker from './serviceWorker';

import navigation from './reducers/navigation';
import table from './reducers/table';
import transactions from './reducers/transactions';
import pastResults from './reducers/pastResults';

import rootEpic from './epics/table';
import transactionsMiddleware from './transactionsMiddleware';


// TODO - persist state so when user refreshes page, it doesn't delete state (bug: sets active tab to home, stays on
// curr)
const initialState = {
    navigation: {
        activeTab: '' // initialize the starting tab to be our default home page
    },
    table: [
         {
            id: 123,
            origin: {
                id: 2,
                nodeLocation: 'Mumbai',
                latitude: 37.785,
                longitude: -122.447
            },
            destination: {
                id: 3,
                nodeLocation: 'W. Virginia',
                latitude: 34.782,
                longitude: -132.445
            },
            amount: .009,
            completed: true,
            endReceiveTimestamp: 12345,
            startSendTimestamp: 1234
        }
    ],
    pastResults: [
        {
            id: 1,
            origin: {
                id: 3,
                nodeLocation: 'Mumbai',
                latitude: 37.785,
                longitude: -122.447
            },
            destination: {
                id: 2,
                nodeLocation: 'W. Virginia',
                latitude: 34.782,
                longitude: -132.445
            },
            amount: .009,
            startSendTimestamp: 1542138102953,
            endReceiveTimestamp: 1542138109826,
            elapsedTime: 6.873
        },
        {
            id: 2,
            origin: {
                id: 3,
                nodeLocation: 'Mumbai',
                latitude: 37.785,
                longitude: -122.447
            },
            destination: {
                id: 2,
                nodeLocation: 'W. Virginia',
                latitude: 34.782,
                longitude: -132.445
            },
            amount: .008,
            startSendTimestamp: 1542138147900,
            endReceiveTimestamp: 1542138152088,
            elapsedTime: 4.188
        },
        {
            id:3,
            origin: {
                id: 2,
                nodeLocation: 'W. Virginia',
                latitude: 34.782,
                longitude: -132.445
            },
            destination: {
                id: 3,
                nodeLocation: 'Mumbai',
                latitude: 37.785,
                longitude: -122.447
            },
            amount: .001,
            startSendTimestamp: 1542138170727,
            endReceiveTimestamp: 1542138175372,
            elapsedTime: 4.645
        }
    ]
};



// call this in order to get argument needed for applyMiddleware (when creating the store)
const epicMiddleware = createEpicMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        navigation,
        table,
        transactions,
        pastResults
    }),
    initialState,
    composeEnhancers(
        applyMiddleware(epicMiddleware, transactionsMiddleware)
    )
);

// Runs our epic (requires a 'root' epic and makes us import from one "root epics" file in order to work.  Just
// importing from epics/table rn since it is our only one so far)
epicMiddleware.run(rootEpic);

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
