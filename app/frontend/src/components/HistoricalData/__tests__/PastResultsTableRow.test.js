import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import PastResultsTable from '../PastResultsTable';

const props = {
    index: 0,
    id: 123,
    origin: {},
    destination: {},
    tableData: []
};

it('shallow renders without crashing', () => {
    shallow(<PastResultsTable key={123} {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <PastResultsTable key={123} {...props}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
