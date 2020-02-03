import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import uuid from 'uuid';

const Table = ({tableData}) => {

    return (
        <div className="your-transations-wrapper">
          <div className="your-transations-title center-horizontally max-width">Your transactions</div>
          <table className="transactions-table max-width">
          <tbody>
             <tr className="hidden-on-mobile">
                <th className="border_bottom">Status</th>
                <th className="border_bottom">Origin</th>
                <th className="border_bottom">Destination</th>
                <th className="border_bottom">Amount</th>
                <th className="border_bottom">Elapsed Time</th>
                <th className="border_bottom">Sending Block</th>
             </tr>
            {
                tableData.sort((a,b) => (a.endSendTimestamp || Date.now()) - (b.endSendTimestamp || Date.now()))
                .map((transactionData) => {
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