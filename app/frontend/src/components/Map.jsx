import React from 'react';
import PropTypes from 'prop-types';
import '../styles/GoogleMaps.css';

const Map = ({origin, destination}) => {
    const base = 'https://maps.googleapis.com/maps/api/staticmap';
    const scale = '2';
    const size = `1200x400`;
    const googleKey = 'AIzaSyD27p9eUBuinHJFiVnnT6EA8tLm1bDAgow';

    const locations = `${origin.nodeLocation}|${destination.nodeLocation}`;
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
