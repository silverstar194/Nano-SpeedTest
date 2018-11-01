import React from 'react';
import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Polyline, Marker } from 'react-google-maps';
import '../styles/GoogleMaps.css';

class TestMap extends React.Component {
    state = {
        mapLoaded: false
    };
    // Updates the map window once it is loaded to only show the distance between the two cities
    recomputeBounds() {
        const {cities} = this.props;
        const bounds = new window.google.maps.LatLngBounds();
        cities.map((city) => bounds.extend(city.coords));
        this.refs.map.fitBounds(bounds);
        this.setState({mapLoaded: true});
    }
    render() {
        const {cities} = this.props;
        const {mapLoaded} = this.state;

        return (
            <GoogleMap
                ref='map'
                defaultZoom={2}
                defaultCenter={{ lat: 0, lng: 0 }}
                defaultOptions={{ // disable moving and zooming the map
                    zoomControl: false,
                    gestureHandling: 'none',
                    draggableCursor: 'default',
                    disableDefaultUI: true
                }}
                onTilesLoaded={() => this.recomputeBounds()}
            >
            { // the map needs to render before recomputing and drawing markers and lines
                mapLoaded ? (
                    <div>
                        <Polyline
                            path={[this.props.cities[0].coords, this.props.cities[1].coords]}
                            options={{
                                clickable: false,
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                geodesic: true,
                            }}
                        />
                        {cities.map((city) =>
                            <Marker
                                key={city.name}
                                title={city.name}
                                position={city.coords}
                                clickable={false}
                            />
                        )}
                    </div>

                ) : null

            }

            </GoogleMap>
        );
  }
}

const Map = compose(
    withProps({
        loadingElement: <div className={'GoogleMapsLoading'} />,
        containerElement: <div className={'GoogleMapsContainer'} />,
        mapElement: <div className={'GoogleMapsElement'} />
    }),
    withGoogleMap
)(TestMap);

export default Map;
