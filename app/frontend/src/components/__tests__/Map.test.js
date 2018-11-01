import React from 'react';
import renderer from 'react-test-renderer';
import Map from '../Map';
import { shallow } from 'enzyme';

it('shallow renders without crashing', () => {
    shallow(<Map />);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <Map />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
