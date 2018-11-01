import React, {Component} from 'react';
import Header from './Header'
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import '../styles/StatsPage.css';
import Map from './Map';
import {connect} from 'react-redux';
import {addTransaction} from "../actions/table";
import uuid from 'uuid'


class StatsPage extends Component {
    state = {
        cities: [{
            name: 'japan',
            coords: {
                lat: 36.2048,
                lng: 138.2529
            }
        },
            {
                name: 'sf',
                coords: {
                    lat: 37.768249,
                    lng: -122.445145
                }
            }
        ]
    };

    render() {
        // render the jsx
        return (
            <div className='StatsPage'>
                <Header/>
                <h2 className='map-header page-header text-left'>Sent from Japan to San Francisco</h2>
                <div className='nano-container'>
                    <Map cities={this.state.cities}/>
                </div>
                <div className='nano-container'>
                    <table className='table'>
                        <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Hash</th>
                            <th scope='col'>Origin</th>
                            <th scope='col'>Destination</th>
                            <th scope='col'>Elapsed Time</th>
                            <th scope='col'>Amount</th>
                            <th scope='col'>Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.table.map((props, index) => {
                                props.index = index + 1;
                                return <TableRow key={props.hash} {...props}/>;
                            })
                        }
                        </tbody>
                    </table>
                </div>

                {/*only show loading if we are waiting for the data.  Else show button to rerun*/}
                {this.state.loading && (
                    <div className='loading-container'>
                        <div className='loader-container d-flex justify-content-center'>
                            <div className='loader'></div>
                        </div>
                        <div>
                            <p>Your transaction is processing. Please wait.</p>
                        </div>
                    </div> )
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