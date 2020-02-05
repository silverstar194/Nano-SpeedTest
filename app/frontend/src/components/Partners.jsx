import React, { Component } from 'react';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import { Helmet } from "react-helmet";
import NavBar from './NavBar';
import card_nano_center from '../img/card_nano_center.png'
import card_nano_crawler from '../img/card_nano_crawler.png'
import card_nano_usenano from '../img/card_nano_usenano.png'
import card_nano_nanolinks from '../img/card_nano_nanolinks.png'
import card_nano_alilnano from '../img/card_nano_alilnano.png'
import { Link } from 'react-router-dom';

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
        <div className="usenano-card">
         <div className="usernano-card-top usernano-card-top-dark">
            <img className="card-img-header" src={this.state.imgGold[index]} alt="Partner {title}" />
         </div>
         <div className="usernano-card-bottom">
               <div className="usernano-card-title">
                  {title}
               </div>
               <div className="usernano-card-text">
                {this.state.textGold[index]}               
               </div>
            <a href={this.state.linkGold[index]} className="usernano-card-link arrow-link">Visit  {title}</a>
         </div>
      </div>
      )
       return (
        <main className="usenano-main">
            <Helmet>
                <title>NanoSpeed.live - Nano Partnerss</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="View NanoSpeed's partners."
                 />
            </Helmet>
        <NavBar />
         <div className="general-main-area-one">
            <div className="general-header-main center-horizontally max-width">
               Use Nano
            </div>
         </div>
         <div className="usenano-main-area-two">
            <div className="usenano-partner-info-wrapper center-horizontally max-width">
               <div className="usenano__text">
                  Interested in taking the next step with Nano? Visit any of our partner sites and try Nano out in the real world: buy goods, start accounts, discover Nano projects, and other ideas.
               </div>
                <Link className="usenano__button" to='PartnerInfo'>Become a Partner</Link>
            </div>
         </div>
         <div class="usenano-main-area-three">
            <div class="usenano-main-three-wrapper-outer center-horizontally max-width">
               <div class="usenano-main-area-three-wrapper">
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-dark">
                        <img class="card-img-header" src={card_nano_crawler} />
                     </div>
                     <div class="usernano-card-bottom">
                           <div class="usernano-card-title">
                              Nano Crawler
                           </div>
                           <div class="usernano-card-text">
                              The most advanced network explorer and node monitor for Nano.
                           </div>
                        <a href="https://nanocrawler.cc/" target="_BLANK" class="usernano-card-link arrow-link">Visit nanocrawler.cc </a>
                     </div>
                  </div>
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-light">
                        <img class="card-img-header" src={card_nano_center} />
                     </div>
                     <div class="usernano-card-bottom">
                        <div class="usernano-card-title">
                           The Nano Center
                        </div>
                        <div class="usernano-card-text">
                           The Nano Center assists in the funding and ongoing support of Nano-related projects.
                        </div>
                        <a href="https://nanocenter.org/" target="_BLANK" class="usernano-card-link arrow-link">Visit nanocenter.org</a>
                     </div>
                  </div>
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-white">
                        <img class="card-img-header" src={card_nano_usenano} />
                     </div>
                     <div class="usernano-card-bottom">
                        <div class="usernano-card-title">
                           Use Nano
                        </div>
                        <div class="usernano-card-text">
                        UseNano.org lists all known merchants that accept Nano as payment, both physical and online stores.
                        </div>
                        <a href="https://usenano.org/" target="_BLANK" class="usernano-card-link arrow-link">Visit usenano.org</a>
                     </div>
                  </div>
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-white">
                        <img class="card-img-header" src={card_nano_nanolinks} />
                     </div>
                     <div class="usernano-card-bottom">
                        <div class="usernano-card-title">
                           Nano Links
                        </div>
                        <div class="usernano-card-text">
                           Find anything Nano related like wallets, exchanges, projects, applications, information, services and news.
                        </div>
                        <a href="https://nanolinks.info/" target="_BLANK" class="usernano-card-link arrow-link">Visit nanolinks.info</a>
                     </div>
                  </div>
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-grey">
                        <img class="card-img-header" src={card_nano_alilnano} />
                     </div>
                     <div class="usernano-card-bottom">
                        <div class="usernano-card-title">
                           A Lil Nano
                        </div>
                        <div class="usernano-card-text">
                           A simple faucet with random payouts for NANO
                        </div>
                        <a href="https://www.alilnano.com/" target="_BLANK" class="usernano-card-link arrow-link">Visit alilnano.com</a>
                     </div>
                  </div>
            </div>
         </div>
         </div>
        </main>
        );
    }
}

export default Partners;