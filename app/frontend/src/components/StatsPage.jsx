import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import '../styles/StatsPage.css';
import Map from './Map';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import {connect} from 'react-redux';

class StatsPage extends Component {
    state = {

    };

    render() {
        const {table} = this.props;
        const mostRecent = table.length && table[table.length - 1];
        const sendMessage = mostRecent.completed ? 'Sent' : 'Sending';
        // render the jsx
        return (
            <div className='StatsPage'>
                <Header/>
                {
                    table.length ?
                    (
                        <div>
                            <h2 className='map-header page-header text-left'>
                                {sendMessage} from {mostRecent.origin.nodeLocation} to {mostRecent.destination.nodeLocation}
                            </h2>
                            <div className='nano-container'>
                                <Map {...mostRecent}/>
                            </div>
                            <Table tableData={table}/>

                            {/* /*** only show loading if we are waiting for the data.  Else show button to rerun
                                {this.state.loading && (
                                    <div className='loading-container'>
                                        <div className='loader-container d-flex justify-content-center'>
                                            <div className='loader'></div>
                                        </div>
                                        <div>
                                            <p>Your transaction is processing. Please wait.</p>
                                        </div>
                                    </div> )
                                }  */}
                        </div>
                    )
                    :<NoTableEntries />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        table: state.table
    };
};


StatsPage.propTypes = {
    table: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(StatsPage);