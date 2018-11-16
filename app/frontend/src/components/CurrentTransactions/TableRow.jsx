import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
    origin,
    destination,
    startSendTimestamp,
    endReceiveTimestamp,
    error,
    completed,
    amount,
    transactionHashReceiving,
    transactionHashSending
}) => {
    const classStyle = error ? 'table-danger' : '';
    return (
        <tr className={classStyle}>
            <td>{origin.nodeLocation}</td>
            <td>{destination.nodeLocation}</td>
            <td>{amount} nano</td>
            { completed ?
                <Fragment>
                { error ?
                    <Fragment>
                        <td>NO DATA</td>
                        <td>ERROR</td>
                        <td>NO DATA</td>
                        <td>NO DATA</td>
                    </Fragment> : <Fragment>
                        <td>{(endReceiveTimestamp - startSendTimestamp)/1000} Seconds</td>
                        <td>Completed</td>
                        <td className='block-col'>
                            <a
                                href={`https:www.nanode.co/block/${transactionHashSending}`}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {transactionHashSending}
                            </a>
                        </td>
                        <td className='block-col'>
                            <a
                                href={`https:www.nanode.co/block/${transactionHashReceiving}`}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {transactionHashReceiving}
                            </a>
                        </td>
                    </Fragment>
                }
                </Fragment>
                : <Fragment>
                    <td>Pending...</td>
                    <td>Pending...</td>
                    <td>Pending...</td>
                    <td>Pending...</td>
                </Fragment>
            }
        </tr>
    );
};

TableRow.propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    time: PropTypes.number,
    amount: PropTypes.string,
    completed: PropTypes.bool,
    endReceiveTimestamp: PropTypes.number,
    startSendTimestamp: PropTypes.number,
    transactionHashReceiving: PropTypes.string.isRequired,
    transactionHashSending: PropTypes.string.isRequired
};

export default TableRow;