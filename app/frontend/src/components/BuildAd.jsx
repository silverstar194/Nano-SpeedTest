import React, { Component } from 'react';
import EditableAd from './EditableAd';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import 'styles/AdBuild.css';
import { Helmet } from "react-helmet";
import NavBar from './NavBar';

const TITLE_MAX_LEN = 40;
const DESCRIPTION_MAX_LEN = 120;
const NUM_SLOTS = 5;
const SLOTS = [...Array(NUM_SLOTS + 1).keys()].slice(1); // create a list from 1 to NUM_SLOTS

const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

const defaults = {
    title: '💰Do a thing with your Nano today!',
    description: 'Add a description here as well!'
};

const initValues = {
    selectedSlot: 1,
    title: '',
    description: '',
    url: '',
    project: '',
    email: '',
    showSpinner: false,
    errors: {}
};

class BuildAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initValues
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onEditField = this.onEditField.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
    }
    componentDidMount() {
        fetchWrapper('header/info')
        .then((response) => {
            this.setState({
                costPerSlot: response.data.current_cost_per_slot
            });
        }).catch((err) => {
            makeToast({
                text: `Can't receive Ad pricing`,
                status: 'danger'
            });
        });
    }
    onSubmit(event) {
        const {title, description, url, project, email, selectedSlot, errors} = this.state;
        ['title', 'description', 'url', 'project', 'email'].forEach((key) => {
            const value = this.state[key];
            if (key === 'url') {
                if (value.indexOf('https://') === -1 && value.indexOf('http://') === -1) {
                    errors.needsHTTP = true;
                }
            }
            const obj = ([key] + 'Error');
            const isError = !(value && value.length);
            errors[obj] = isError;
        });
        if (Object.values(errors).includes(true)) { // if there is an invalid field
            this.setState({errors});
            makeToast({
                text: 'Invalid Fields',
                status: 'warning'
            });
        } else {
            this.setState({ showSpinner: true, wasSubmitted: true });
            fetchWrapper('header/add', {
                method: 'POST',
                body: JSON.stringify({
                    ad : {
                        description,
                        title,
                        email,
                        company: project,
                        URL: url,
                        tokens: selectedSlot
                    }
                })
            }).then((response) => {
                if (response.message === 'Success') {
                    this.setState({
                        showSpinner: false,
                        ...initValues
                    });
                    makeToast({
                        text: 'Your Ad has been saved!',
                        status: 'success'
                    });
                } else {
                    this.setState({
                        showSpinner: false,
                        fetchError: true
                    });
                    makeToast({
                        text: 'Something went wrong while creating the Ad. Please try again',
                        status: 'danger'
                    });
                }
            }).catch((err) => {
                makeToast({
                    text: 'Something went wrong while creating the Ad. Please try again',
                    status: 'danger'
                });
                this.setState({
                    showSpinner: false,
                    fetchError: true
                });
            });
        }
        event.preventDefault();
    }
    onRadioChange(event) {
        this.setState({ selectedSlot: parseInt(event.target.value)} );
    }

    dismiss = () => {
        var x = document.getElementById("alert-info");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    onEditField(event) {
        const target = event.target;
        if (!target) return;
        const name = target.name;
        let input = target.value;
        const {errors} = this.state;
        errors[name + 'Error'] = false;

        if (!input) {
            input = '';
            errors[name + 'Error'] = true;
        }

        if (name === 'title') { // max len 40
            errors.titleTooLong = input.length > TITLE_MAX_LEN;
        } else if (name === 'description') { // max len 120
            errors.descriptionTooLong = input.length > DESCRIPTION_MAX_LEN;
        } else if (name === 'url') {
            errors.needsHTTP = input.indexOf('https://') === -1 && input.indexOf('http://') === -1;
        }

        this.setState({
            [name]: input,
            ...errors
        });
    }

    render() {
        const {title, description, url, project, email, selectedSlot, errors} = this.state;
        return (
        <main class="ads-main">
        <NavBar />
         <div class="general-main-area-one">
            <div class="general-header-main center-horizontally max-width">
               Advertise
            </div>
         </div>
         <div class="ads-main-area-two center-horizontally">
            <div class="ads-main-area-two-wrapper center-horizontally max-width">
               <div class="ads-header">
                  About our ads
               </div>
               <div class="half-col">
                  Our ads show up directly at the top of the page. Each time the page changes a new ad is selected. 1 slot represents 5% of the total monthly views.
               </div>
               <div class="input-section">
                  <div class="ads-title">
                     Contact Info
                  </div>
                  <div class="ads-input-text">
                     Project Name - Used only for reference, will not part of ad.
                  </div>
                  <br></br>
                  <input type="text" class="ads-input" placeholder="Enter Project Name" name="fname" />
               </div>
               <br></br>
               <div class="input-section">
                  <div class="ads-input-text">
                     E-mail Address
                  </div>
                  <br></br>
                  <input type="email" class="ads-input" placeholder="Enter E-mail Address" name="fname" />
               </div>
               <div class="input-section">
                  <div class="ads-title">
                     Add content
                  </div>
                  <div class="ads-input-text">
                     Title (max 40 chars.)
                  </div>
                  <br></br>
                  <input type="text" class="ads-input" placeholder="Enter Title" name="fname" />
               </div>
               <br></br>
               <div class="input-section">
                  <div class="ads-input-text">
                     Decription (max 120 chars.)
                  </div>
                  <br></br>
                  <input type="text" class="ads-input" placeholder="Enter Decription" name="fname" />
               </div>
               <br></br>
               <div class="input-section">
                  <div class="ads-input-text">
                     Decription URL
                  </div>
                  <br></br>
                  <input type="text" class="ads-input" placeholder="Enter URL" name="fname" />
               </div>
               <div class="ads-title">
                  Live Preview
               </div>
               <div class="ad__wrapper max-width">
                  <div class="ad__text">💥 Insert your Nano project here. </div>
                  <div class="ad__community__link">AD</div>
               </div>
               <div class="ads-title">
                  Period
               </div>
               <div class="ads-period">
                  Your ad will run from 
                  <div class="ad-date-hightlight">&nbsp;July 29th&nbsp;</div>
                  to 
                  <div class="ad-date-hightlight">&nbsp;July 31th </div>
               </div>
               <div class="ads-title">
                  Ad slots
               </div>
               <div class="ads-input-text">
                  Each Slot represents 5% of all nanospeed.live impressions for the month and are available on a first-come, first-served basis. You may purchase up to 5 slots.
               </div>
               <div class="ad-slot-cards-wrapper">
                  <div class="ad-slot-card">
                     <div class="ad-slot">1 slot</div>
                     <div class="ad-cost">4 nano</div>
                  </div>
                  <div class="ad-slot-card">
                     <div class="ad-slot">2 slots</div>
                     <div class="ad-cost">8 nano</div>
                  </div>
                  <div class="ad-slot-card">
                     <div class="ad-slot">3 slots</div>
                     <div class="ad-cost">16 nano</div>
                  </div>
                  <div class="ad-slot-card active-card">
                     <div class="ad-slot active-card">4 slots</div>
                     <div class="ad-cost active-card">20 nano</div>
                  </div>
               </div>
            </div>
         </div>
         <div class="ads-main-area-three">
            <div class="ads-main-area-three-wrapper center-horizontally max-width">
               <div class="ad-text">
                  Your ad will be reviewed within 24 hours and you'll receive an e-mail. If your ad is approved, you must submit payment in order to secure your ad slot(s).
               </div>
               <div class="ads-main-area-three-button">
                  Submit
               </div>
            </div>
         </div>
        </main>
        );
    }
}

export default BuildAd;