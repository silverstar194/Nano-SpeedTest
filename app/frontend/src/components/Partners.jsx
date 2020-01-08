import React, { Component } from 'react';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import 'styles/Cards.css';
import Ad from 'components/Ad';
import icon from 'img/icon.jpg'
import { Helmet } from "react-helmet";
import NavBar from './NavBar';
import card_nano_center from '../img/card_nano_center.png'
import card_nano_crawler from '../img/card_nano_crawler.png'
import { Link } from 'react-router-dom';

class Partners extends Component {

    render() {

       return (
        <main class="usenano-main">
        <NavBar />
         <div class="general-main-area-one">
            <div class="general-header-main center-horizontally max-width">
               Use Nano
            </div>
         </div>
         <div class="usenano-main-area-two">
            <div class="usenano-partner-info-wrapper center-horizontally max-width">
               <div class="usenano__text">
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
                        <a href="#" class="usernano-card-link arrow-link">Visit nanocrawler.cc </a>
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
                        <a href="#" class="usernano-card-link arrow-link">Visit nanocenter.org</a>
                     </div>
                  </div>
                  <div class="usenano-card">
                     <div class="usernano-card-top usernano-card-top-dark">
                        Nano Links
                     </div>
                     <div class="usernano-card-bottom">
                        <div class="usernano-card-title">
                           Nano Links
                        </div>
                        <div class="usernano-card-text">
                           Find anything Nano related like wallets, exchanges, projects, applications, information, services and news.
                        </div>
                        <a href="#" class="usernano-card-link arrow-link">Visit nanolinks.info</a>
                     </div>
                  </div>
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
                        <a href="#" class="usernano-card-link arrow-link">Visit Nanocrawler.cc</a>
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