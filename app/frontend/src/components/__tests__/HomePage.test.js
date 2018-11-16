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
    nodes: {}
};

it('shallow renders without crashing', () => {
    shallow(<HomePage store={store} {...props}/>);
});
//
// it(`renders snapshot correctly`, () => {
//     const tree = renderer.create(
//         <Provider store={store}>
//             <BrowserRouter>
//                 <HomePage {...props}/>
//             </BrowserRouter>
//         </Provider>
//     ).toJSON();
//     expect(tree).toMatchSnapshot();
// });
