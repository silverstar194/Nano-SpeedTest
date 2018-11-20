import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Ad from './Ad';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { switchTab } from '../actions/navigation';
import { fetchTransaction } from '../actions/table';
import '../styles/AdBuild.css';

class BuildAd extends Component {
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
        return (
         <div className='AdBuild'>
               <Header/>

               <div class="form-container">
                    <h3>Create Ad</h3>
                    <b>Live Preview</b>
                    <Ad/>
                    <br/>

                   <h3>Ad Content</h3>
                   <form>
                      <div class="form-group">
                        <label for="title">Title</label>
                        <small> (max. 40 chars)</small>
                        <input type="text" class="form-control" id="title"  placeholder="Enter title"></input>
                      </div>
                      <div class="form-group">
                        <label for="description">Description</label>
                        <small> (max. 120 chars)</small>
                        <input type="text" class="form-control" id="description" placeholder="Enter description"></input>
                      </div>
                      <div class="form-group">
                        <label for="url">Destination URL</label>
                        <input type="url" class="form-control" id="url" placeholder="Enter URL"></input>
                      </div>

                      <h3>Timing & Pricing</h3>
                      <p>Your ad will run from <b>DATE ONE</b> to <b>DATE TWO</b></p>

                      <h4>Ad Slots</h4>
                      <p>Each Slot represents 5% of all Nanode impressions for the month and are available on a first-come, first-served basis.</p>

                         <div class="form-group">
                              <div class="col-sm-10">
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="1" checked></input>
                                  <label class="form-check-label" for="gridRadios1">
                                     <b>1 Slot (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="2"></input>
                                  <label class="form-check-label" for="gridRadios2">
                                     <b>2 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="3"></input>
                                  <label class="form-check-label" for="gridRadios3">
                                    <b> 3 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios4" value="4"></input>
                                  <label class="form-check-label" for="gridRadios4">
                                     <b>4 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div class="form-check">
                                  <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios5" value="5"></input>
                                  <label class="form-check-label" for="gridRadios5">
                                    <b>5 Slots (PLACEHOLD NANO)</b>
                                  </label>
                              </div>
                            </div>
                          </div>

                         <h4>Contact Info</h4>
                         <div class="form-group">
                            <label for="title"><b>Project Name</b></label>
                            <br/>
                            <small>Used only for reference, will not part of ad.</small>
                            <input type="text" class="form-control" id="title"  placeholder="Enter title"></input>
                      </div>
                      <div class="form-group">
                            <label for="description"><b>E-mail Address</b></label>
                            <input type="text" class="form-control" id="description" placeholder="Enter description"></input>
                      </div>

                       <p>Your ad will be reviewed within 24 hours and you'll receive an e-mail. <b>If your ad is approved, you must submit payment in order to secure your ad slot(s).</b></p>
                      <button type="submit" class="btn btn-success">Submit</button>
                    </form>
                </div>
                <Footer/>
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

BuildAd.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildAd);