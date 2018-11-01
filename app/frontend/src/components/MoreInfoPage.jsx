import React, {Component} from 'react';
import Header from './Header'
import '../styles/HomePage.css';

class MoreInfoPage extends Component {
    render() {
        return (
            <div className='MoreInfoPage'>
                <Header/>
                <h1 className='page-header text-center'>More Info Page</h1>
                <h2>We are talking with the Nano Team about what information they would like us to display here</h2>
            </div>
        );
    }
}

export default MoreInfoPage;