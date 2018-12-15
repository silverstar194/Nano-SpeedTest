import React from 'react';
import renderer from 'react-test-renderer';
import HistoricaDataView from '../HistoricalDataView';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

const mockStore = configureStore();
let store = mockStore({
    ads: {
        currentAd: {
            title: 'Title',
            message: 'Message',
            url: 'url'
        }
    },
    table: {
        0: {
            id: 440,
            transactionHashSending: "A20FE63E0C55592C5EEF4089B1D66EF8B0A76DECC8F852B6BE7F112A13943AA2",
            transactionHashReceiving: "4E3D4B7415F282608CC2EAFF0120AEDBCB50174478744916F4048AECC58F49FB",
            amount: "0.0006",
            origin: {
                id: 4,
                nodeLocation: "New York",
                latitude: "40.804300",
                longitude: "-74.012100",
            },
            destination: {
                id: 3,
                nodeLocation: "Singapore",
                latitude: "1.293100",
                longitude: "103.850100"
            },
            startSendTimestamp: 1542417085995,
            endSendTimestamp: 1542417086000,
            startReceiveTimestamp: 1542417112098,
            endReceiveTimestamp: 1542417112000,
            completed: true
        }
    },
    transactions: {
        isFetchingTransaction: false,
        isFetchingTiming: false
    },
    pastResults: {
        pastTransactions:[]
    },
    nodes: [],
    form: {}
});

const props = {
    pastTransactions: [],
    totalTransactions: 1,
    globalAverage: 1,
    nodeLocations: {}
};

it('shallow renders without crashing', () => {
    shallow(<HistoricaDataView store={store} {...props}/>);
});

it(`renders base snapshot correctly`, () => {
    const tree = renderer.create(
        <Provider store={store}>
            <BrowserRouter>
                <HistoricaDataView {...props}/>
            </BrowserRouter>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
