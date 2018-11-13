import React, {Component, Fragment} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import '../styles/StatsPage.css';
import Map from './Map';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import {connect} from 'react-redux';
import PastResultsTable from './PastResultsTable';

const loader = (
    <div className='loading-container'>
    <div className='loader-container d-flex justify-content-center'>
        <div className='loader'></div>
    </div>
    <div>
        <p>Your transaction is processing. Please wait.</p>
    </div>
</div>
);



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
]

class StatsPage extends Component {
    state = {

    };

    render() {
        const {table, isFetchingTiming, isFetchingTransaction} = this.props;
        const mostRecent = table.length && table[table.length - 1];
        const sendMessage = mostRecent.completed ? 'Sent' : 'Sending';
        // render the jsx
        const errorMessage = (mostRecent && mostRecent.error && !isFetchingTransaction) ?
            <div className='alert alert-danger' role='alert'>
                Something went wrong while trying to get the transaction. Please try again
            </div>
            : null;

        return (
            <div className='StatsPage'>
                <Header/>
                {errorMessage} {/** Displays an error message if fetching the transaction fails **/}
                { (isFetchingTransaction || mostRecent || isFetchingTiming) &&  // this is pretty ugly and should be refactored in V2
                    <Fragment>{
                        (isFetchingTransaction || !mostRecent) ? loader // show loader if no data or is getting a transaction
                        : (<Fragment>
                            <Table tableData={table}/>
                            <h2 className='map-header page-header text-left'>
                            {sendMessage} from {mostRecent.origin.nodeLocation} to {mostRecent.destination.nodeLocation}
                            { isFetchingTiming &&
                                <Fragment>
                                    <p/>
                                    This can take upwards of 30 seconds so please be patient!
                                </Fragment>
                            }
                            </h2>
                            <div className='nano-container map-container'>
                                <Map {...mostRecent}/>
                            </div>

                        </Fragment>
                        )
                    }</Fragment>
                }
                <PastResultsTable tableData={pastResults} />
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


StatsPage.propTypes = {
    table: PropTypes.array.isRequired,
    isFetchingTransaction: PropTypes.bool,
    isFetchingTiming: PropTypes.bool
};

export default connect(mapStateToProps)(StatsPage);