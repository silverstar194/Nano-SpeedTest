import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import 'styles/UserResultsPage.css';

import {connect} from 'react-redux';
import PastResultsTable from 'components/HistoricalData/PastResultsTable';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

const UserStatsPage = ({table, pastTransactions, isFetchingTransaction, isFetchingTiming}) => {
    return (
        <div className='UserStatsPage'>
            <Header/>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col'>
                        <CurrentTransactionsView
                            table={table}
                            isFetchingTiming={isFetchingTiming}
                            isFetchingTransaction={isFetchingTransaction}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <PastResultsTable tableData={pastTransactions} />
                    </div>
                </div>
            </div>
             <Footer/>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        table: state.table.tableEntries,
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