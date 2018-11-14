import React, {Fragment} from 'react';
import Map from './Map';
import Table from './Table';
import NoTableEntries from './NoTableEntries';

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

const errorMessage = (mostRecent, isFetchingTransaction) =>
    (mostRecent && mostRecent.error && !isFetchingTransaction) ?
        <div className='alert alert-danger' role='alert'>
            Something went wrong while trying to get the transaction. Please try again
        </div>
        : null;

const TransactionsView = ({table, isFetchingTiming, isFetchingTransaction}) => {
    const mostRecent = table.length && table[table.length - 1];
    const sendMessage = mostRecent.completed ? 'Sent' : 'Sending';
    // render the jsx

    const shouldShowTable = (isFetchingTransaction || mostRecent || isFetchingTiming);
    return (
        <Fragment>
            <h2 className='map-header page-header text-left'>Your Transactions</h2>
            {errorMessage(mostRecent, isFetchingTransaction)} {/*Displays an error message if fetching the transaction fails*/}
            { (shouldShowTable) ?  // this is pretty ugly and should be refactored in V2
                <Fragment>{
                    (isFetchingTransaction || !mostRecent) ? loader // show loader if no data or is getting a transaction
                    : <Fragment>
                        <Table tableData={table}/>
                        <h2 className='map-header page-header text-center'>
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
                }</Fragment>
                : <NoTableEntries />
            }
        </Fragment>
    );
};

export default TransactionsView;
