import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import '../styles/StatsPage.css';
import Map from './Map';
import {connect} from 'react-redux';
import {addTransaction} from "../actions/table";
import uuid from 'uuid';

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
                            <div className='nano-container'>
                                <table className='table'>
                                    <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Id</th>
                                        <th scope='col'>Origin</th>
                                        <th scope='col'>Destination</th>
                                        <th scope='col'>Amount</th>
                                        <th scope='col'>Elapsed Time</th>
                                        <th scope='col'>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        table.map((props, index) => {
                                            props.index = index + 1;
                                            return <TableRow key={uuid(props.id)} {...props}/>;
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>

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
                    : (
                        <h2>
                            No results to show
                            <p></p>
                            Please go to the Speed Test tab and run a test
                        </h2>
                    )
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

const mapDispatchToProps = (dispatch) => {
    return {
        onAddData(data) {
            dispatch(addTransaction(data));
        }
    };
};

StatsPage.propTypes = {
    table: PropTypes.array.isRequired,
    onAddData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(StatsPage);