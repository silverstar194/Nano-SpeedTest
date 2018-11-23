import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import ScatterView from '../PastResultsTable';

const props = {
    tableData: [],
    plotData: [
        {
            x: 1542417112098,
            y: 1542417112000,
        }
    ]
};

it('shallow renders without crashing', () => {
    shallow(<ScatterView {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <ScatterView {...props}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
