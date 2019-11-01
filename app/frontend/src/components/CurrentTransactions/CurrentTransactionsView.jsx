import React, { Component } from 'react';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import '../../styles/CurrentTransactionsView.css';
import { connect } from 'react-redux';
import { fetchTransaction } from '../../actions/table';

const loader = (
    <div className='loading-container'>
        <div className='loader-container d-flex justify-content-center'>
            <div className='loader'></div>
        </div>
        <div>
            <p className='text-center'>Your transaction is processing. Please wait.</p>
        </div>
    </div>
);

const errorMessage = (mostRecent, isFetchingTransaction) =>
    (mostRecent && mostRecent[0].error && !isFetchingTransaction) ?
        <div className='alert alert-danger' role='alert'>
            Something went wrong while trying to send the transaction.
            This is an issue with our servers and not the Nano network. Hold tight and try again.
        </div>
        : null;


class CurrentTransactionsView extends Component {
    render() {
        const { numToRerun, table, isFetchingTiming, isFetchingTransaction } = this.props;
        const mostRecent = table.length && table.slice(table.length - numToRerun); // get the last numToRerun transactions
        const sendMessage = mostRecent && mostRecent[0].completed ? 'Sent' : 'Sending';
        // render the jsx

        return (
            <Table tableData={table}/>             
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRerun(multi, table) {
            if (multi > 1) {
                let transactions = [];
                for (let i = 1; i <= multi; i++) {
                    transactions.push({
                        originNodeId: table[table.length - i].origin.id.toString(),
                        destinationNodeId: table[table.length - i].destination.id.toString(),
                    });
                }
                transactions = transactions.reverse();
                dispatch(fetchTransaction(multi, {
                    transactions
                }));
            } else {
                dispatch(fetchTransaction(1, {
                    transactions: [{
                        originNodeId: table[table.length - 1].origin.id.toString(),
                        destinationNodeId: table[table.length - 1].destination.id.toString(),
                    }]
                }));
            }
        }
    };
};


export default connect(null, mapDispatchToProps)(CurrentTransactionsView);