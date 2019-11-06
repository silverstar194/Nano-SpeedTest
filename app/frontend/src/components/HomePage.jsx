import React, { Component, Fragment } from 'react';
import AdvancedModal from './AdvancedModal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTransaction } from '../actions/table';
import '../styles/HomePage.css';
import '../styles/nanospeed.css';
import {addPastResults} from 'actions/pastResults';
import { openAdvSettings } from '../actions/advancedModal';
import LocationDropdowns from './LocationDropdowns';
import { Helmet } from "react-helmet";
import PastResultsTable from './HistoricalData/PastResultsTable';
import UserResultsPage from 'components/UserResultsPage';
import NavBar from './NavBar';
import CurrentTransactionsView from 'components/CurrentTransactions/CurrentTransactionsView';

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

    render() {
        const { advSettingsForm, nodes, history } = this.props;
        const {pastTransactions, table, totalTransactions, globalAverage, nodeLocations} = this.props;

        const plotData = [];
        pastTransactions.sort((a,b) => a.endSendTimestamp - b.endSendTimestamp)
        .forEach((transaction, i) => {
            plotData.push({
                x: i,
                y: transaction.elapsedTime,
                date: transaction.endSendTimestamp,
                origin: transaction.origin.nodeLocation,
                destination: transaction.destination.nodeLocation,
                PoWCached: transaction.PoWCached,
            });
        });


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
        <main className="index-main">
            <NavBar />
            <div className="index-main-area-one">
               <div className="index-main-header__heading center-horizontally max-width">This site demonstrates how Nano can be used to send money globally without fees, long waits, or hassle.</div>
                <LocationDropdowns
                  nodes={nodes}
                  table={table}
                  history={history}
                  settings={advSettingsForm}
                  show={this.showDropdowns}
                />
            </div>
            <div className="index-main-area-two">
               <div className="ad__wrapper center-horizontally max-width">
                  <div className="ad__text">💥 Insert your Nano project here. Gain traction at a low cost. Support our servers with 90% discounted ad.</div>
                  <div className="ad__community__link">AD</div>
               </div>
                <UserResultsPage />
            </div>
            <div className="index-main-area-three">
              <PastResultsTable tableData={pastTransactions}/>
            </div>
         </main>
         </div>

        );
    }
}

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
        },
        fetchedPastData(data) {
          dispatch(addPastResults(data));
        }
    };
};

const mapStateToProps = (state) => {
    return {
        advSettingsForm: state.form,
        nodes: state.nodes,
        pastTransactions: state.pastResults.pastTransactions,
        table: state.table,
        totalTransactions: state.pastResults.totalTransactions,
        globalAverage: state.pastResults.globalAverage,
        nodeLocations: state.nodes
    };
};

HomePage.propTypes = {
    onGoPressed: PropTypes.func.isRequired,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.array,
    pastTransactions: PropTypes.array.isRequired,
    table : PropTypes.object,
    totalTransactions: PropTypes.number,
    globalAverage: PropTypes.number,
    nodeLocations: PropTypes.array
};

HomePage.defaultProps = {
    totalTransactions: 0,
    globalAverage: 0,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);