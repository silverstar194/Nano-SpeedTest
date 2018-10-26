import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({index, hash, origin, destination, time, amount, completed}) => {
    return (
        <tr>
            <th scope="row">{index}</th>
            <td>{hash}</td>
            <td>{origin}</td>
            <td>{destination}</td>
            <td>{time} Seconds</td>
            <td>{amount}</td>
            <td>{completed}</td>
        </tr>
    );
};

TableRow.propTypes = {
    index: PropTypes.number.isRequired,
    hash: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    time: PropTypes.number,
    amount: PropTypes.number,
    completed: PropTypes.string
};

export default TableRow;