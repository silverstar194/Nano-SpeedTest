import React, { Component } from 'react';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import 'styles/Cards.css';
import Ad from 'components/Ad';
import icon from 'img/icon.jpg'
import { Helmet } from "react-helmet";

class Partners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleGold: [],
            textGold: [],
            linkGold: [],
            imgGold: []
        };
    }
    componentDidMount() {
        fetchWrapper('partners/info')
        .then((response) => {
            this.setState({
                titleGold: response.data.gold.title,
                textGold: response.data.gold.text,
                linkGold:  response.data.gold.link,
                imgGold:  response.data.gold.img,
            });
        }).catch((err) => {
            makeToast({
                text: `Can't receive Partners`,
                status: 'danger'
            });
        });
    }

    dismiss = () => {
        var x = document.getElementById("collapse-info");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    render() {

        let goldCards = this.state.titleGold.map((title, index) =>
        <div className="flip-card col-xs-12 col-ms-3 col-lg-3">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <img src={this.state.imgGold[index]}  className="custom-icon" alt="Avatar"></img>
                    <div className="custom-lower-banner">{title}</div>
                </div>

            <a href={this.state.linkGold[index]} rel="noopener noreferrer">
                <div className="flip-card-back custom-back-card">
                    <h5>{title}</h5>
                    <p>{this.state.textGold[index]}</p>
                </div>
                 <div className="custom-lower-banner custom-lower-banner-back">Tap to Visit</div>
            </a>

        </div>
      </div>
        )

       return (
         <div className='Partners'>
             <Helmet>
                <title>NanoSpeed.live - Our Nano Partner</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="View our partners. Get started using Nano today by visiting our Partners below."
                 />
            </Helmet>
            <Ad/>
            <div className="container">
             <h1>Use Nano</h1>

            <p>Interested in taking the next step with Nano? Visit any of our partner sites and try Nano out in the real world: buy goods, start accounts, discover Nano projects, and other ideas.
                <br/></p>
                <a href="/PartnerInfo">More information about the Partner Program</a>
                <br/>
                <br/>
                <i>Tap any panel to view more information.</i>
                <div className="row">
                    <div className="flip-card partner-card-outer col-xs-12 col-ms-3 col-lg-3">
                        <div className="flip-card-inner">
                        <div className="flip-card-front custom-card-background">
                            <img src={icon}  className="custom-icon" alt="Avatar"></img>
                            <div className="custom-lower-banner">Become a Site Partner</div>
                        </div>

                    <a href="/PartnerInfo">
                    <div className="flip-card-back custom-back-card">
                        <p>Allow users to speed test Nano when first getting introduced.</p>
                          <b>Embeddable Buttons</b>

                          <div className="custom-button-card">
                            <a href="http://nanospeed.live" className="btn-lg btn-success custom-button-card">
                                Speed Test Nano <span role="img" aria-label="Timer">&#9200;</span>
                            </a>
                          </div>

                          <div className="custom-button-card">
                            <a  href="http://nanospeed.live" className="btn btn-success custom-button-card">
                                Try Nano Now <span role="img" aria-label="Money Bag">💰</span>
                            </a>
                          </div>
                    <a/>

                   </div>
                   <div className="custom-lower-banner custom-lower-banner-back">Tap to Join</div>
                   </a>
                </div>
              </div>
                    {goldCards}
              </div>
             </div>
          </div>
        );
    }
}

export default Partners;