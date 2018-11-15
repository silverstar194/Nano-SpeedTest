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
import nodes from 'reducers/nodes';
import { reducer as formReducer } from 'redux-form';

import rootEpic from './epics/table';
import transactionsMiddleware from './transactionsMiddleware';

import {addNodes} from 'actions/nodes';


// TODO - persist state so when user refreshes page, it doesn't delete state (bug: sets active tab to home, stays on
// curr)
const initialState = {
    navigation: {
        activeTab: '' // initialize the starting tab to be our default home page
    },
    table: [
        {
            id: 266,
            origin: {
              id: 3,
              nodeLocation: 'Singapore',
              latitude: '1.293100',
              longitude: '103.850100',
              coords: '1.293100,103.850100'
            },
            destination: {
              id: 4,
              nodeLocation: 'New York',
              latitude: '40.804300',
              longitude: '-74.012100',
              coords: '40.804300,-74.012100'
            },
            amount: 0.0001,
            completed: true,
            index: 2,
            startSendTimestamp: 1542260521944,
            endReceiveTimestamp: 1542260564075,
            elapsedTime: 42131
          }
    ],
    pastResults: [
        // {
        //   id: 266,
        //   origin: {
        //     id: 3,
        //     nodeLocation: 'Singapore',
        //     latitude: '1.293100',
        //     longitude: '103.850100',
        //     coords: '1.293100,103.850100'
        //   },
        //   destination: {
        //     id: 4,
        //     nodeLocation: 'New York',
        //     latitude: '40.804300',
        //     longitude: '-74.012100',
        //     coords: '40.804300,-74.012100'
        //   },
        //   amount: 0.0001,
        //   completed: true,
        //   index: 1,
        //   startSendTimestamp: 1542260521944,
        //   endReceiveTimestamp: 1542260564075,
        //   elapsedTime: 42.131
        // },
        {
          id: 271,
          origin: {
            id: 4,
            nodeLocation: 'New York',
            latitude: '40.804300',
            longitude: '-74.012100',
            coords: '40.804300,-74.012100'
          },
          destination: {
            id: 3,
            nodeLocation: 'Singapore',
            latitude: '1.293100',
            longitude: '103.850100',
            coords: '1.293100,103.850100'
          },
          amount: 0.0001,
          completed: true,
          startSendTimestamp: 1542309149331,
          endReceiveTimestamp: 1542309189697,
          elapsedTime: 40.366,
          index: 2
        },
        {
          id: 272,
          origin: {
            id: 3,
            nodeLocation: 'Singapore',
            latitude: '1.293100',
            longitude: '103.850100',
            coords: '1.293100,103.850100'
          },
          destination: {
            id: 4,
            nodeLocation: 'New York',
            latitude: '40.804300',
            longitude: '-74.012100',
            coords: '40.804300,-74.012100'
          },
          amount: 0.0002,
          completed: true,
          index: 3,
          startSendTimestamp: 1542309181592,
          endReceiveTimestamp: 1542309193732,
          elapsedTime: 12.140
        },
        {
          id: 273,
          origin: {
            id: 3,
            nodeLocation: 'Singapore',
            latitude: '1.293100',
            longitude: '103.850100',
            coords: '1.293100,103.850100'
          },
          destination: {
            id: 4,
            nodeLocation: 'New York',
            latitude: '40.804300',
            longitude: '-74.012100',
            coords: '40.804300,-74.012100'
          },
          amount: 0.0009,
          completed: true,
          index: 4,
          startSendTimestamp: 1542309179537,
          endReceiveTimestamp: 1542309205310,
          elapsedTime: 25.773
        },
        {
          id: 274,
          origin: {
            id: 3,
            nodeLocation: 'Singapore',
            latitude: '1.293100',
            longitude: '103.850100',
            coords: '1.293100,103.850100'
          },
          destination: {
            id: 4,
            nodeLocation: 'New York',
            latitude: '40.804300',
            longitude: '-74.012100',
            coords: '40.804300,-74.012100'
          },
          amount: 0.0005,
          completed: true,
          index: 5,
          startSendTimestamp: 1542309218162,
          endReceiveTimestamp: 1542309218900,
          elapsedTime: .738
        },
        {
          id: 275,
          origin: {
            id: 4,
            nodeLocation: 'New York',
            latitude: '40.804300',
            longitude: '-74.012100',
            coords: '40.804300,-74.012100'
          },
          destination: {
            id: 3,
            nodeLocation: 'Singapore',
            latitude: '1.293100',
            longitude: '103.850100',
            coords: '1.293100,103.850100'
          },
          amount: 0.0001,
          completed: true,
          index: 6,
          startSendTimestamp: 1542309208790,
          endReceiveTimestamp: 1542309222433,
          elapsedTime: 13.643
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
        pastResults,
        nodes,
        form: formReducer
    }),
    initialState,
    composeEnhancers(
        applyMiddleware(epicMiddleware, transactionsMiddleware)
    )
);

// Runs our epic (requires a 'root' epic and makes us import from one "root epics" file in order to work.  Just
// importing from epics/table rn since it is our only one so far)
epicMiddleware.run(rootEpic);

fetch('http://127.0.0.1:8000/nodes/list', {
    method: 'GET'
}).then((response) => {
    if (response.ok) return response.json();
    debugger;
    return {
        error: true
    };
}).then((data) => {
    store.dispatch(addNodes(data.nodes));
}).catch((err) => {
	debugger;
	console.error(err);
});

fetch('http://127.0.0.1:8000/transactions/statistics?count=150', {
    method: 'GET'
}).then((response) => {
    if (response.ok) return response.json();
    debugger;
    return {
        error: true
    };
}).then((data) => {
	console.log(data.transactions)
    // debugger;
}).catch((err) => {
	debugger;
	console.error(err);
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
