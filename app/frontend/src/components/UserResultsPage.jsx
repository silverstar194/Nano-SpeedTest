import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

const UserStatsPage = ({numToRerun, table, pastTransactions, isFetchingTransaction, isFetchingTiming}) => {
    return (
        <CurrentTransactionsView
                            table={table}
                            isFetchingTiming={isFetchingTiming}
                            isFetchingTransaction={isFetchingTransaction}
        />
    );
};

const mapStateToProps = (state) => {
    return {
        table: state.table.rows,
        pastTransactions: state.pastResults.pastTransactions,
        isFetchingTransaction: state.transactions.isFetchingTransaction,
        isFetchingTiming: state.transactions.isFetchingTiming
    };
};


UserStatsPage.propTypes = {
    table: PropTypes.array.isRequired,
    pastTransactions: PropTypes.array.isRequired,
    isFetchingTransaction: PropTypes.bool,
    isFetchingTiming: PropTypes.bool
};

export default connect(mapStateToProps)(UserStatsPage);