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

const Map = ({transactions}) => {
    let transactionPairs = [];
    transactions.forEach((trans) => {
        transactionPairs.push(`${makeCoordinate(trans.origin)}|${makeCoordinate(trans.destination)}`);
    });
    const locations = transactionPairs.join('|'); // gives all locations in one single string
    const markers = `size:small|${locations}`;
    const paths = transactionPairs.join('&path='); // each needs to be draw separately


    return (
        <img className='GoogleMap'
        src={`${base}?size=${size}&scale=${scale}&markers=${markers}&path=${paths}&key=${googleKey}`}
        alt={'Google Map Showing Destination and Origin'} />
    );
};

Map.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default Map;
