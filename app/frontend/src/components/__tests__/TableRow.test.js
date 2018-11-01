import React from 'react';
import renderer from 'react-test-renderer';
import TableRow from '../TableRow';
import { shallow } from 'enzyme';

const props = {
    index: 0,
    hash: 'abc123',
    origin: 'SF',
    destination: 'LA',
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
