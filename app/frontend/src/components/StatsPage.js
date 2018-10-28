import React, {Component} from 'react';
import Header from './Header';
import TableRow from './TableRow';
import '../styles/StatsPage.css';
import Map from './Map';

class StatsPage extends Component {
    render() {
        const fakeTableData = [
            {
                hash: 'abc-123',
                origin: 'SF',
                destination: 'LA',
                time: 9.3,
                amount: 12345,
                completed: 'Jan 1, 2018'
            }, {
                hash: 'zyx-321',
                origin: 'NY',
                destination: 'WI',
                time: 9.7,
                amount: 55555,
                completed: 'March 15, 2015'
            },
        ];
        return (
            <div className="StatsPage">
                <Header/>
                <h1 className="page-header text-center">Stats Page</h1>
                <Map/>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hash</th>
                        <th scope="col">Origin</th>
                        <th scope="col">Destination</th>
                        <th scope="col">Elapsed Time</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        fakeTableData.map((props, index) => {
                            props.index = index + 1;
                            return <TableRow key={props.hash} {...props}/>;
                        })
                    }
                    </tbody>
                    </table>
                <div className="d-flex justify-content-center">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }
}

export default StatsPage;