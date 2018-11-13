import React from 'react';
import renderer from 'react-test-renderer';
import HeaderItem from '../HeaderItem';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter} from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
});

const homeProps = {
    activeTab: '',
	onSwitchTab: () => undefined,
	tabName: '',
	to: '',
	text: 'Speed Test'
};

it('shallow renders without crashing', () => {
    shallow(<HeaderItem {...homeProps}/>);
});

it('renders homepage correctly', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <HeaderItem {...homeProps}  />
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

const statsProps = {
    activeTab: '',
	onSwitchTab: () => undefined,
    to:'Stats',
    text:'Statistics',
    tabName:'Stats'
};

it('renders stats page correctly even if not active tab', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter >
                <HeaderItem {...statsProps}  />
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });