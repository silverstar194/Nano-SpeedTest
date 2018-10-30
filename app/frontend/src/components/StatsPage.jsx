import React, {Component} from 'react';
import Header from './Header';
import TableRow from './TableRow';
import '../styles/StatsPage.css';
import Map from './Map';

class StatsPage extends Component {
    state = {
        loading: true,
        fakeTableData: [
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
            }
        ],
        cities: [{
            name: 'japan',
            coords: {
                lat: 36.2048,
                lng: 138.2529
            }
        },
        {
            name: 'sf',
            coords: {
                lat: 37.768249,
                lng: -122.445145
            }
        }
    ]
    };

    getData = () => {
        setTimeout(() => {
            this.setState({
                fakeTableData: [...this.state.fakeTableData,
                    {
                        hash: 'ahd-949',
                        origin: 'Madison',
                        destination: 'Austin',
                        time: 4.3,
                        amount: 54321,
                        completed: 'Sept 19, 2018'
                    }],
                loading: false
            });
        }, 4300)
    };

    handleClick = () => {
        this.setState({
            fakeTableData: [...this.state.fakeTableData.slice(0, this.state.fakeTableData.length - 1)],
            loading: true
        });
    };

    render() {
        // call function to "get data" once (set timer and then add value to array) and to simulate a single
        // async request
        if (this.state.loading) {
            this.getData();
        }

        // render the jsx
        return (
            <div className='StatsPage'>
                <Header/>
                <h1 className="page-header text-center">Stats Page</h1>
                <Map cities={this.state.cities}/>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Hash</th>
                        <th scope='col'>Origin</th>
                        <th scope='col'>Destination</th>
                        <th scope='col'>Elapsed Time</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Completed</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.fakeTableData.map((props, index) => {
                            props.index = index + 1;
                            return <TableRow key={props.hash} {...props}/>;
                        })
                    }
                    </tbody>
                </table>

                {/*only show loading if we are waiting for the data.  Else show button to rerun*/}
                {this.state.loading ? (
                    <div className='loading-container'>
                        <div className='loader-container d-flex justify-content-center'>
                            <div className='loader'></div>
                        </div>
                        <div>
                            <p>Your transaction is processing. Please wait.</p>
                        </div>
                    </div> ) : (
                    <div className='loader-container d-flex justify-content-center'>
                        <button className='btn btn-primary' onClick={this.handleClick}>Run Test Again</button>
                    </div>
                )}
            </div>
        );
    }
}

export default StatsPage;