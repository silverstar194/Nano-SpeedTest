import React from 'react';
import renderer from 'react-test-renderer';
import TableRow from '../TableRow';
import { shallow } from 'enzyme';

const props = {
    index: 0,
    id: 123,
    origin: {},
    destination: {}
};

it('shallow renders without crashing', () => {
    shallow(<TableRow  {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <TableRow {...props}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
