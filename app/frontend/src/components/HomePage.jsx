import React, { Component } from 'react';
import Header from './Header';
import Ad from './Ad';
import AdvancedModal from './AdvancedModal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { switchTab } from '../actions/navigation';
import { fetchTransaction } from '../actions/table';
import '../styles/HomePage.css';

class HomePage extends Component {
    // component specific state -- don't need to add to redux store
    state = {
        modalOpen: false
    };

    onAdvancedClick = () => {
      this.setState(() => ({modalOpen: true}));
    };

    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Results');

        // check if user selected locations to send to and from.  Make null (random) if it is NOT the case
        // that they selected two different valid locations
        const hasFormData = this.props.advSettingsForm.advSettings;
        const notSame = !!hasFormData ? hasFormData.values.origin !== hasFormData.values.destination : false;
        const origin = !!hasFormData && notSame ? hasFormData.values.origin : null;
        const dest = !!hasFormData && notSame ? hasFormData.values.destination : null;

        // multiple transactions
        const numTransactions = hasFormData && hasFormData.values.numTransactions ? hasFormData.values.numTransactions : false;

        this.props.onGoPressed(origin, dest, numTransactions); // Update current active tab and dispatch action to get transaction data
    };

    handleLocationSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({modalOpen: false}));
    };

    handleMultiSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({modalOpen: false}));
    };

    handleCancel = () => {
        this.setState(() => ({modalOpen: false}));
    };

    nodeIdToLocation = (nodeId, nodes) => {
        return nodes[nodeId].location;
    }

    drawMessage(advSettingsForm, nodes) {
        const {values} = (advSettingsForm && advSettingsForm.advSettings) || {};
        if (values) {
            if (values.numTransactions) { // multi transaction message
                return <h3 className='greeting'>Hit GO to send {values.numTransactions} Transactions!</h3>;
            } else if (values.origin && values.destination) { // two city message
                return <h3 className='greeting'>Hit GO to send Nano from {this.nodeIdToLocation(values.origin, nodes)} to {this.nodeIdToLocation(values.destination, nodes)}!</h3>;
            }
        }
        return <h3 className='greeting'>Hit GO to send Nano between two random nodes!</h3>; // show random message
    }

    render() {
        const {advSettingsForm, nodes} = this.props;
        return (
            <div className='HomePage'>
                <Header/>
                <Ad/>
                <AdvancedModal
                    open={this.state.modalOpen}
                    handleLocationSettings={this.handleLocationSettings}
                    handleMultiSettings={this.handleMultiSettings}
                    handleCancel={this.handleCancel}
                    nodes={nodes}
                    settings= {advSettingsForm}
                />
                <h1 className='greeting page-header text-center'>Welcome to NanoSpeed.live!</h1>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            {this.drawMessage(advSettingsForm, nodes)}

                            <button type='button' className='btn btn-success btn-circle btn-xl' onClick={this.onClick}>
                                Go
                            </button>
                            <br/>
                            <button id='advanced-btn' type='button' className='btn btn-primary' onClick={this.onAdvancedClick}>Advanced</button>
                            <br />
                            <p className='greeting'>Run your live test now.</p>
                        </div>
                    </div>
                    <div/>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        advSettingsForm: state.form,
        nodes: state.nodes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGoPressed(origin, dest, multi) {
            if (multi) {
                const transactions = [];
                for (let i = 0; i < multi; i++) {
                    transactions.push({
                        originNodeId: null,
                        destinationNodeId: null
                    });
                }
                dispatch(fetchTransaction({
                    transactions
                }));
            } else {
                dispatch(fetchTransaction({
                    transactions: [{
                        originNodeId: origin,
                        destinationNodeId: dest
                    }]
                }));
            }
            dispatch(switchTab('Results')); // Update current active tab
        }
    };
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);