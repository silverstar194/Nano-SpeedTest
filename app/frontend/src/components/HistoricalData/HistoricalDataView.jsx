import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Ad from 'components/Ad';
import PastResultsTableRow from './PastResultsTableRow';
import uuid from 'uuid';
import ScatterView from './ScatterView';
import {addPastResults} from 'actions/pastResults';
import {fetchPastResults} from 'util/helpers';
import { Helmet } from "react-helmet";
import NavBar from '../NavBar';

const viewItems = 20;

class HistoricalDataView extends React.Component {
    componentDidMount() {
        fetchPastResults()
        .then((response) => {
            this.props.fetchedPastData({
                ...response
            });
        });
    }
    render() {
        const {pastTransactions, totalTransactions, globalAverage, overallGlobalAverage} = this.props;
        const plotData = [];
        pastTransactions.sort((a,b) => a.endSendTimestamp - b.endSendTimestamp)
        .forEach((transaction, i) => {
            plotData.push({
                x: i,
                y: transaction.elapsedTime,
                date: transaction.endSendTimestamp,
                origin: transaction.origin.nodeLocation,
                destination: transaction.destination.nodeLocation,
                PoWCached: transaction.PoWCached,
            });
        });

        var listTransactions = pastTransactions.slice(0,viewItems)
        return (
            <div className='HistoricalData'>
             <Helmet>
                <title>NanoSpeed.live - Past Transaction Information</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="View statistics about past speed tests and transactions."
                 />
            </Helmet>
             <main className="stats-main">
             <NavBar />
            <div className="general-main-area-one">
               <div className="general-header-main center-horizontally max-width">
                  Global Statistics
               </div>
            </div>
            <div className="stats-main-area-two">
               <div className="stats-main-area-two-inner center-horizontally max-width">
                  <div className="stats-box">
                     <div className="statsbox__one">
                        <div className="statsbox__title">Total Transactions</div>
                        <div className="statsbox__value">{totalTransactions}</div>
                     </div>
                     <div className="statsbox__two">
                        <div className="statsbox__title">All-Time Median</div>
                        <div className="statsbox__value">{overallGlobalAverage.toFixed(3)}</div>
                     </div>
                     <div className="statsbox__three">
                        <div className="statsbox__title">24 Hour Median</div>
                        <div className="statsbox__value">{globalAverage.toFixed(3)}</div>
                     </div>
                  </div>
                  <div className="statsgraph">           {
                                plotData && plotData.length ?
                                <ScatterView plotData={plotData}/>
                                : null
                            }
                  </div>
               </div>
            </div>
            <Ad />
            <div className="stats-main-area-three max-width">
               <div className="stats-main-area-three-inner">
                  <div className="past__transactions_title__wrapper">
                     <div className="past-transations-title">Past users transactions</div>
                  </div>


                  <table className="transactions-table max-width">
                     <tbody>
                        <tr className="hidden-on-mobile">
                           <th className="border_bottom">Date</th>
                           <th className="border_bottom">Origin</th>
                           <th className="border_bottom">Destination</th>
                           <th className="border_bottom">Amount</th>
                           <th className="border_bottom">Elapsed Time</th>
                           <th className="border_bottom">Sending Block</th>
                        </tr>

                      {
                        listTransactions.sort((a,b) => (a.endSendTimestamp || Date.now()) - (b.endSendTimestamp || Date.now()))
                        .map((transactionData) => {
                        return <PastResultsTableRow key={uuid(transactionData.id)} {...transactionData}/>;
                    })
            }

                     </tbody>
                  </table>
               </div>
            </div>
            <a className="stats-button-more" href="/Info">
               LEARN MORE
            </a>
         </main>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pastTransactions: state.pastResults.pastTransactions,
        totalTransactions: state.pastResults.totalTransactions,
        globalAverage: state.pastResults.globalAverage,
        overallGlobalAverage: state.pastResults.overallGlobalAverage,
    };
};

const mapDispatchToProps = (dispatch) => {
	return {
	  	fetchedPastData(data) {
			dispatch(addPastResults(data));
	  	}
	};
};

HistoricalDataView.propTypes = {
    pastTransactions: PropTypes.array.isRequired,
    totalTransactions: PropTypes.number,
    overallGlobalAverage: PropTypes.number,
};

HistoricalDataView.defaultProps = {
    totalTransactions: 0,
    globalAverage: 0,
    overallGlobalAverage: 0,
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDataView);