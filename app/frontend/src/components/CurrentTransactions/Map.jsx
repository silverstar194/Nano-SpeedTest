import React from 'react';
import PropTypes from 'prop-types';
import 'styles/GoogleMaps.css';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '4';
let sizeTemp = '1500x390';

const size = sizeTemp;

const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const makeCoordinate = (point) => {
    return `${point.latitude},${point.longitude}`;
};

const Map = ({transactions}) => {
    let transactionPairs = [];
    let markerPairs = []
    if(transactions.rows.length > 0){
    transactions.rows.forEach((trans) => {
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
    return(<div></div>)

};

Map.propTypes = {
};

export default Map;
