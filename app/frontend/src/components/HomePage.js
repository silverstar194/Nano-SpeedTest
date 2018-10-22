import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div className="HomePage">
                <div className="nav nav-tabs">
                    <li className="nav-item">
                            <Link className="nav-link active" to='SpeedTest'>Speed Test</Link>
                    </li>
                    <li className="nav-item">
                            <Link className="nav-link" to='Stats'>Statistics</Link>
                    </li>
                    <li className="nav-item">
                            <Link className='nav-link' to='Info'>More Info</Link>
                    </li>
                </div>
                <h1 className="page-header text-center">
                    Welcome to NanoSpeed.live</h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="button" className="btn btn-success btn-circle btn-xl">Go</button>
                            <br/>
                            <button type="button" className="btn btn-outline-primary">Advanced</button>
                            <br/>
                            Run your live test now.
                        </div>
                    </div>
                    <div/>
                </div>
            </div>
        );
    }
}

export default HomePage;