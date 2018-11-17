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
                    <h2 className='page-header text-center'>
                        {`What’s `}
                        <a
                            href='https://nano.org'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Nano
                        </a>
                        ?
                    </h2>
                    <div>
                        Created in 2015, Nano is a digital currency focuses on fast transaction speeds, no fees and high throughput. Unlike traditional cryptocurrencies which use a single network-wide blockchain, Nano utilizes a unique block-lattice design, in which each account has its own blockchain. 
                        <p/>
                        Nano is built for efficiency. The network utilizes minimal resources, resulting in the fastest transactions of any currency, while not sacrificing security. Lightweight, optimized nodes are run throughout the world to confirm transactions and require no mining, making Nano perfect for everyday transactions, no matter how large or small.
                    </div>

                    <h3 className='page-header text-center'>How To Get Started</h3>
                    <div>
                        <a
                            href='https://nanolinks.info/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            {`https://nanolinks.info/ `}
                        </a> 
                        has information about the project.
                    </div>

                    <h3 className='page-header text-center'>Let’s Get Social</h3>
                    <div>
                        Nano has one of the largest and most active communities of any cryptocurrency. If you’d like to get involved with the project or simply learn more, please join us on any of our multiple platforms.
                    </div>
                    <ul>
                        <li><a
                            href='https://www.reddit.com/r/nanocurrency/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Reddit
                        </a> </li>
                        <li><a
                            href='https://discordapp.com/invite/JphbBas'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Discord Main
                        </a> </li>
                        <li><a
                            href='https://discordapp.com/invite/RT4wzGV'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Discord Trade
                        </a> </li>
                        <li><a
                            href='https://twitter.com/nano'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Twitter
                        </a> </li>
                        <li><a
                            href='https://www.facebook.com/nanofoundation/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Facebook
                        </a> </li>
                        <li><a
                            href='https://www.linkedin.com/company/nano-foundation/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            LinkedIn
                        </a> </li>
                    </ul>


                </div>
            </div>
        );
    }
}

export default MoreInfoPage;