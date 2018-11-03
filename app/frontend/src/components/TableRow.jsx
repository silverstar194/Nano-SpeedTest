import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
    index,
    id,
    origin,
    destination,
    startSendTimestamp,
    endReceiveTimestamp,
    error,
    completed,
    amount
}) => {
    const classStyle = error ? 'table-danger' : '';
    return (
        <tr className={classStyle}>
            <th scope='row'>{index}</th>
            <td>{id}</td>
            <td>{origin.nodeLocation}</td>
            <td>{destination.nodeLocation}</td>
            <td>{amount} nano</td>
            { completed ?
                <>
                { error ?
                    <>
                        <td>ERROR</td>
                        <td>ERROR OCCURRED</td>
                    </> : <>
                        <td>{(endReceiveTimestamp - startSendTimestamp)/1000} Seconds</td>
                        <td>Completed</td>
                    </>
                }
                </>
                : <>
                    <td>Pending...</td>
                    <td>Pending...</td>
                </>
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
    completed: PropTypes.bool,
    endReceiveTimestamp: PropTypes.number,
    startSendTimestamp: PropTypes.number
};

export default TableRow;