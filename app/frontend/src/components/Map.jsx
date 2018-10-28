import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import '../styles/Map.css';

const la = {lat: 34.055000, lng: -118.237742};
const sf = {lat: 37.768249, lng: -122.445145};

// fitBounds method requires knowing the corners of the map
// either {ne, sw} or {nw, se} -> this method takes two points and returns them formated correctly
const makeBounds = (locA, locB) => {
    let coords = {};
    if (locA.lat > locB.lat) {
        if (locA.lng > locB.lng) {
            coords['ne'] = locA;
            coords['sw'] = locB;
        } else {
            coords['nw'] = locA;
            coords['se'] = locB;
        }
    } else {
        if (locA.lng > locB.lng) {
            coords['se'] = locA;
            coords['nw'] = locB;
        } else {
            coords['sw'] = locA;
            coords['ne'] = locB;
        }
    }
    return coords;
};

const bounds = makeBounds(sf,la);

const size = {
    width: 960, // Map width in pixels
    height: 400, // Map height in pixels
};

const {center, zoom} = fitBounds(bounds, size);

export default class Map extends Component {
    static defaultProps = { // will need to accept values through props
        center,
        zoom
    }
    render() {
        return (
            <div className='google-map'>
                <GoogleMapReact
                    bootstrapURLKeys={{key: 'AIzaSyD27p9eUBuinHJFiVnnT6EA8tLm1bDAgow'}} //TODO should change key from mine to nano
                    options={{
                        zoomControl: false,
                        gestureHandling: 'none',
                        draggableCursor: 'default',
                        disableDefaultUI: true
                    }}
                    defaultCenter={ this.props.center }
                    defaultZoom={ this.props.zoom }>
                </GoogleMapReact>
            </div>
        );
    }
}