import React from 'react';
import renderer from 'react-test-renderer';
import PastResultsTable from '../PastResultsTable';
import { shallow } from 'enzyme';

const props = {
    tableData: []
};

it('shallow renders without crashing', () => {
    shallow(<PastResultsTable  {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <PastResultsTable {...props}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
