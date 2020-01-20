import React, { Component } from 'react';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import { Helmet } from "react-helmet";
import NavBar from './NavBar';
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
         <div className="usenano-main-area-three">
            <div className="usenano-main-three-wrapper-outer center-horizontally max-width">
               <div className="usenano-main-area-three-wrapper">
                  {goldCards}
               </div>
            </div>
            </div>
        </main>
        );
    }
}

export default Partners;