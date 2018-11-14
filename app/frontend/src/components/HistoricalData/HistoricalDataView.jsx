import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'components/Header';
import PastResultsTable from './PastResultsTable';

class HistoricalDataView extends React.Component {
    render() {
        const {pastResults} = this.props;
        return (
            <div className='HistoricalData'>
                <Header/>
                <div className='container-fluid'>
                     <div className='row'>
                        <div className='col-auto'>
                            <h2 className='map-header'>
                                Total Transactions Sent XX
                            </h2>
                        </div>
                        <div className='col-auto'>
                            <h2 className='map-header'>
                                Average Time: XX
                            </h2>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>

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