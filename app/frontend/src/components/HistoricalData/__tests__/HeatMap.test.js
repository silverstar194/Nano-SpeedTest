import React from 'react';
import renderer from 'react-test-renderer';
import HeatMap from '../HeatMap';
import { shallow } from 'enzyme';

const base = 'https://maps.googleapis.com/maps/api/staticmap';
const scale = '2';
const size = `1200x600`;
const googleKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
let points;
let markers;

it('shallow renders without crashing', () => {
    const nodeLocations = {
        444: {
            latitude: 123,
            longitude: 456,
            coords: '123,456'
        }
    };
    shallow(<HeatMap nodeLocations={nodeLocations}/>);
    points = Object.keys(nodeLocations).map((id) => nodeLocations[id].coords);
    markers = `size:small|${points.join('|')}`;
});

it(`renders snapshot correctly`, () => {

    const tree = renderer.create(
        <img className='GoogleHeatMap'
             src={`${base}?size=${size}&scale=${scale}&markers=${markers}&key=${googleKey}`}
             alt={'Google Map Showing Locations of Nodes'} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});