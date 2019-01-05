import React, { Component } from 'react';
import Ad from './Ad';
import AdvancedModal from './AdvancedModal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTransaction } from '../actions/table';
import '../styles/HomePage.css';
import { openAdvSettings } from '../actions/advancedModal';
import LocationDropdowns from './LocationDropdowns';
import { Helmet } from "react-helmet";

class HomePage extends Component {
    // component specific state -- don't need to add to redux store
    state = {
        modalOpen: false,
    };

    // putting this in state would make us need to call setState() inside the render function.  React doesn't like that.
    showDropdowns = true;

    dismiss = () => {
        var x = document.getElementById("alert-info");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    onAdvancedClick = () => {
        this.props.onAdvPressed();
        this.setState(() => ({ modalOpen: true }));
    };

    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Results');

        // check if user selected locations to send to and from.  Error if it is NOT the case
        // that they selected two different valid locations
        const hasAdvFormData = this.props.advSettingsForm.advSettings;
        const notSameAdv = !!hasAdvFormData && hasAdvFormData.values ? hasAdvFormData.values.origin !== hasAdvFormData.values.destination : false;
        const originAdv = !!hasAdvFormData && notSameAdv ? hasAdvFormData.values.origin : null;
        const destAdv = !!hasAdvFormData && notSameAdv ? hasAdvFormData.values.destination : null;

        // multiple transactions
        const numTransactions = hasAdvFormData && hasAdvFormData.values && hasAdvFormData.values.numTransactions ? parseInt(hasAdvFormData.values.numTransactions) : false;

        this.props.onGoPressed(originAdv, destAdv, numTransactions); // Update current active tab and dispatch action to get
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

    nodeIdToLocation = (nodeId, nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === parseInt(nodeId)) {
                return nodes[i].location;
            }
        }
    };

    drawMessage(advSettingsForm, nodes) {
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if (values) {
            if (values.numTransactions) { // multi transaction message
                this.showDropdowns = false;
                return <h3 className='greeting'>Hit GO to send {values.numTransactions} random Transactions!</h3>;
            } else if (values.origin && values.destination) { // two city message
                this.showDropdowns = true;
                return <h3 className='greeting'>Hit GO to send Nano from {this.nodeIdToLocation(values.origin, nodes)}
                    &nbsp;to {this.nodeIdToLocation(values.destination, nodes)}!</h3>;
            }
        }
    }

    render() {
        const { advSettingsForm, nodes } = this.props;

        return (
            <div className='HomePage'>
            <Helmet>
                <title>NanoSpeed.live</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="The fastest way to try out Nano. Run a speed test instantly. No wallets, accounts or sign up."
                 />
            </Helmet>

                <Ad/>
                <AdvancedModal
                    open={this.state.modalOpen}
                    handleLocationSettings={this.handleLocationSettings}
                    handleMultiSettings={this.handleMultiSettings}
                    nodes={nodes}
                    settings={advSettingsForm}
                />
                <h1 className='greeting page-header text-center'>Welcome to NanoSpeed.live!</h1>
                <div className='container'>
                    <div className='row justify-content-end'>
                        <div className='col-12 text-center'>
                            {this.drawMessage(advSettingsForm, nodes)}
                            <LocationDropdowns
                                nodes={nodes}
                                settings={advSettingsForm}
                                show={this.showDropdowns}
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
                    <div id="alert-info" className="alert alert-success alert-dismissible fade show" role="alert">
                        <h4 className="alert-heading">Welcome!</h4>
                            <p>Press the 'GO' button to send a small random amount of Nano between various locations worldwide using funds in our demo wallets.
                                This site demonstrates how Nano can be used to send money internationally without fees, long waits, or hassle.
                                All transactions are executed as you see them live and provide you with an insight into the speed and efficiency of Nano.</p>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.dismiss}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <a href="/Info">More Info</a>
                    </div>

                    <div className="shadow-none p-3 mb-5 bg-light rounded">
                        <h5>What is Nano?</h5>
                        Nano is a next-generation cryptocurrency created in 2015. It's unique block-lattice structure enables fast, fee-less transactions over a secure, decentralized network.
                    </div>
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
                let transactions = [];
                for (let i = 0; i < multi; i++) {
                    transactions.push({
                        originNodeId: null,
                        destinationNodeId: null
                    });
                }
                dispatch(fetchTransaction(multi, {
                    transactions
                }));
            } else {
                dispatch(fetchTransaction(1, {
                    transactions: [{
                        originNodeId: origin,
                        destinationNodeId: dest
                    }]
                }));
            }
        },
        onAdvPressed() {
            dispatch(openAdvSettings());
        }
    };
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);