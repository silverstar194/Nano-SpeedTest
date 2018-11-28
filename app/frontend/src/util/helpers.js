export const convertCoordsToString = (location) => {
    return `${location.latitude},${location.longitude}`;
};

export const fetchWrapper = (url, options) => {
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
    return fetchWrapper('http://127.0.0.1:8000/transactions/statistics?count=500', {
        method: 'GET'
    }).then((data) => {
        const transactions = data.transactions.filter((transaction) => {
            return transaction.endReceiveTimestamp && transaction.endReceiveTimestamp - transaction.startSendTimestamp > 0;
        });
        transactions.forEach((transaction) => {
            transaction.elapsedTime = transaction.endReceiveTimestamp - transaction.startSendTimestamp;
        });
        const average = data.average/1000;
        return {
            pastTransactions: transactions,
            totalTransactions: data.count,
            globalAverage: average
        };
    }).catch((err) => {
        //TODO handle error
        console.warn('TODO Error in fetching stats');
    });
}