import React from 'react';
import PropTypes from 'prop-types';
import 'styles/GoogleMaps.css';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '2';
const size = `1200x600`;
const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const HeatMap = ({nodeLocations}) => {
    const points = Object.keys(nodeLocations).map((id) => nodeLocations[id].coords);
    const markers = `size:small|${points.join('|')}`;
    // Google maps will auto zoom and fit any markers on a map
    return (
        <img className='GoogleHeatMap'
        src={`${base}?size=${size}&scale=${scale}&markers=${markers}&key=${googleKey}`}
        alt={'Google Map Showing Locations of Nodes'} />
    );
};

HeatMap.propTypes = {
    nodeLocations: PropTypes.object.isRequired
};

export default HeatMap;
