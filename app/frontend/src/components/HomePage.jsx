import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTransaction } from '../actions/table';
import '../styles/nanospeed.css';
import {addPastResults} from 'actions/pastResults';
import { openAdvSettings } from '../actions/advancedModal';
import LocationDropdowns from './LocationDropdowns';
import { Helmet } from "react-helmet";
import PastResultsTable from './HistoricalData/PastResultsTable';
import UserResultsPage from 'components/UserResultsPage';
import NavBar from './NavBar';
import Ad from 'components/Ad';

const viewItems = 20;

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
        const {pastTransactions, table} = this.props;
        var pastTransactionsTemp = pastTransactions.slice(0, viewItems)
        const plotData = [];
        pastTransactionsTemp.sort((a,b) => a.endSendTimestamp - b.endSendTimestamp)
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
            <div className="index-wave">
                <div className="index-wave-1">
                    <svg width="100%" height="172" viewBox="0 0 100% 172" fill="none">
                        <path fill="rgba(234, 137, 31, 0.69)">
                           <animate repeatCount="indefinite" fill="freeze" attributeName="d" dur="8s"
                                    values="M0 25.9086C277 84.5821 433 65.736 720 25.9086C934.818 -3.9019 1214.06 -5.23669 1442 8.06597C2079 45.2421 2208 63.5007 2560 25.9088V171.91L0 171.91V25.9086Z;
                        
                                             M0 86.3149C316 86.315 444 159.155 884 51.1554C1324 -56.8446 1320.29 34.1214 1538 70.4063C1814 116.407 2156 188.408 2560 86.315V232.317L0 232.316V86.3149Z;
                        
                                             M0 53.6584C158 11.0001 213 0 363 0C513 0 855.555 115.001 1154 115.001C1440 115.001 1626 -38.0004 2560 53.6585V199.66L0 199.66V53.6584Z;
                        
                                             M0 25.9086C277 84.5821 433 65.736 720 25.9086C934.818 -3.9019 1214.06 -5.23669 1442 8.06597C2079 45.2421 2208 63.5007 2560 25.9088V171.91L0 171.91V25.9086Z;" />
                        </path>
                     </svg>
                  </div>
                  <div className="index-wave-2">
                     <svg width="100%" height="172" viewBox="0 0 100% 172" fill="none">
                        <path fill="#ea891f">
                           <animate repeatCount="indefinite" fill="freeze" attributeName="d" dur="20s"
                                    values="M0 25.9086C277 84.5821 433 65.736 720 25.9086C934.818 -3.9019 1214.06 -5.23669 1442 8.06597C2079 45.2421 2208 63.5007 2560 25.9088V171.91L0 171.91V25.9086Z;
                        
                                             M0 86.3149C316 86.315 444 159.155 884 51.1554C1324 -56.8446 1320.29 34.1214 1538 70.4063C1814 116.407 2156 188.408 2560 86.315V232.317L0 232.316V86.3149Z;
                        
                                             M0 53.6584C158 11.0001 213 0 363 0C513 0 855.555 115.001 1154 115.001C1440 115.001 1626 -38.0004 2560 53.6585V199.66L0 199.66V53.6584Z;
                        
                                             M0 25.9086C277 84.5821 433 65.736 720 25.9086C934.818 -3.9019 1214.06 -5.23669 1442 8.06597C2079 45.2421 2208 63.5007 2560 25.9088V171.91L0 171.91V25.9086Z;" />
                        </path>
                    </svg>
                </div>
            </div>
            <div className="index-main-area-two">
               <Ad/>
               <UserResultsPage />
            </div>
            <div className="stats-main-area-three max-width">
              <PastResultsTable tableData={pastTransactionsTemp}/>
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
    };
};

HomePage.propTypes = {
    onGoPressed: PropTypes.func.isRequired,
    advSettingsForm: PropTypes.object,
    nodes: PropTypes.array,
    pastTransactions: PropTypes.array.isRequired,
    table : PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);