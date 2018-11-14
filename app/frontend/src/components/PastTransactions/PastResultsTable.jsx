import React from 'react';
import PropTypes from 'prop-types';
import PastResultsTableRow from './PastResultsTableRow';
import uuid from 'uuid';

const maxItems = 25;

class PastResultsTable extends React.Component {
    state = {
        startIndex: 0
    }
    render() {
        const {tableData} = this.props;
        const {startIndex} = this.state;
        // const endIndex = (startIndex + maxItems) < tableData.length ? startIndex + maxItems : 
        return (
            <div className='nano-container'>
                <h2 className='map-header text-left'>Past Transactions</h2>
                <table className='table'>
                    <thead>
                    <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Origin</th>
                        <th scope='col'>Destination</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Elapsed Time</th>
                        <th scope='col'>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        tableData.reverse().slice(startIndex, startIndex + maxItems).map((transactionData, index) => {
                            return <PastResultsTableRow key={uuid(transactionData.id)} {...transactionData}/>;
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
};

PastResultsTable.propTypes = {
    tableData: PropTypes.array
};

export default PastResultsTable;