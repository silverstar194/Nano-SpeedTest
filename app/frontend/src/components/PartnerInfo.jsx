import React, { Component } from 'react';
import 'styles/PartnerInfo.css';
import ReactEmbedGist from 'react-embed-gist';
import { Helmet } from "react-helmet";
import Ad from 'components/Ad';

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
            <Ad/>
            <div className="container">
                <h1>Become a Partner</h1>
                <h5>Overview of the Program</h5>
                <p>
                <i>All too often people visit crypto related sites, browse, and leave; failing to see the vast utility.
                Our vision is to change this radically.</i>
                <br/>
                 <br/>
                Integrating NanoSpeed.live buttons into your service or site allows interested users to test and try out Nano transactions instantly, before any download or signup. Our buttons are drop-dead easy and take only two lines of code.
                <br/>
                <br/>
                <a href="https://medium.com/@seanmaloney_13696/nanospeed-live-partner-program-2cf812180af4">Read more about the Partner Program on Medium</a></p>

                <h2>Developer Information</h2>
                <b>Step 1.</b>
                 <br/>
                Add the needed stylesheet
                 <br/>

                 <ReactEmbedGist gist="silverstar194/2e6737bf7f752371d1a6ea70b0b484b4"/>

                <b>Step 2.</b>
                <br/>
                Add the button style that works best for your site. Lastly, email us at  <a href="mailto:sean@NanoSpeed.live?Subject=Adding Nano SpeedTest.live Partner" target="_top">sean@NanoSpeed.live</a> to be added to the  <a href="/Discover">Partner Cards</a>.
                <br/>

                    <div className="row">
                        <div className="col-lg-6">

                            <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg">
                                        Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span>
                            </a>
                            <ReactEmbedGist gist="silverstar194/df13667913a9910a6c6ee752af29a1b3"/>
                        </div>

                        <div className="col-lg-6 custom-margin-buttom-sm">

                              <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm">
                                    Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span>
                             </a>
                             <ReactEmbedGist gist="silverstar194/5df4a77ca09b94794c8f519874b3a15e"/>
                        </div>
                    </div>

                    <br/>
                   <div className="row">
                       <div className="col-lg-6">
                           <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg">
                                Try Nano Now <span role="img" aria-label="Money Bag">💰</span>
                           </a>
                           <ReactEmbedGist gist="silverstar194/1b0899856bfa6b32dcdf7bd43ba25810"/>
                       </div>

                       <div className="col-lg-6 custom-margin-buttom-sm">
                           <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm">
                                Try Nano Now <span role="img" aria-label="Money Bag">💰</span>
                           </a>
                            <ReactEmbedGist gist="silverstar194/2a46912193934e0cba3e76794859f943"/>

                       </div>
                   </div>
                   <div className="custom-bottom-partnerinfo">
                        <i>These buttons don't fit the current style of your site? That's fine! You're still welcome to join the Partner Program. Feel free to design your own button. Your button should direct users to https://NanoSpeed.live/</i>
                   </div>
             </div>
          </div>
        );
    }
}

export default PartnerInfo;