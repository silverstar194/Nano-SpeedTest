import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
    origin,
    destination,
    startSendTimestamp,
    endSendTimestamp,
    error,
    completed,
    amount,
    transactionHashReceiving,
    transactionHashSending
}) => {

    if (error)
    {
        return (
             <tr>
                <td><span className="completed">Error</span></td>
                <td>{origin.nodeLocation}</td>
                <td>{destination.nodeLocation}</td>
                <td>{amount} nano</td>
                <td></td>
                <td><a href={`https://www.nanode.co/block/${transactionHashSending}`} target='_blank' rel='noopener noreferrer'></a></td>
            </tr>
            );
    }

    if (completed)
    {
        return (
            <tr>
                <td><span className="completed">Completed</span></td>
                <td>{origin.nodeLocation}</td>
                <td>{destination.nodeLocation}</td>
                <td>{amount} nano</td>
                <td>{(endSendTimestamp - startSendTimestamp)/1000}s</td>
                <td><a href={`https://www.nanode.co/block/${transactionHashSending}`} target='_blank' rel='noopener noreferrer'>{transactionHashSending}</a></td>
             </tr>
        );
    }
    else
    {
        return (
             <tr>
                <td><span className="completed">Pending</span></td>
                <td>{origin.nodeLocation}</td>
                <td>{destination.nodeLocation}</td>
                <td>{amount} nano</td>
                <td>...</td>
                <td><a href={`https://www.nanode.co/block/${transactionHashSending}`} target='_blank' rel='noopener noreferrer'>{transactionHashSending}</a></td>
             </tr>
        );
    }
};

TableRow.propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    time: PropTypes.number,
    amount: PropTypes.string,
    completed: PropTypes.bool,
    endSendTimestamp: PropTypes.number,
    startSendTimestamp: PropTypes.number,
    transactionHashReceiving: PropTypes.string.isRequired,
    transactionHashSending: PropTypes.string.isRequired
};

export default TableRow;