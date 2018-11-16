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
import {addPastResults} from 'actions/pastResults';


// TODO - persist state so when user refreshes page, it doesn't delete state (bug: sets active tab to home, stays on
// curr)
const initialState = {
    navigation: {
        activeTab: '' // initialize the starting tab to be our default home page
    }
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
	const transactions = data.transactions.filter((transaction) => transaction.endReceiveTimestamp);
	transactions.forEach((transaction) => {
		transaction.amount = parseFloat(transaction.amount);
		transaction.elapsedTime = transaction.endReceiveTimestamp - transaction.startSendTimestamp;
	});
	debugger;
	store.dispatch(addPastResults(transactions));
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
