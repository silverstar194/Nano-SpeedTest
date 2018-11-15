import React, {Component} from 'react';
import Header from './Header';
import '../styles/HomePage.css';
import Ad from './Ad';

class MoreInfoPage extends Component {
    render() {
        return (
            <div className='MoreInfoPage'>
                <Header/>
                <Ad/>
                <div className='container'>
                    <h1 className='page-header text-center'>More Info Page</h1>
                    <h2>
                        We are talking with the Nano Team about what information
                        they would like us to display here. Most likely this will
                        be a number of links to their site or additional information
                        about how to get involved in the Nano community.
                    </h2>
                </div>
            </div>
        );
    }
}

export default MoreInfoPage;