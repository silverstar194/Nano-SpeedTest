import React from 'react';
import renderer from 'react-test-renderer';
import StatsPage from '../StatsPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    navigation: {
        activeTab: ''
    },
    table: [
        {
            id: 148,
            origin: {
              id: 2,
              nodeLocation: 'Mumbai',
              latitude: '19.014400',
              longitude: '72.847900',
              coords: {
                lat: 19.0144,
                lng: 72.8479
              }
            },
            destination: {
              id: 1,
              nodeLocation: 'N. Virginia',
              latitude: '39.043700',
              longitude: '-77.487500',
              coords: {
                lat: 39.0437,
                lng: -77.4875
              }
            },
            amount: 0.0009,
            ip: '127.0.0.1',
            completed: false,
            index: 1
          }
    ],
    transactions: {

    }
});

const props = {
	history: {}
};

it('shallow renders without crashing', () => {
    shallow(<StatsPage store={store} {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <StatsPage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
