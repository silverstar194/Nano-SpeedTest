import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { change } from 'redux-form';
import '../styles/LocationDropdowns.css';
import { connect } from 'react-redux';
import '../styles/Field.css';
import { fetchTransaction } from '../actions/table';
import Map from './CurrentTransactions/Map';
import LinearProgress from '@material-ui/core/LinearProgress';

class LocationDropdowns extends Component {

    initButtons(){
        var buttons = document.getElementsByClassName("transaction-box__choice__button");
        var origin = undefined;
        var destination = undefined;
        for(var i = 0; i < buttons.length; i++){
            if(buttons[i].value.includes("origin") && buttons[i].classList.contains("selection-button-one")){
                origin = buttons[i];
            }

            if(buttons[i].value.includes("destination") && buttons[i].classList.contains("selection-button-two")){
                destination = buttons[i];
            }
        }

        for(i = 0; i < buttons.length; i++){
            var buttonId = buttons[i].value.replace("origin", "").replace("destination", "");
            if(buttons[i].value.includes("destination") && buttonId === origin.value.replace("origin", "")){
                buttons[i].disabled = true;
            }

            if(buttons[i].value.includes("origin") && buttonId === destination.value.replace("destination", "")){
                buttons[i].disabled = true;
            }
        }
    }

    handleButton(button) {
        const { values } = (this.settings || this.props.settings.advSettings) || {};

        button.preventDefault();
        var buttons = document.getElementsByClassName("transaction-box__choice__button");
        button = button.target || button.srcElement;

        if(button.value.includes("origin")){
            for(var i = 0; i < buttons.length; i++){
                buttons[i].classList.remove("selection-button-one");
                if(buttons[i].value.includes("destination")){
                    buttons[i].disabled = false;
                }
            }
            button.classList.add("selection-button-one");
            if(values){
                this.props.dispatch(change('advSettings', 'origin', parseInt(button.value.replace("origin"), "")));
            }

        }

        if(button.value.includes("destination")){
            for(i = 0; i < buttons.length; i++){
                buttons[i].classList.remove("selection-button-two");
                if(buttons[i].value.includes("origin")){
                    buttons[i].disabled = false;
                }
            }  
            button.classList.add("selection-button-two");
            if(values){
                this.props.dispatch(change('advSettings', 'destination', parseInt(button.value.replace("destination"), "")));
            }
        }

        if(button.value.includes("origin")){
            for(i = 0; i < buttons.length; i++){
                if(buttons[i].value.includes("destination") && button.value.replace("origin") === buttons[i].value.replace("destination")){
                    buttons[i].disabled = true;
                }
            }
        }

        if(button.value.includes("destination")){
            for(i = 0; i < buttons.length; i++){
                if(buttons[i].value.includes("origin") && button.value.replace("destination") === buttons[i].value.replace("origin")){
                    buttons[i].disabled = true;
                }
            }
        }
    }

    sendTransaction(advSettingsForm, button){
        button.preventDefault();
        
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if(values){
                this.props.dispatch(fetchTransaction(1, {
                        transactions: [{
                        originNodeId: values.origin,
                        destinationNodeId: values.destination
                    }]
                }));
            var card = document.getElementsByClassName("card")[0];
            card.classList.add('is-flipped')
        }
    }

    generateNodeDestinationList(nodes) {
      var indents = [];
      for (var i = 0; i < nodes.length; i++) {
        var el = null;
        if(i === 2){
          el = <button className="transaction-box__choice__button selection-button-two" value={nodes[i].id+"destination"} key={nodes[i].id+"destination"} onClick={(e) => this.handleButton(e)}>{nodes[i].location}</button>;
        } else {
          el = <button className="transaction-box__choice__button" value={nodes[i].id+"destination"} key={nodes[i].id+"destination"} onClick={(e) => this.handleButton(e)}>{nodes[i].location}</button>;
        }
        indents.push(el);
      }
      return (
        <Fragment>
          {indents}
       </Fragment>
      );
    }

    generateNodeOriginsList(nodes) {
      var indents = [];
      for (var i = 0; i < nodes.length; i++) {
        var el = null;
        if(i === 0){
          el = <button className="transaction-box__choice__button selection-button-one" value={nodes[i].id+"origin"} key={nodes[i].id+"origin"} onClick={(e) => this.handleButton(e)}>{nodes[i].location} </button>;
        } else {
          el = <button className="transaction-box__choice__button" value={nodes[i].id+"origin"} key={nodes[i].id+"origin"} onClick={(e) => this.handleButton(e)}>{nodes[i].location} </button>;
        }
        indents.push(el);
      }
      return (
        <Fragment>
          {indents}
       </Fragment>
      );
    }

