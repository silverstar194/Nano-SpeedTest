import React from 'react';

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

export default TableRow;