import React from 'react';
import renderer from 'react-test-renderer';
import MoreInfoPage from '../MoreInfoPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    ads: {
        currentAd: {
            title: 'Title',
            message: 'Message',
            url: 'url'
        }
    }
});

const props = {
	history: {}
};

it('shallow renders without crashing', () => {
    shallow(<MoreInfoPage store={store} {...props}/>);
});

it(`renders snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <MoreInfoPage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
