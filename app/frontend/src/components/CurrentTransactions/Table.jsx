import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import uuid from 'uuid';

const Table = ({tableData}) => {

    return (
        <div className='nano-container'>
            <table className='table'>
                <thead>
                <tr>
                    <th scope='col'>Origin</th>
                    <th scope='col'>Destination</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>Elapsed Time</th>
                    <th scope='col'>Status</th>
                    <th scope='col' className='block-col'>Sending Block</th>
                    <th scope='col' className='block-col'>Receiving Block</th>
                </tr>
                </thead>
                <tbody>
                {
                    tableData.map((transactionData) => {
                        return <TableRow key={uuid(transactionData.id)} {...transactionData}/>;
                    })
                }
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    tableData: PropTypes.array
};

export default Table;