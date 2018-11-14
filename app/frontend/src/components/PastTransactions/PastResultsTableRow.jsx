import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
    id,
    origin,
    destination,
    startSendTimestamp,
    endReceiveTimestamp,
    amount
}) => {
    const date = new Date(endReceiveTimestamp).toLocaleDateString({/*Locale goes here - en-US for example */}, {
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    return (
        <tr>
            <td>{id}</td>
            <td>{origin.nodeLocation}</td>
            <td>{destination.nodeLocation}</td>
            <td>{amount} nano</td>
            <td>{(endReceiveTimestamp - startSendTimestamp)/1000} Seconds</td>
            <td>{date}</td>
        </tr>
    );
};

TableRow.propTypes = {
    id: PropTypes.number.isRequired,
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    time: PropTypes.number,
    amount: PropTypes.number,
    completed: PropTypes.bool,
    endReceiveTimestamp: PropTypes.number,
    startSendTimestamp: PropTypes.number
};

export default TableRow;