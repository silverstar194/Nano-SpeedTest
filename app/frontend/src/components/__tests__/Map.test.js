import React from 'react';
import renderer from 'react-test-renderer';
import Map from '../CurrentTransactions/Map';
import { shallow } from 'enzyme';

it('shallow renders without crashing', () => {
    const testMapData = [{
        origin: {
            latitude: "1.293100",
            longitude: "103.850100"
        },
        destination: {
            latitude: "40.804300",
            longitude: "-74.012100"
        }
    }];
    shallow(<Map transactions={testMapData}/>);
});

it(`renders snapshot correctly`, () => {
    const testMapData = [{
        origin: {
            latitude: "1.293100",
            longitude: "103.850100"
        },
        destination: {
            latitude: "40.804300",
            longitude: "-74.012100"
        }
    }];
    const tree = renderer.create(
        <Map transactions={testMapData}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
