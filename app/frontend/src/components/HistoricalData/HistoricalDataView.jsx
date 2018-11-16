import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'components/Header';
import Ad from 'components/Ad';
import PastResultsTable from './PastResultsTable';
import ScatterView from './ScatterView';
import HeatMap from './HeatMap';

class HistoricalDataView extends React.Component {
    render() {
        const {pastTransactions, nodeLocations} = this.props;
        const plotData = [];
        let totalTime = 0;
        pastTransactions.forEach((transaction, i) => {
            totalTime += transaction.elapsedTime;

            //TODO doesn't scale well on graph, might want to just do index
            plotData.push({
                x: transaction.endReceiveTimestamp,
                y: transaction.elapsedTime});
        });

        const averageTime = totalTime/1000/pastTransactions.length;

        return (
            <div className='HistoricalData'>
                <Header/>
                <Ad />
                <div className='container-fluid'>
                     <div className='row form-group'>
                        <h2 className='map-header text-center'>
                            Some Stats
                        </h2>
                        <div className='container-fluid'>
                            <div className='row form-group'>
                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Total Transactions Sent: {pastTransactions.length}
                                    </h3>
                                </div>
                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Average Time: {averageTime.toFixed(3)} Seconds
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row form-group mt-5'>
                        <div className='col-6'>
                            <h2 className='map-header text-center'>
                                Scatter Chart of Recent Transactions
                            </h2>
                            {
                                plotData && plotData.length ?
                                <ScatterView plotData={plotData}/>
                                : null
                            }
                        </div>
                        <div className='col-6'>
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

HistoricalDataView.propTypes = {
    pastTransactions: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(HistoricalDataView);