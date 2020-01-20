import React from 'react';
import PropTypes from 'prop-types';
import PastResultsTableRow from './PastResultsTableRow';
import uuid from 'uuid';
import 'styles/PastResults.css';

class PastResultsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {tableData} = this.props;

        return (
              <div className="your-transations-wrapper">
                  <div className="past__transactions_title__wrapper center-horizontally max-width">
                     <div className="past-transations-title">Past users transactions</div>
                     <a className="past__transactions__link" href="/Stats">See More</a>
                  </div>
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
                    { tableData &&
                        tableData.sort((a,b) => b.endSendTimestamp - a.endSendTimestamp)
                        .map((transactionData) => {
                            return <PastResultsTableRow key={uuid(transactionData.id)} {...transactionData}/>;
                        })
                    }
                    </tbody>
                  </table>
               </div>
        );
    }
}

PastResultsTable.propTypes = {
    tableData: PropTypes.array
};

export default PastResultsTable;