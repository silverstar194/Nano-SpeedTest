import React, { Component } from 'react';
import { connect } from 'react-redux';


const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '4';
let sizeTemp = '1500x390';

const size = sizeTemp;

const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const makeCoordinate = (point) => {
    return `${point.latitude},${point.longitude}`;
};


class Map extends Component  {


    render() {
         let transactionPairs = [];
         let markerPairs = []
         const {numToRerun, table } = this.props;
         const mostRecent = table && table.length && table.slice(table.length - numToRerun); // get the last numToRerun transactions

         console.log(mostRecent)
         if(mostRecent.length > 0){
           console.log(mostRecent.length)
           mostRecent.forEach((trans) => {
                transactionPairs.push(`${makeCoordinate(trans.origin)}|${makeCoordinate(trans.destination)}`);
                markerPairs.push(`markers=color:0x4A90E2|${makeCoordinate(trans.origin)}&markers=color:0x4A90E2|${makeCoordinate(trans.destination)}`);
            });

            const paths = transactionPairs.join('&path='); // each needs to be draw separately
            const markers = markerPairs.join("&")

            return (
                <img className="transaction-box-map"
                src={`${base}?size=${size}&zoom=2&scale=${scale}&${markers}&path=${paths}&key=${googleKey}`}
                alt={'Google Map Showing Destination and Origin'} />
            );
         }
        return(<div className="loader"></div>)
    }

};

const mapStateToProps = (state) => {
    return {
        numToRerun: state.table.num,
        table: state.table.rows,
        initialValues: {
            origin: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[0]].id : undefined,
            destination: Object.keys(state.nodes).length ? state.nodes[Object.keys(state.nodes)[2]].id : undefined
        }
    };

};

export default connect(mapStateToProps)(Map);
