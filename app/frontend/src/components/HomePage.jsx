import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Ad from './Ad';
import AdvancedModal from './AdvancedModal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { switchTab } from '../actions/navigation';
import { fetchTransaction } from '../actions/table';
import '../styles/HomePage.css';
import { openAdvSettings } from '../actions/advancedModal';
import LocationDropdowns from './LocationDropdowns';

class HomePage extends Component {
    // component specific state -- don't need to add to redux store
    state = {
        modalOpen: false
    };

    onAdvancedClick = () => {
        this.props.onAdvPressed();
        this.setState(() => ({ modalOpen: true }));
    };

    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Results');

        // check if user selected locations to send to and from.  Make null (random) if it is NOT the case
        // that they selected two different valid locations
        const hasAdvFormData = this.props.advSettingsForm.advSettings;
        const notSameAdv = !!hasAdvFormData ? hasAdvFormData.values.origin !== hasAdvFormData.values.destination : false;
        const originAdv = !!hasAdvFormData && notSameAdv ? hasAdvFormData.values.origin : null;
        const destAdv = !!hasAdvFormData && notSameAdv ? hasAdvFormData.values.destination : null;

        // ALSO check if the "to" and "from" on homepage.  These values should overwrite those in the advanced settings
        const hasHomepageFormData = this.props.homeDropdownsForm;
        const notSameHomepage = !!hasHomepageFormData ? hasHomepageFormData.values.origin !== hasHomepageFormData.values.destination : false;
        const originHomepage = !!hasHomepageFormData && notSameHomepage ? hasHomepageFormData.values.origin : null;
        const destHomepage = !!hasHomepageFormData && notSameHomepage ? hasHomepageFormData.values.destination : null;

        let finalOrigin = originHomepage ? originHomepage : originAdv;
        let finalDest = destHomepage ? destHomepage: destAdv;


        // multiple transactions
        const numTransactions = hasAdvFormData && hasAdvFormData.values.numTransactions ? hasAdvFormData.values.numTransactions : false;

        this.props.onGoPressed(finalOrigin, finalDest, numTransactions); // Update current active tab and dispatch action to get
                                                               // transaction data
    };

    handleLocationSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({ modalOpen: false }));
    };

    handleMultiSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({ modalOpen: false }));
    };

    handleCancel = () => {
        this.setState(() => ({ modalOpen: false }));
    };

    nodeIdToLocation = (nodeId, nodes) => {
        return nodes[nodeId].location;
    };

    drawMessage(advSettingsForm, nodes) {
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if (values) {
            if (values.numTransactions) { // multi transaction message
                return <h3 className='greeting'>Hit GO to send {values.numTransactions} Transactions!</h3>;
            } else if (values.origin && values.destination) { // two city message
                return <h3 className='greeting'>Hit GO to send Nano from {this.nodeIdToLocation(values.origin, nodes)}
                &nbsp;to {this.nodeIdToLocation(values.destination, nodes)}!</h3>;
            }
        }
        return <h4 className='greeting'>Hit GO to send Nano between two random nodes or choose an origin and destination below!</h4>;
    }

    render() {
        const { advSettingsForm, nodes, homeDropdownsForm } = this.props;
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
                    settings={advSettingsForm}
                />
                <h1 className='greeting page-header text-center'>Welcome to NanoSpeed.live!</h1>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            {this.drawMessage(advSettingsForm, nodes)}

                            <LocationDropdowns
                                nodes={nodes}
                                homeDropdownsForm={homeDropdownsForm}
                            />

                            <button type='button' className='btn btn-success btn-circle btn-xl' onClick={this.onClick}>
                                Go
                            </button>
                            <br/>

                            <button id='advanced-btn' type='button' className='btn btn-primary'
                                    onClick={this.onAdvancedClick}>Advanced
                            </button>
                            <br/>
                            <p className='greeting'>Run your live test now.</p>
                        </div>
                    </div>
                    <div/>
                    <div className="shadow-none p-3 mb-5 bg-light rounded">
                    <h5>What is Nano?</h5>
                    Nano is a next-generation cryptocurrency created by Colin LeMahieu for instant and free transactions.
                    It's block-lattice structure enables decentralized transactions without loss of security, speed, or high costs.
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        homeDropdownsForm: state.form.homepageLocations,
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
        },
        onAdvPressed() {
            dispatch(openAdvSettings());
        }
    };
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired,
    homeDropdownsForm: PropTypes.object,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);