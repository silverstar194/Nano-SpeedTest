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
        pastResults.forEach((transaction, i) => {
            totalTime += transaction.elapsedTime;

            //TODO doesn't scale well on graph, might want to just do index
            plotData.push({
                x: i,
                // x: transaction.endReceiveTimestamp,
                // x: (new Date(transaction.endReceiveTimestamp)).toLocaleDateString({}, {
                //     day : 'numeric',
                //     month : 'short',
                //     year : 'numeric',
                //     hour: 'numeric',
                //     minute: 'numeric',
                //     second: 'numeric'
                // }),
                y: transaction.elapsedTime});
        });

        this.state = {
            averageTime: totalTime/pastResults.length,
            plotData
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