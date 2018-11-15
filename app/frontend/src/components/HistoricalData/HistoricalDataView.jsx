import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'components/Header';
import PastResultsTable from './PastResultsTable';
import ScatterView from './ScatterView';
import HeatMap from './HeatMap';

class HistoricalDataView extends React.Component {
    constructor(props) {
        super(props);
        const {pastResults} = props;

        let totalTime = 0;
        const plotData = [];
        const mapData = {};
        pastResults.forEach((transaction, i) => {
            totalTime += transaction.elapsedTime;
            plotData.push({x: i, y: transaction.elapsedTime});

            ['origin', 'destination'].forEach((key) => {
                const {id, nodeLocation, latitude, longitude} = transaction[key];
                if (!mapData[id]) {
                    mapData[id] = {
                        count: 1,
                        nodeLocation,
                        latitude,
                        longitude
                    };
                } else {
                    mapData[id].count++;
                }
            });
        });
        const avg = totalTime/pastResults.length;
        this.state = {
            averageTime: avg,
            plotData,
            mapData // TODO - will eventually be replaced by list of nodes
        };
    }
    render() {
        const {pastResults, nodeLocations} = this.props;
        const {averageTime, plotData} = this.state;
        return (
            <div className='HistoricalData'>
                <Header/>
                <div className='container-fluid'>
                     <div className='row form-group'>
                        <h2 className='map-header text-center'>
                            Some Stats
                        </h2>
                        <div className='container-fluid'>
                            <div className='row form-group'>
                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Total Transactions Sent: {pastResults.length}
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
                            <ScatterView plotData={plotData}/>
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
                            <PastResultsTable tableData={pastResults}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pastResults: state.pastResults,
        nodeLocations: state.nodes
    };
};

HistoricalDataView.propTypes = {
    pastResults: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(HistoricalDataView);