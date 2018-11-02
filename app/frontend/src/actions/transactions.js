export const SET_TIMING_STATUS = 'SET_TIMING_STATUS';
export const SET_TRANSACTION_STATUS = 'SET_TRANSACTION_STATUS';

export const setTimingFetchStatus = status => {
	return {
		type: SET_TIMING_STATUS,
		status
	};
};

export const setTransactionFetchStatus = status => {
	return {
		type: SET_TRANSACTION_STATUS,
		status
	};
};