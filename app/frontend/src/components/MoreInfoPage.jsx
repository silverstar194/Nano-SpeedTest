import React, {Component} from 'react';
import Ad from './Ad';
import { Helmet } from "react-helmet";
import NavBar from './NavBar';

class MoreInfoPage extends Component {
    render() {
        return (
            <div className="MoreInfoPage">
             <Helmet>
                <title>NanoSpeed.live - Learn more about Nano currency.</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="Find out all the details about Nano. Buying Nano. Spending Nano. More about our site."
                 />
            </Helmet>
            <main className="faq-main">
            <NavBar />
            <div className="general-main-area-one">
               <div className="general-header-main center-horizontally max-width">
                  Frequently Asked Questions
               </div>
            </div>
            <div class="faq-main-ad">
               <Ad /> 
            </div>
            <div className="faq-main-area-two max-width">
               <div className="faq-header">What is Nano?</div>
               Launched in 2015, Nano (formerly RaiBlocks) describes itself as an open source, sustainable, and secure next-generation digital currency focused on removing perceived inefficiencies present in existing cryptocurrencies. Designed to solve peer to peer transfer of value, Nano aims to revolutionize the world economy through an ultrafast and fee-less network that is open and accessible to everyone. 
               <br></br>
               <br></br>
               Nano is reportedly able to offer fast and feeless transactions due to the Block Lattice - a data structure in which all accounts each have their own blockchain, rather than competing with others on a central chain. Consensus is generated through representative voting, where accounts can freely choose their representative at any time with an update of their account chain, thereby providing more control for users to decide who validates transactions. 
               <br></br>
               <br></br>
               Each component of the protocol was created with the long term goals of decentralization and accessibility in mind. By creating a system where representatives are not paid to operate, the incentive to participate in the network is shifted to indirect, operational cost savings. The team claims that this change in incentive model is more efficient and removes one of the factors driving centralization in other systems because participants are not encouraged to interact beyond their direct needs and supporting the network, and thus economies of scale become less critical.
            </div>
            <div className="faq-main-area-three max-width">
               <div className="faq-header">Why Nano?</div>
               <div className="faq-header-two">No Fees. Ever.</div>
               Send $.01 or $1,000,000 worldwide without paying a cent in transaction fees. Keep every cent you earn.  
               <br></br>
               <br></br>
               <div className="faq-header-two">It's fast.</div>
               Payments are finalized in seconds with no rollbacks, giving you financial confidence. 
               It'll grow. ‍The protocol is incredibly lightweight and will scale to thousands of transactions per second.  ‍
               <br></br>
               <br></br>
               <div className="faq-header-two">It's way greener.</div>
               There is no 'mining'. One transaction takes only 0.001kWh. That's the equivalent of 1/13,000 the energy it takes to toast a slice of bread. Other currencies consume thousands of times more energy.
            </div>
            <div className="faq-main-area-four max-width">
               <div className="faq-header">How to use Nano?</div>
               <div className="faq-header-two">Buy some Nano</div>
               You can find a list of exchanges on CoinMarketCap.
               <br></br>
               <br></br>
               <div className="faq-header-two">Places That Accept Nano</div>
               Each day, merchants around the world are beginning to accept Nano. For a full list of businesses who currently accept Nano, visit usenano.org .
               <br></br>
               <br></br>
               <div className="faq-header-two">Accept Nano as a merchant</div>
               You can setup online Nano payments with BrainBlocks.
               <br></br>
               <br></br>
               <div className="faq-header-two">Additional</div>
               For information about Nano projects worldwide visit nanolinks.info
            </div>
            <div className="faq-main-area-five">
               <div className="social-header center-horizontally max-width">
                  Nano has one of the largest and most active communities of any cryptocurrency. If you’d like to get involved with Nano or simply learn more, please join us on any of our multiple platforms.
               </div>
               <div className="social-icons center-horizontally max-width">
                  <a href="https://reddit.com/r/nanocurrency" target="_BLANK" className="social-icon social-icon-one"> r&#x2F;nanocurrency</a>
                  <a href="https://chat.nano.org/" target="_BLANK" className="social-icon social-icon-two"> chat.nano.org </a>
                  <a href="https://facebook.com/nanofoundation" target="_BLANK" className="social-icon social-icon-three"> /nanofoundation </a>
                  <a href="https://twitter.com/nano" target="_BLANK" className="social-icon social-icon-four"> @nano </a>
               </div>
            </div>
            <div className="faq-main-area-six max-width">
               <div className="faq-header">About Nanospeed</div>
               <div className="faq-header-two">What is this site doing?</div>
               We are timing the speed of a Nano transaction as it happens. Everytime you click the big green 'GO' button we send a small amount of money in the form of Nano between two locations worldwide and time how long it takes.
               <br></br>
               <br></br>
               <div className="faq-header-two">Isn't the network decentralized? Technically, what do you record as the time?</div>
               Yes, the Nano network is decentralized so not all parts see transactions at the same time. We record four times:
               <br></br>
               <br></br>
               Time we broadcast send block at location #1
               Time we see send block at location #2
               Time we broadcast receive block at location #2
               Time we see the receive block back at location #1
               <br></br>
               <br></br>
               The time you see is the difference between steps 1 and 2. This represents the time is takes to send Nano. Transactions are final and confirmed after step 2. Steps 3 and 4 are pocketing steps for the receiving wallet.
               <br></br>
               <br></br>
               The times vary due to many reasons including our server load and our Nano node load, often the network will be even faster than displayed.
               <br></br>
               <br></br>
               <div className="faq-header-two">How much Nano are you sending?</div>
               We are sending increments of nano, lower case, this is equal to less then $.01 USD. (lower nano and upper case NANO are different)1 nano = 0.000001 NANO. NANO is the unit used on exchanges.
               <br></br>
               <br></br>
               <div className="faq-header-two">What are your Nano nodes?</div>
               We have 3 nodes at the moment :
               <br></br>
               Frankfurt (https://frankfurt.nanospeed.live/)
               <br></br>
               Bangalore (https://bangalore.nanospeed.live/)
               <br></br>
               New York (https://newyork.nanospeed.live/)
            </div>
         </main>
        </div>
        );
    }
}

export default MoreInfoPage;