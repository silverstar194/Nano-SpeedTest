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
            <div className='nano-container table-responsive'>
                <h2 className='map-header text-left'>Past Transactions</h2>
                <table className='table '>
                    <thead>
                    <tr>
                        <th scope='col'>Origin</th>
                        <th scope='col'>Destination</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Elapsed Time</th>
                        <th scope='col'>Date</th>
                        <th scope='col' className='block-col'>Sending Block</th>
                        <th scope='col' className='block-col'>Receiving Block</th>
                    </tr>
                    </thead>
                    <tbody>
                    { tableData &&
                        tableData.sort((a,b) => b.endSendTimestamp - a.endSendTimestamp)
                        .slice(startIndex, end).map((transactionData) => {
                            return <PastResultsTableRow key={uuid(transactionData.id)} {...transactionData}/>;
                        })
                    }
                    </tbody>
                </table>
                <div className='row'>
                    <div className='col-sm-auto'>
                            Showing {startIndex + 1} to {end} of {tableData.length} transactions.
                    </div>
                    <div className='col-sm-auto'>
                        <nav aria-label='Table navigation'>
                            <ul className='pagination'>
                                <li className={prevClass}>
                                    <button className='page-link' onClick={this.prevPage}>
                                        Prev
                                    </button>
                                </li>
                                <li className={nextClass}>
                                    <button className='page-link' onClick={this.nextPage}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                         </nav>
                    </div>
                </div>

            </div>
        );
    }
}

PastResultsTable.propTypes = {
    tableData: PropTypes.array
};

export default PastResultsTable;