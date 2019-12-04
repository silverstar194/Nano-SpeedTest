import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Ad from 'components/Ad';
import PastResultsTable from './PastResultsTable';
import ScatterView from './ScatterView';
import HeatMap from './HeatMap';
import {addPastResults} from 'actions/pastResults';
import {fetchPastResults} from 'util/helpers';
import { Helmet } from "react-helmet";
import NavBar from '../NavBar';

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
        const {pastTransactions, totalTransactions, globalAverage, nodeLocations} = this.props;
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
                        <div className="statsbox__value">TODO</div>
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
            <div className="stats-main-area-three max-width">
               <div className="stats-main-area-three-inner">
                  <div className="past__transactions_title__wrapper">
                     <div className="past-transations-title">Past users transactions</div>
                     <div className="past__transactions__link">View All</div>
                  </div>
                  <table className="past-transactions-table">
                     <div className="table-title">
                        <tr>
                           <th className="border_bottom">Date</th>
                           <th className="border_bottom">Origin</th>
                           <th className="border_bottom">Destination</th>
                           <th className="border_bottom">Amount</th>
                           <th className="border_bottom">Elapsed Time</th>
                           <th className="border_bottom">Sending Block</th>
                        </tr>
                     </div>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.004 NANO</td>
                        <td>1.34s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.001 NANO</td>
                        <td>1.32s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.004 NANO</td>
                        <td>1.34s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.001 NANO</td>
                        <td>1.32s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.004 NANO</td>
                        <td>1.34s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.001 NANO</td>
                        <td>1.32s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.004 NANO</td>
                        <td>1.34s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                     <tr>
                        <td>01/01/2019 10:42</td>
                        <td>New York</td>
                        <td>Bangalore</td>
                        <td>.001 NANO</td>
                        <td>1.32s</td>
                        <td>afgaadfasdga</td>
                     </tr>
                  </table>
               </div>
            </div>
            <div className="stats-button-more">
               LEARN MORE
            </div>
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
        nodeLocations: state.nodes
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
    globalAverage: PropTypes.number,
    nodeLocations: PropTypes.array
};

HistoricalDataView.defaultProps = {
    totalTransactions: 0,
    globalAverage: 0,
};

export default connect(mapStateToProps,mapDispatchToProps)(HistoricalDataView);