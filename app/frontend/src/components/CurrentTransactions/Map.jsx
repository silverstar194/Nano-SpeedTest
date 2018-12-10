import React from 'react';
import PropTypes from 'prop-types';
import 'styles/GoogleMaps.css';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '2';
var sizeTemp = '1200x400'

var w = window.innerWidth;

if(w && w !== 0 && w < 700){
        sizeTemp = w+'x'+(w*3)
}

const size = sizeTemp


const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const makeCoordinate = (point) => {
    return `${point.latitude},${point.longitude}`;
};

const Map = ({origin, destination}) => {
    const locations = `${makeCoordinate(origin)}|${makeCoordinate(destination)}`;
    const markers = `size:small|${locations}`;
    return (
        <img className='GoogleMap'
        src={`${base}?size=${size}&scale=${scale}&markers=${markers}&path=${locations}&key=${googleKey}`}
        alt={'Google Map Showing Destination and Origin'} />
    );
};

Map.propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired
};

export default Map;
