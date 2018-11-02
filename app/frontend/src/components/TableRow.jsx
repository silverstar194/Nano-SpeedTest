import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({index, id, origin, destination, time, amount, completed}) => {
    return (
        <tr>
            <th scope='row'>{index}</th>
            <td>{id}</td>
            <td>{origin.nodeLocation}</td>
            <td>{destination.nodeLocation}</td>
            { time ?
                <td>{time} Seconds</td>
                : <td>Pending...</td>
            }
            <td>{amount}</td>
            { completed ?
                <td>{completed}</td>
                : <td>Pending...</td>
            }
        </tr>
    );
};

TableRow.propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    time: PropTypes.number,
    amount: PropTypes.number,
    completed: PropTypes.string
};

export default TableRow;