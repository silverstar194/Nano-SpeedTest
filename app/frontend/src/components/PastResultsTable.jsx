import React from 'react';
import PropTypes from 'prop-types';
import PastResultsTableRow from './PastResultsTableRow';
import uuid from 'uuid';

const PastResultsTable = ({tableData}) => {
    return (
        <div className='nano-container'>
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
                    tableData.reverse().map((transactionData, index) => {
                        return <PastResultsTableRow key={uuid(transactionData.id)} {...transactionData}/>;
                    })
                }
                </tbody>
            </table>
        </div>
    );
};

PastResultsTable.propTypes = {
    tableData: PropTypes.array
};

export default PastResultsTable;