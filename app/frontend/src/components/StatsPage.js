import React, {Component} from 'react';
import Header from './Header'
import '../styles/HomePage.css';

class StatsPage extends Component {
    render() {
        return (
            <div className="StatsPage">
                <Header/>
                <h1 className="page-header text-center">Stats Page</h1>
            </div>
        );
    }
}

export default StatsPage;