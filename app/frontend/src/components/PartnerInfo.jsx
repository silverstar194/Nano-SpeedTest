import React, { Component } from 'react';
import 'styles/PartnerInfo.css';
import Gist from 'react-gist'

class PartnerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
       return (
         <div className='PartnerInfo'>
            <div className="container">
                <h4>Become a Partner</h4>
                Integrate NanoSpeed.live buttons for users to test and try Nano transactions. Email us at sean@NanoSpeed.live to be added to the Partner Cards.
                <br/>
                <br/>
                <h5>Overview of the Program</h5>

                <a href="/">Read more on Medium</a>

                <h5>Developer information</h5>
                Integrating a NanoSpeed.live button only takes 2 lines of code.
                <br/>
                <br/>
                <b>Step 1.</b>
                 <br/>
                Add the needed stylesheet
                 <br/>
                <Gist id='2e6737bf7f752371d1a6ea70b0b484b4' />

                <b>Step 2.</b>
                <br/>
                Add the button style that works best for your site.
                <br/>



                    <div className="row">
                        <div className="col-lg-6">

                            <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg">
                                        Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span>
                            </a>
                             <Gist id='df13667913a9910a6c6ee752af29a1b3' />
                        </div>

                        <div className="col-lg-6 custom-margin-buttom-sm">

                              <a href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm">
                                    Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span>
                             </a>
                             <Gist id='5df4a77ca09b94794c8f519874b3a15e' />
                        </div>
                    </div>

                    <br/>
                    <br/>
                   <div className="row">
                       <div className="col-lg-6">
                           <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-lg">
                                Try Nano Now <span role="img" aria-label="Money Bag">💰</span>
                           </a>
                            <Gist id='1b0899856bfa6b32dcdf7bd43ba25810' />
                       </div>

                       <div className="col-lg-6 custom-margin-buttom-sm">
                           <a  href="http://nanospeed.live" className="btn-nanospeed-live btn-nanospeed-live-sm">
                                Try Nano Now <span role="img" aria-label="Money Bag">💰</span>
                           </a>
                            <Gist id='2a46912193934e0cba3e76794859f943' />
                       </div>
                   </div>
                   <div className="custom-bottom-partnerinfo">
                        <i>These buttons don't fit the current style of your site? That's fine! You're still welcome to join the Partner Program. Feel free to design your own button. Your button should direct users to http://nanospeed.live/</i>
                   </div>
             </div>
          </div>
        );
    }
}

export default PartnerInfo;