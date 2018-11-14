import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import 'styles/UserResultsPage.css';

import {connect} from 'react-redux';
import PastResultsTable from 'components/HistoricalData/PastResultsTable';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

class UserStatsPage extends Component {
    state = {

    };

    render() {
        const {table, pastResults, isFetchingTransaction, isFetchingTiming} = this.props;
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
                            <PastResultsTable tableData={pastResults} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        table: state.table,
        pastResults: state.pastResults,
        isFetchingTransaction: state.transactions.isFetchingTransaction,
        isFetchingTiming: state.transactions.isFetchingTiming
    };
};


UserStatsPage.propTypes = {
    table: PropTypes.array.isRequired,
    pastResults: PropTypes.array.isRequired,
    isFetchingTransaction: PropTypes.bool,
    isFetchingTiming: PropTypes.bool
};

export default connect(mapStateToProps)(UserStatsPage);