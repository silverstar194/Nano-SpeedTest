import React, {Component} from 'react';
import '../styles/HomePage.css';
import Ad from './Ad';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import donate from 'img/donate.png'

class MoreInfoPage extends Component {
    render() {
        return (
            <div className='MoreInfoPage'>
             <Helmet>
                <title>NanoSpeed.live - Learn more about Nano currency.</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="Find out all the details about Nano. Buying Nano. Spending Nano. More about our site."
                 />
            </Helmet>
                <Ad/>
                <br/>
                <div className='container'>
                    <h1>
                        What’s Nano?
                    </h1>
                    <i> Official Nano site&nbsp;</i>
                        <a
                            href='https://nano.org'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <i>https://nano.org</i>
                        </a>
                    <div>
                       Nano is built for efficiency. The network utilizes minimal resources, resulting in lightning fast transactions while not sacrificing security. Nodes around the world communicate to confirm transactions without mining, making Nano environmentally friendly and perfect for everyday transactions -- no matter how large or small.
                      <br/>
                      <br/>
                      <h5>Why Nano?</h5>
                      <ul>
                        <li><b>No Fees. Ever.</b></li>
                        Send $.01 or $1,000,000 worldwide without paying a cent in transaction fees. Keep every cent you earn.
                        <li><b>It's fast.</b></li>
                        Payments are finalized in seconds with no rollbacks, giving you financial confidence.
                        <li><b>It'll grow.</b></li>
                        The protocol is incredibly lightweight and will scale to thousands of transactions per second.
                        <li><b>It's way greener.</b></li>
                        There is no 'mining'. One transaction takes only 0.001kWh. That's the equivalent of 1/13,000 the energy it takes to toast a slice of bread.
                        <br/>
                        Other currencies consume thousands of times more energy.
                       </ul>
                        <Link className='btn btn-success' to='/'>Send a transaction and try it yourself</Link>
                    </div>
                    <br/>

                    <h2>How to start using Nano</h2>
                     <h5>Buy some Nano</h5>
                     You can find a list of exchanges on <a
                        href='https://coinmarketcap.com/currencies/nano/'
                        target='_blank'
                        rel='noopener noreferrer'>CoinMarketCap</a>.
                     <br/>
                     <br/>
                     <h5>Places That Accept Nano</h5>
                    Each day, merchants around the world are beginning to accept Nano.
                    For a full list of businesses who currently accept Nano, visit  <a
                        href='https://usenano.org/'
                        target='_blank'
                        rel='noopener noreferrer'>https://usenano.org/</a>.
                    <br/>
                    <br/>
                    <h5>Accept Nano as a merchant</h5>
                    You can setup online Nano payments with <a
                            href='https://brainblocks.io/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            BrainBlocks
                        </a>.
                    <div>
                    <br/>
                    <h5>Additional</h5>
                    For information about Nano projects worldwide visit
                        <a
                            href='https://nanolinks.info/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            : https://nanolinks.info/
                        </a>
                    </div>
                    <br/>

                    <h2>Let’s get social</h2>
                    <div>
                        Nano has one of the largest and most active communities of any cryptocurrency. If you’d like to get involved with Nano or simply learn more, please join us on any of our multiple platforms.
                    </div>
                    <ul>
                        <li><a
                            href='https://www.reddit.com/r/nanocurrency/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            Reddit
                        </a> </li>
                        <li><a
                            href='https://chat.nano.org'
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
                            <i ></i>
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
                    <h2>FAQ</h2>
                    <h5>What is this site doing?</h5>
                    We are timing the speed of a Nano transaction as it happens.
                    Everytime you click the big green 'GO' button we send a small amount of money in the form of Nano between two locations worldwide and time how long it takes.
                    <br/>
                    <br/>
                    <h5>Isn't the network decentralized? Technically, what do you record as the time?</h5>
                    Yes, the Nano network is decentralized so not all parts see transactions at the same time. We record four times:
                    <ol>
                        <li>Time we broadcast send block at location #1</li>
                        <li>Time we see send block at location #2</li>
                        <li>Time we broadcast receive block at location #2</li>
                        <li>Time we see the receive block back at location #1</li>
                    </ol>
                    The time you see is the difference between steps 1 and 2. This represents the time is takes to send Nano.
                    Transactions are final and confirmed after step 2. Steps 3 and 4 are pocketing steps for the receiving wallet.
                    <br/>
                    The times vary due to many reasons including our server load and our Nano node load, often the network will be even faster than displayed.
                    <br/>
                    <a
                        href='https://nano.org/en/whitepaper'
                        target='_blank'
                        rel='noopener noreferrer'>Learn more about Nano in this whitepaper.</a>
                   <br/>
                   <br/>
                   <h5>How much Nano are you sending?</h5>
                   We are sending increments of nano, lower case, this is equal to less then $.01 USD. (lower nano and upper case NANO are different)
                   <br/>
                   1 nano = 0.000001 NANO. NANO is the unit used on exchanges.
                   <br/>
                   <br/>
                   <h5>What's a Nano node?</h5>
                        Nano nodes broadcast transactions to the Nano network and keep the network secure by voting on transactions. They store and validate your transactions. Our nodes are physically located in data centers around the world.
                        <br/>
                        <b>Our Nodes</b>
                        <br/>
                        <a
                        href='https://frankfurt.nanospeed.live/'
                        target='_blank'
                        rel='noopener noreferrer'>https://frankfurt.nanospeed.live/</a>
                        <br/>
                        <a
                        href='https://singapore.nanospeed.live/'
                        target='_blank'
                        rel='noopener noreferrer'>https://singapore.nanospeed.live/</a>
                        <br/>
                        <a
                        href='https://bangalore.nanospeed.live/'
                        target='_blank'
                        rel='noopener noreferrer'>https://bangalore.nanospeed.live/</a>
                        <br/>
                        <a
                        href='https://newyork.nanospeed.live/'
                        target='_blank'
                        rel='noopener noreferrer'>https://newyork.nanospeed.live/</a>
                        <br/>
                        <br/>
                        <a
                            href='https://github.com/clemahieu/raiblocks'
                            target='_blank'
                            rel='noopener noreferrer'>You can also run a node yourself.</a>
                        <br/>
                        <br/>


                  <h5>Found a bug?</h5>
                        Excellent. Thanks for the bug. <a href="mailto:sean@NanoSpeed.live?Subject=Bug Report: NanoSpeed" target="_top">Send us a report.</a> We'll fix it ASAP.
                   <br/>
                   <br/>

                   <i>Help keep the servers and nodes up.
                    <br/>
                   xrb_1ft5e6xtnxwotrszg44tx99wcqyckgsf5xeijqpitinqgyxu8fgxzhwas9eo</i>
                   <br/>
                   <img src={donate} alt="Donate"></img>
                   <br/>
                   <a href="http://api.nanospeed.live/transactions/download">Download all Transactions for Analysis</a>
                   <br/>
                   Please do not use bots to access site. Excessive testing or spam will result in a swift 24 hour ban.
              </div>
            </div>
        );
    }
}

export default MoreInfoPage;