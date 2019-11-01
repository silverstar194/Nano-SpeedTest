import React from 'react';
import PropTypes from 'prop-types';
import 'styles/UserResultsPage.css';

import {connect} from 'react-redux';
import PastResultsTable from 'components/HistoricalData/PastResultsTable';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

const UserStatsPage = ({numToRerun, table, pastTransactions, isFetchingTransaction, isFetchingTiming}) => {
    return (
        <CurrentTransactionsView
                            numToRerun={numToRerun}
                            table={table}
                            isFetchingTiming={isFetchingTiming}
                            isFetchingTransaction={isFetchingTransaction}
        />
    );
};

const mapStateToProps = (state) => {
    return {
        numToRerun: state.table.num,
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