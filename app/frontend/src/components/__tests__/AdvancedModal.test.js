import React from 'react';
import renderer from 'react-test-renderer';
import AdvancedModal from 'components/AdvancedModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({});
it('shallow renders without crashing', () => {
    shallow(<AdvancedModal store={store}/>);
});

it(`renders base snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider  store={store}>
            <BrowserRouter >
                <AdvancedModal />
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it(`renders two cities snapshot correctly`, () => {
    const state = {
        locationsActive: true,
    };
    const props = {
        settings: {
            advSettings: {
                values: {
                    origin: 'A',
                    destination: 'B'
                }
            }
        },
        nodes: [
            {
                id: 123,
                location: 'A'
            },
            {
                id: 222,
                location: 'B'
            }
        ]
    };
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <AdvancedModal state={state} {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it(`renders multi snapshot correctly`, () => {
    const state = {
        multipleActive: true,
    };
    const props = {
        nodes: [
            {
                id: 123,
                location: 'A'
            },
            {
                id: 222,
                location: 'B'
            }
        ]
    };
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <AdvancedModal state={state} {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});