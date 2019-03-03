import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
    origin,
    destination,
    startSendTimestamp,
    endSendTimestamp,
    amount,
    transactionHashReceiving,
    transactionHashSending
}) => {
    const date = new Date(endSendTimestamp).toLocaleDateString({/*Locale goes here - en-US for example */}, {
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    return (
        <tr>
            <td>{origin.nodeLocation}</td>
            <td>{destination.nodeLocation}</td>
            <td>{amount} nano</td>
            <td>{(endSendTimestamp - startSendTimestamp)/1000} Seconds</td>
            <td>{date}</td>
            <td className='block-col text-ellipsis'>
                <a
                    href={`https://www.nanode.co/block/${transactionHashSending}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {transactionHashSending}
                </a>
            </td>
        </tr>
    );
};

TableRow.propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    time: PropTypes.number,
    amount: PropTypes.string,
    endSendTimestamp: PropTypes.number,
    startSendTimestamp: PropTypes.number,
    transactionHashSending: PropTypes.string,
    transactionHashReceiving: PropTypes.string
};

export default TableRow;