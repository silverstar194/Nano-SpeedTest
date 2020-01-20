import React, { Component,  Fragment } from 'react';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import '../../styles/CurrentTransactionsView.css';
import { connect } from 'react-redux';
import { fetchTransaction } from '../../actions/table';

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
        const mostRecent = table && table.length && table.slice(table.length - numToRerun); // get the last numToRerun transactions
        const sendMessage = mostRecent && mostRecent[0].completed ? 'Sent' : 'Sending';
        // render the jsx

        var output;
        if((table && table.length)){
            output = ""
        }
        else
        {
            output = <div className="center-horizontally max-width">You haven't tried a transaction yet, feel free to send one by clicking on the button above.</div>
        }

        return (
        <Fragment>
           <Table tableData={table}/>
           {output}
         </Fragment>
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