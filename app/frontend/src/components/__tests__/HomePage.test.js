import React from 'react';
import renderer from 'react-test-renderer';
import HomePage from '../HomePage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    navigation: {
        activeTab: ''
    }
});

const props = {
    history: {},
    onGoPressed: () => {},
    advSettingsForm: {},
    nodes: {
        1: {
            location: 'A'
        },
        2: {
            location: 'B'
        }
    }
};

it('shallow renders without crashing', () => {
    shallow(<HomePage store={store} {...props}/>);
});

it(`renders base snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter>
                <HomePage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it(`renders multi city snapshot correctly`, () => {
    props.advSettings = {
        values: {
            numTransactions: 3
        }
    };

    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter>
                <HomePage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it(`renders two city snapshot correctly`, () => {
    props.advSettings = {
        values: {
            origin: 1,
            destination: 2
        }
    };

    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter>
                <HomePage {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
