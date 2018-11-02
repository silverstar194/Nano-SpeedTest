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
            index: 0,
            hash: 'abc123',
            origin: 'SF',
            destination: 'LA',
        }
    ]
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
