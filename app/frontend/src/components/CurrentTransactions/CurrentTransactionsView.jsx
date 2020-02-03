import React, { Component,  Fragment } from 'react';
import Table from './Table';
import { connect } from 'react-redux';
import { fetchTransaction } from '../../actions/table';

const errorMessage = (mostRecent, isFetchingTransaction) =>
    (mostRecent && mostRecent[0].error && !isFetchingTransaction) ?
        <div className='alert alert-danger center-horizontally max-width' role='alert'>
            Something went wrong while trying to send the transaction.
            This is an issue with our servers and not the Nano network. Hold tight and try again.
        </div>
        : null;


class CurrentTransactionsView extends Component {
    render() {
        const { table, isFetchingTransaction } = this.props;
        const mostRecent = table && table.length && table.slice(table.length - 1); // get the last transaction

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
           {errorMessage(mostRecent, isFetchingTransaction)}
         </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRerun(table) {
            dispatch(fetchTransaction(1, {
                transactions: [{
                    originNodeId: table[table.length - 1].origin.id.toString(),
                    destinationNodeId: table[table.length - 1].destination.id.toString(),
                }]
            }));
        }
    };
};


export default connect(null, mapDispatchToProps)(CurrentTransactionsView);