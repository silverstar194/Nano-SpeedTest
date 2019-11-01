import React from 'react';
import PropTypes from 'prop-types';
import PastResultsTableRow from './PastResultsTableRow';
import uuid from 'uuid';
import 'styles/PastResults.css';

const viewItems = 25;

class PastResultsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startIndex: 0,
            disablePrev: true,
            disableNext: false
        };
        this.checkDisabled = this.checkDisabled.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }
    checkDisabled(startIndex) {
        let disableNext = startIndex + viewItems >= this.props.tableData.length;
        let disablePrev = startIndex === 0;
        return {
            disablePrev,
            disableNext
        };
    }
    nextPage() {
        if (this.state.disableNext) return; // exit early if shouldn't have been able to click

        const {startIndex} = this.state;
        const newIndex = startIndex + viewItems;
        const {disableNext, disablePrev} = this.checkDisabled(newIndex);

        this.setState({
            startIndex: newIndex,
            disablePrev,
            disableNext
        });
    }
    prevPage() {
        if (this.state.disablePrev) return; // exit early if shouldn't have been able to click


        const {startIndex} = this.state;
        const newIndex = startIndex - viewItems;
        const {disableNext, disablePrev} = this.checkDisabled(newIndex);

        this.setState({
            startIndex: newIndex,
            disablePrev,
            disableNext
        });
    }
    render() {
        const {tableData} = this.props;
        const {startIndex, disableNext, disablePrev} = this.state;

        let end = startIndex + viewItems;
        end = end > tableData.length ? tableData.length : end;

        const prevClass = 'page-item' + (disablePrev ? ' disabled' : '');
        const nextClass = 'page-item' + (disableNext ? ' disabled' : '');
        return (
              <div className="your-transations-wrapper">
                  <div className="past__transactions_title__wrapper center-horizontally max-width">
                     <div className="past-transations-title">Past users transactions</div>
                     <div className="past__transactions__link">See More</div>
                  </div>
                  <table className="past-transactions-table max-width">
                  <tbody>
                        <tr>
                           <th className="border_bottom">Date</th>
                           <th className="border_bottom">Origin</th>
                           <th className="border_bottom">Destination</th>
                           <th className="border_bottom">Amount</th>
                           <th className="border_bottom">Elapsed Time</th>
                           <th className="border_bottom">Sending Block</th>
                        </tr>
                    { tableData &&
                        tableData.sort((a,b) => b.endSendTimestamp - a.endSendTimestamp)
                        .slice(startIndex, end).map((transactionData) => {
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