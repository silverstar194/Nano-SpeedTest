import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';
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

it('shallow renders without crashing', () => {
    shallow(<Header store={store}/>);
});

it(`renders snapshot correctly when activeTab is ''`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <Header />
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});