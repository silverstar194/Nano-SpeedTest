import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'components/Header';
import PastResultsTable from './PastResultsTable';

import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Label
} from 'recharts';

class HistoricalDataView extends React.Component {
    constructor(props) {
        super(props);
        const {pastResults} = props;

        let totalTime = 0;
        const data = [];
        pastResults.forEach((transaction, i) => {
            totalTime += transaction.elapsedTime;
            data.push({x: i, y: transaction.elapsedTime});
        });
        const avg = totalTime/pastResults.length;
        this.state = {
            averageTime: avg,
            data
        };
    }
    componentDidUpdate(prevProps, prevState) {

    }
    render() {
        const {pastResults} = this.props;
        const {averageTime, data} = this.state;
        return (
            <div className='HistoricalData'>
                <Header/>
                <div className='container-fluid'>
                     <div className='row'>
                        <div className='col-auto'>
                            <h2 className='map-header'>
                                Total Transactions Sent: {pastResults.length}
                            </h2>
                        </div>
                        <div className='col-auto'>
                            <h2 className='map-header'>
                                Average Time: {averageTime.toFixed(3)} Seconds
                            </h2>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <ResponsiveContainer width='100%' height={500}>
                                <ScatterChart>
                                    {/* <CartesianGrid strokeDasharray='3 3' /> */}
                                    <XAxis dataKey='x' name='date' label='xxxxx' />
                                    <YAxis dataKey='y' name='elapsed time' />>
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name='Transactions' data={data} fill='#8884d8' />
                                    </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='col'>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-auto'>
                            <PastResultsTable tableData={pastResults}/>
                        </div>
                        <div className='col'>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pastResults: state.pastResults
    };
};

HistoricalDataView.propTypes = {
    pastResults: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(HistoricalDataView);