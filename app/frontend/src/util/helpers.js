import { makeToast } from 'util/toasts';

export const convertCoordsToString = (location) => {
    return `${location.latitude},${location.longitude}`;
};

export const fetchWrapper = (urlSuffix, options) => {
    const urlPrefix = process.env.NODE_ENV !== 'production' ?  'http://127.0.0.1:8000/' : process.env.REACT_APP_API_PREFIX;
    const url = urlPrefix + urlSuffix;
    return fetch(url, {
        ...options
    }).catch((err) => { // This only occurs if there is a connection error
        console.error(err);
        throw err;
    }).then((response) => {
        if (response.ok) return response.json(); //proceed normally
        // !OK means that it is a 400 or 500 so we treat it as an error and throw it
        throw response;
    });
};

export const fetchPastResults = () => {
    return fetchWrapper('transactions/statistics?count=500', {
        method: 'GET'
    }).then((data) => {
        const transactions = data.transactions.filter((transaction) => {
            return transaction.endSendTimestamp && transaction.endSendTimestamp - transaction.startSendTimestamp > 0;
        });
        transactions.forEach((transaction) => {
            transaction.elapsedTime = transaction.endSendTimestamp - transaction.startSendTimestamp;
        });
        const average = data.average/1000;
        return {
            pastTransactions: transactions,
            totalTransactions: data.count,
            globalAverage: average
        };
    }).catch((err) => {
        console.warn('Error fetching past results data');
        makeToast({
            text: 'Having Trouble Communicating with the Server',
            status: 'danger'
        });
        throw err;
    });
};