import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { change } from 'redux-form';
import '../styles/LocationDropdowns.css';
import { connect } from 'react-redux';
import '../styles/Field.css';


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

        for(var i = 0; i < buttons.length; i++){
            var buttonId = buttons[i].value.replace("origin", "").replace("destination", "");
            if(buttons[i].value.includes("destination") && buttonId == origin.value.replace("origin", "")){
                buttons[i].disabled = true;
            }

            if(buttons[i].value.includes("origin") && buttonId == destination.value.replace("destination", "")){
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
                this.props.dispatch(change('advSettings', 'origin', button.value.replace("origin"), ""));
            }

        }

        if(button.value.includes("destination")){
            for(var i = 0; i < buttons.length; i++){
                buttons[i].classList.remove("selection-button-two");
                if(buttons[i].value.includes("origin")){
                    buttons[i].disabled = false;
                }
            }  
            button.classList.add("selection-button-two");
            if(values){
                this.props.dispatch(change('advSettings', 'destination', button.value.replace("destination"), ""));
            }
        }

        if(button.value.includes("origin")){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].value.includes("destination") && button.value.replace("origin") == buttons[i].value.replace("destination")){
                    buttons[i].disabled = true;
                }
            }
        }

        if(button.value.includes("destination")){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].value.includes("origin") && button.value.replace("destination") == buttons[i].value.replace("origin")){
                    buttons[i].disabled = true;
                }
            }
        }
    }

    generateNodeDestinationList(nodes) {
      var indents = [];
      for (var i = 0; i < nodes.length; i++) {
        var el = null;
        if(i == 2){
          el = <button className="transaction-box__choice__button selection-button-two" value={nodes[i].id+"destination"} onClick={(e) => this.handleButton(e)}>{nodes[i].location}</button>;
        } else {
          el = <button className="transaction-box__choice__button" value={nodes[i].id+"destination"} onClick={(e) => this.handleButton(e)}>{nodes[i].location}</button>;
        }
        indents.push(el);
      }
      return (
        <Fragment>
          {indents}
       </Fragment>
      );
    }

    generateNodeOrginsList(nodes) {
      var indents = [];
      for (var i = 0; i < nodes.length; i++) {
        var el = null;
        if(i == 0){
          el = <button className="transaction-box__choice__button selection-button-one" value={nodes[i].id+"origin"} onClick={(e) => this.handleButton(e)}>{nodes[i].location} </button>;
        } else {
          el = <button className="transaction-box__choice__button" value={nodes[i].id+"origin"} onClick={(e) => this.handleButton(e)}>{nodes[i].location} </button>;
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

    render() {
        const { nodes, settings, show } = this.props;
        const nodeOriginsList = this.generateNodeOrginsList(this.props.nodes);
        const nodeDestinationsList = this.generateNodeDestinationList(this.props.nodes);
        const drawMessage = this.drawMessage(this.props.settings, this.props.nodes)
        this.initButtons();

        return (
            <Fragment>
            <form>
            <div className="index-main-header__transaction-box center-horizontally max-width">
                <div className="transaction-box__text center-horizontally"> 
                {drawMessage}
                  </div>
                  <div className="transaction-box__go__button center-horizontally">GO</div>
                  <div className="transaction-box__choice__button__one__wrapper button center-horizontally">
                     <div className="transaction-box__choice__header__text">ORIGIN</div>
                      {nodeOriginsList}
                    </div>
                  <div className="transaction-box__choice__button__two__wrapper center-horizontally">
                     <div className="transaction-box__choice__header__text">DESTINATION</div>
                      {nodeDestinationsList}
                  </div>
               </div>
             </form>
            </Fragment>
        );
    }
}
// Allows form to communicate with store
LocationDropdowns = reduxForm({
    // a unique name for the form
    form: 'advSettings',
    enableReinitialize: true
})(LocationDropdowns);
// now set initialValues using data from your store state
LocationDropdowns = connect(
    state => ({
        initialValues: {
            origin: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[0]].id : undefined,
            destination: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[2]].id : undefined,
        }
    }),
)(LocationDropdowns);
export default LocationDropdowns;