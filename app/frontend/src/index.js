import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import NanoRouter from './NanoRouter';
import * as serviceWorker from './serviceWorker';

import navigation from './reducers/navigation';
import table from './reducers/table';

import rootEpic from './epics/table';


// TODO - persist state so when user refreshes page, it doesn't delete state (bug: sets active tab to home, stays on
// curr)
// const initialState = {
//     navigation: {
//         activeTab: '' // initialize the starting tab to be our default home page
//     },
//     table: []
// };
const initialState = {
    navigation: {
      activeTab: 'Stats'
    },
    table: [
      {
        id: 87,
        origin: {
          id: 2,
          nodeLocation: 'Mumbai',
          latitude: '19.014400',
          longitude: '72.847900',
          coords: {
            lat: 19.0144,
            lng: 72.8479
          }
        },
        destination: {
          id: 1,
          nodeLocation: 'N. Virginia',
          latitude: '39.043700',
          longitude: '-77.487500',
          coords: {
            lat: 39.0437,
            lng: -77.4875
          }
        },
        amount: 0.0003,
        ip: '127.0.0.1',
        index: 1,
        completed: true,
        startSendTimestamp: 1541187669362,
        endSendTimestamp: 1541187669000,
        startReceiveTimestamp: 1541187707273,
        endReceiveTimestamp: 1541187707000
      }
    ]
  }

// call this in order to get argument needed for applyMiddleware (when creating the store)
const epicMiddleware = createEpicMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        navigation,
        table
    }),
    initialState,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
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
