export const ADD_TRANSACTION = 'ADD_TRANSACTION';

export function addTransaction(transactionData) {
    return {
        type: ADD_TRANSACTION,
        transactionData
    };
}