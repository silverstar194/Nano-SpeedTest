import React from 'react';
import PropTypes from 'prop-types';
import 'styles/GoogleMaps.css';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '2';
let sizeTemp = '1200x400';

const w = window.innerWidth;

if(w && w !== 0 && w < 800){
    sizeTemp = w+'x'+(w*3);
}

const size = sizeTemp;

const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const makeCoordinate = (point) => {
    return `${point.latitude},${point.longitude}`;
};

const countUses = (transaction, transactions, isOrigin) => {
    let duplicatesCountOrigin = 0
    let duplicatesCountDestination = 0
    for(let i = 0; i < transactions.length; i++){
       if(transaction.origin.nodeLocation === transactions[i].origin.nodeLocation || transaction.origin.nodeLocation === transactions[i].destination.nodeLocation){
            duplicatesCountOrigin+=1;
       }

        if(transaction.destination.nodeLocation === transactions[i].destination.nodeLocation || transaction.destination.nodeLocation === transactions[i].origin.nodeLocation){
            duplicatesCountDestination+=1;
       }
    }

    if(isOrigin){
        return duplicatesCountOrigin
    }

    return duplicatesCountDestination;
}

const Map = ({transactions}) => {
    let transactionPairs = [];
    let markerPairs = []

    transactions.forEach((trans) => {
        transactionPairs.push(`${makeCoordinate(trans.origin)}|${makeCoordinate(trans.destination)}`);
        markerPairs.push(`markers=color:0x4A90E2|label:${countUses(trans, transactions, true)}|${makeCoordinate(trans.origin)}&markers=color:0x4A90E2|label:${countUses(trans, transactions, false)}|${makeCoordinate(trans.destination)}`);
    });

    const locations = transactionPairs.join('|'); // gives all locations in one single string
    const paths = transactionPairs.join('&path='); // each needs to be draw separately
    const markers = markerPairs.join("&")
    
    return (
        <img className='GoogleMap'
        src={`${base}?size=${size}&scale=${scale}&${markers}&path=${paths}&key=${googleKey}`}
        alt={'Google Map Showing Destination and Origin'} />
    );
};

Map.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default Map;