    nodeIdToLocation = (nodeId, nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === parseInt(nodeId)) {
                return nodes[i].location;
            }
        }
    };

    drawMessage(advSettingsForm, nodes) {
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if(values){
        return (
                <Fragment>
                HIT GO TO SEND NANO FROM <div className="active-one"> {this.nodeIdToLocation(values.origin, nodes)} </div> TO <div className="active-two"> {this.nodeIdToLocation(values.destination, nodes)} </div>
                </Fragment>
               );
        }
    };

    drawDestination(advSettingsForm, nodes) {
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if(values){
        return (
                <Fragment>
                <div className="active-two"> {this.nodeIdToLocation(values.destination, nodes)} </div>
                </Fragment>
               );
        }
    };

    drawOrigin(advSettingsForm, nodes) {
        const { values } = (advSettingsForm && advSettingsForm.advSettings) || {};
        if(values){
        return (
                <Fragment>
                <div className="active-one"> {this.nodeIdToLocation(values.origin, nodes)} </div>
                </Fragment>
               );
        }
    };

    render() {

        const {table, numToRerun, isFetchingTiming, isFetchingTransaction, pastTransactions } = this.props;
        var sendMessage = 'Send Again';
        sendMessage = !isFetchingTiming && isFetchingTransaction ? "Processing" : sendMessage;
        sendMessage = isFetchingTiming && !isFetchingTransaction ? "Sending" : sendMessage;
        // render the jsx
        const mostRecent = pastTransactions && pastTransactions.length && pastTransactions.slice(pastTransactions.length - 1)[0]; // get the last numToRerun transactions
        console.log(mostRecent)

        var time = "-";
        if(!isFetchingTransaction && !isFetchingTiming){
            time = (mostRecent.endSendTimestamp - mostRecent.startSendTimestamp) / 1000.0 + "s"
        }

        const nodeOriginsList = this.generateNodeOriginsList(this.props.nodes);
        const nodeDestinationsList = this.generateNodeDestinationList(this.props.nodes);
        const drawMessage = this.drawMessage(this.props.settings, this.props.nodes)
        const destination = this.drawDestination(this.props.settings, this.props.nodes);
        const origin = this.drawOrigin(this.props.settings, this.props.nodes);

         var loader;
         if(isFetchingTransaction || isFetchingTiming){
            loader = <LinearProgress className="loader-custom" variant="indeterminate" value={0}/>
         }else{
            loader = <div className="loader-custom"></div>
         }


        this.initButtons();

        return (
            <Fragment>
            <form>
            <div className="card max-width center-horizontally">
                <div className="index-main-header__transaction-box ">
                <div className="transaction-box__text center-horizontally"> 
                {drawMessage}
                  </div>
                  <button className="transaction-box__go__button center-horizontally" onClick={(e) => this.sendTransaction(this.props.settings, e)}>GO</button>
                  <div className="transaction-box__choice__button__one__wrapper button center-horizontally">
                     <div className="transaction-box__choice__header__text">ORIGIN</div>
                      {nodeOriginsList}
                    </div>
                  <div className="transaction-box__choice__button__two__wrapper center-horizontally">
                     <div className="transaction-box__choice__header__text">DESTINATION</div>
                      {nodeDestinationsList}
                  </div>
                </div>
                <div className="transaction-box-back center-horizontally">
                    <Map />
                    <div className="transaction-box-footer">
                        <div className="transaction-box-footer-location">
                            <div className="transaction-box-footer-location-origin">
                            {origin}
                            </div>
                            <div>
                               {loader}
                            </div>
                            <div className="transaction-box-footer-location-destination">
                            {destination}
                            </div>

                        </div>
                        <div className="transaction-box-footer-time">Transaction time: <div className="transaction-box-footer-text ">{time}</div></div>
                        <div className="transaction-box-footer-try-again" onClick={
                                        () => this.props.onRerun(numToRerun, table, isFetchingTransaction, isFetchingTiming)}>{sendMessage}</div>
                    </div>
                </div>
            </div>
             </form>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        numToRerun: state.table.num,
        table: state.table.rows,
        pastTransactions: state.pastResults.pastTransactions,
        isFetchingTransaction: state.transactions.isFetchingTransaction,
        isFetchingTiming: state.transactions.isFetchingTiming,
        latestTransaction: state.pastResults.pastTransactions && state.pastResults.pastTransactions.length > 0 ? state.pastResults.pastTransactions.length[0] : undefined,
        initialValues: {
            origin: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[0]].id : undefined,
            destination: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[2]].id : undefined
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRerun(multi, table, isFetchingTransaction, isFetchingTiming) {
            if(isFetchingTransaction || isFetchingTiming)
            {
            return;
            }

            if (multi > 1) {
                let transactions = [];
                for (let i = 1; i <= multi; i++) {
                    transactions.push({
                        originNodeId: table[table.length - i].origin.id.toString(),
                        destinationNodeId: table[table.length - i].destination.id.toString(),
                    });
                }
                transactions = transactions.reverse();
                dispatch(fetchTransaction(multi, {
                    transactions
                }));
            } else {
                dispatch(fetchTransaction(1, {
                    transactions: [{
                        originNodeId: table[table.length - 1].origin.id.toString(),
                        destinationNodeId: table[table.length - 1].destination.id.toString(),
                    }]
                }));
            }
        }
    };
 }


// Allows form to communicate with store
LocationDropdowns = reduxForm({
    // a unique name for the form
    form: 'advSettings',
    enableReinitialize: true
})(LocationDropdowns);


export default connect(mapStateToProps, mapDispatchToProps)(LocationDropdowns);
