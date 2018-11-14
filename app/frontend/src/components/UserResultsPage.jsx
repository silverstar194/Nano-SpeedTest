import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import 'styles/UserResultsPage.css';

import {connect} from 'react-redux';
import PastResultsTable from 'components/HistoricalData/PastResultsTable';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

const pastResults = [
    {
        id: 1,
        origin: {
            nodeLocation: 'A'
        },
        destination: {
            nodeLocation: 'B'
        },
        amount: .009,
        startSendTimestamp: 1542138102953,
        endReceiveTimestamp: 1542138109826
    },
    {
        id: 2,
        origin: {
            nodeLocation: 'C'
        },
        destination: {
            nodeLocation: 'D'
        },
        amount: .008,
        startSendTimestamp: 1542138147900,
        endReceiveTimestamp: 1542138152088
    },
    {
        id: 3,
        origin: {
            nodeLocation: 'B'
        },
        destination: {
            nodeLocation: 'A'
        },
        amount: .001,
        startSendTimestamp: 1542138170727,
        endReceiveTimestamp: 1542138175372
    }
];

class UserStatsPage extends Component {
    state = {

    };

    render() {
        const {table, isFetchingTransaction, isFetchingTiming} = this.props;
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
        isFetchingTransaction: state.transactions.isFetchingTransaction,
        isFetchingTiming: state.transactions.isFetchingTiming
    };
};


UserStatsPage.propTypes = {
    table: PropTypes.array.isRequired,
    isFetchingTransaction: PropTypes.bool,
    isFetchingTiming: PropTypes.bool
};

export default connect(mapStateToProps)(UserStatsPage);