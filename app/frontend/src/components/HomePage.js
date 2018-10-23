import React, {Component} from 'react';
import Header from './Header';
import '../styles/HomePage.css';

class HomePage extends Component {
    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Stats');
    };
    render() {
        return (
            <div className="HomePage">
                <Header/>
                <h1 className="page-header text-center">Welcome to NanoSpeed.live</h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="button" className="btn btn-success btn-circle btn-xl" onClick={this.onClick}>Go</button>
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