import React from 'react';
import renderer from 'react-test-renderer';
import NotFoundPage from '../NotFoundPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    navigation: {
        activeTab: ''
    }
});

const props = {
	history: {}
};

it('shallow renders without crashing', () => {
    shallow(<NotFoundPage store={store} {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <NotFoundPage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
