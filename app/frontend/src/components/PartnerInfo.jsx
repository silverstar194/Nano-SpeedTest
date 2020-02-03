import React, { Component } from 'react';
import ReactEmbedGist from 'react-embed-gist';
import { Helmet } from "react-helmet";
import NavBar from './NavBar';

class PartnerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
       return (
         <div className='PartnerInfo'>
            <Helmet>
                <title>NanoSpeed.live - Partner Program Information</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="Learn more about out partner program and how to join today. Easily embeddable buttons available."
                 />
            </Helmet>
            <main className="partner-main">
            <NavBar />
            <div className="general-main-area-one">
               <div className="general-header-main center-horizontally max-width">
                  Become a partner
               </div>
            </div>
            <div className="partner-main-area-two center-horizontally max-width">
               <div className="partner-header">Why should you become a partner?</div>
               <div className="partner-header-text">All too often people visit crypto related sites, browse, and leave; failing to see the vast utility. Our vision is to change this radically. 
                  <br></br>
                   <br></br>
                  Integrating NanoSpeed.live buttons into your service or site allows interested users to test and try out Nano transactions instantly, before any download or signup. Our buttons are drop-dead easy and take only two lines of code
               </div>
               <br></br>
               <br></br>
               <div className="partner-header-small">First and Only Step</div>
               <div className="partner-header-text">Add the button style that works best for your site. Lastly, email us at sean@NanoSpeed.live to be added to the Partner Cards.</div>
               <br></br>
               <div className="partner-header-text">These buttons don't fit the current style of your site? That's fine! You're still welcome to join the Partner Program. Feel free to design your own button. Your button should direct users to <a href="https://NanoSpeed.live">NanoSpeed.live</a></div>
               <div className="partner-item">
                  <div className="partner-items">
                     <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg partner-button-lg">Speed Test Nano 
                        <span role="img" aria-label="Timer">&#9200;</span>
                     </a>
                     <ReactEmbedGist gist="silverstar194/df13667913a9910a6c6ee752af29a1b3"/>
                  </div>
                  <div className="partner-items">
                     <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm partner-button-sm">Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span></a>
                     <ReactEmbedGist gist="silverstar194/5df4a77ca09b94794c8f519874b3a15e"/>
                  </div>
                  <div className="partner-items">
                     <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg partner-button-lg">Try Nano Now <span role="img" aria-label="Money Bag">💰</span></a>
                     <ReactEmbedGist gist="silverstar194/1b0899856bfa6b32dcdf7bd43ba25810"/>
                  </div>
                  <div className="partner-items">
                     <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm partner-button-sm"> Try Nano Now <span role="img" aria-label="Money Bag">💰</span></a>
                     <ReactEmbedGist gist="silverstar194/2a46912193934e0cba3e76794859f943"/>                  </div>
               </div>
            </div>
         </main>
         </div>
        );
    }
}

export default PartnerInfo;