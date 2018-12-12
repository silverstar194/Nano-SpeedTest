import React from 'react';
import renderer from 'react-test-renderer';
import Ad from '../Ad';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    ads: {
        currentAd: {
            title: 'Title',
            message: 'message',
            url: 'www.test.com'
        }
    }
});

it('shallow renders without crashing', () => {
    shallow(<Ad store={store}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <Ad />
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});