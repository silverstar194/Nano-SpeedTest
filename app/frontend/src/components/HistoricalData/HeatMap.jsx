import React from 'react';
import PropTypes from 'prop-types';
import 'styles/GoogleMaps.css';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '2';
const size = `1200x600`;
const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const makeCoordinate = (point) => {
    return `${point.latitude},${point.longitude}`;
};


const fakeLocations = [
    {
        id: 2,
        nodeLocation: 'Mumbai',
        latitude: 37.785,
        longitude: -122.447
    },
    {
        id: 4,
        nodeLocation: 'Japan',
        latitude: 36.2048,
        longitude: 138.2529
    },
    {
        id: 3,
        nodeLocation: 'Virginia',
        latitude: 34.782,
        longitude: -132.445
    }
];

const HeatMap = ({nodeLocations}) => { //TODO - will eventually read from node locations
    const points = fakeLocations.map((node) => makeCoordinate(node));
    const markers = `size:small|${points.join('|')}`;
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
