import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import '../styles/StatsPage.css';
import Map from './Map';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import {connect} from 'react-redux';
import Ad from './Ad';

const loader = (
    <div className='loading-container'>
    <div className='loader-container d-flex justify-content-center'>
        <div className='loader'/>
    </div>
    <div>
        <p>Your transaction is processing. Please wait.</p>
    </div>
</div>
);


class StatsPage extends Component {
    state = {

    };

    render() {
        const {table, isFetchingTiming, isFetchingTransaction} = this.props;
        const mostRecent = table.length && table[table.length - 1];
        const sendMessage = mostRecent.completed ? 'Sent' : 'Sending';
        // render the jsx
        return (
            <div className='StatsPage'>
                <Header/>
                <Ad/>
                {(mostRecent && mostRecent.error && !isFetchingTransaction) ?
                    <div className='alert alert-danger' role='alert'>
                        Something went wrong while trying to get the transaction. Please try again
                    </div>
                    : null
                }
                { (isFetchingTransaction || mostRecent || isFetchingTiming) ? ( // this is pretty ugly and should be refactored in V2
                    <>{
                        (isFetchingTransaction || !mostRecent) ? loader // show loader if no data or is getting a transaction
                        : (<>
                            <h2 className='map-header page-header text-left'>
                            {sendMessage} from {mostRecent.origin.nodeLocation} to {mostRecent.destination.nodeLocation}
                            { isFetchingTiming && <>
                                <p/>
                                This can take upwards of 30 seconds so please be patient!
                            </>}
                            </h2>
                            <div className='nano-container'>
                                <Map {...mostRecent}/>
                            </div>
                            <Table tableData={table}/>
                        </>)
                    }</>
                    ) : <NoTableEntries /> // show message to run a test first
                }
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