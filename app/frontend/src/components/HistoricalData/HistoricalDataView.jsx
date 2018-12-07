import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Ad from 'components/Ad';
import PastResultsTable from './PastResultsTable';
import ScatterView from './ScatterView';
import HeatMap from './HeatMap';
import {addPastResults} from 'actions/pastResults';
import {fetchPastResults} from 'util/helpers';

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
                date: transaction.endSendTimestamp,
                y: transaction.elapsedTime
            });
        });

        return (
            <div className='HistoricalData'>
                <Header/>
                <Ad />

                <div className='container-fluid'>
                        <div className='row form-group'>
                        <div className='container-fluid'>
                        <h2 className='map-header'>
                            Some Stats
                        </h2>
                            <div className='row form-group'>

                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Total Transactions Sent: {totalTransactions}
                                    </h3>
                                </div>
                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Average Time: {globalAverage.toFixed(3)} Seconds
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row form-group mt-5'>
                        <div className='col-6 col-md-push-6'>
                            <h2 className='map-header text-center'>
                                Scatter Chart of Recent Transactions
                            </h2>
                            {
                                plotData && plotData.length ?
                                <ScatterView plotData={plotData}/>
                                : null
                            }
                        </div>
                        <div className='col-6 col-md-push-6'>
                            <h2 className='map-header text-center'>
                                Locations of Our Nano Nodes
                            </h2>
                            { nodeLocations && Object.keys(nodeLocations).length ?

                                <HeatMap nodeLocations={nodeLocations} /> : null
                            }
                        </div>
                    </div>
                    <div className='row form-groups mt-5'>
                        <div className='col'>
                            <PastResultsTable tableData={pastTransactions}/>
                        </div>
                    </div>
                </div>
                <Footer/>
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
    nodeLocations: PropTypes.object
};

HistoricalDataView.defaultProps = {
    totalTransactions: 0,
    globalAverage: 0,
};

export default connect(mapStateToProps,mapDispatchToProps)(HistoricalDataView);