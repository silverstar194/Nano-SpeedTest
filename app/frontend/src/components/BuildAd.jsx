import React, { Component } from 'react';
import EditableAd from './EditableAd';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
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
                        text: 'Your Ad has been submitted!',
                        status: 'success'
                    });
                    alert('Your Ad has been submitted!')
                    window.location.href = "/";
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
        <main className="ads-main">
        <NavBar />
         <div className="general-main-area-one">
            <div className="general-header-main center-horizontally max-width">
               Advertise
            </div>
         </div>
         <div className="ads-main-area-two center-horizontally">
            <div className="ads-main-area-two-wrapper center-horizontally max-width">
               <div className="ads-header">
                  About our ads
               </div>
               <div className="half-col">
                  Our ads show up directly at the top of the page. Each time the page changes a new ad is selected. 1 slot represents 5% of the total monthly views.
               </div>
               <form>
               <div className="input-section">
                  <div className="ads-title">
                     Contact Info
                  </div>
                  <div className="ads-input-text">
                     Project Name - Used only for reference, will not part of ad.
                  </div>
                  <input
                      type='text'
                      className='form-control ads-input'
                      name='project'
                      value={project}
                      onChange={this.onEditField}
                      placeholder='Enter Project Name'
                  />
                  {errors.projectError && <div className='badge-warning'>
                                Please enter a Project Name
                  </div>
                  }
               </div>
               <br></br>
               <div className="input-section">
                  <div className="ads-input-text">
                     E-mail Address
                  </div>
                 <input
                        type='email'
                        className='form-control ads-input'
                        name='email'
                        value={email}
                        onChange={this.onEditField}
                        placeholder='Enter Email'
                 />
                  {errors.emailError && <div className='badge-warning'>Please enter an email</div>}       
               </div>
               <div className="input-section">
                  <div className="ads-title">
                     Add content
                  </div>
                  <div className="ads-input-text">
                     Title (max {TITLE_MAX_LEN} chars.)
                  </div>
                  <input
                      type='text'
                      className='form-control ads-input'
                      name='title'
                      value={title}
                      onChange={this.onEditField}
                      placeholder='Enter title'
                  />
                  {errors.titleError && <div className='badge-warning'>Please enter a title</div>}
                  {errors.titleTooLong && <div className='badge-warning'>
                     {TITLE_MAX_LEN} Character Max
                  </div>
                  }
               </div>
               <br></br>
               <div className="input-section">
                  <div className="ads-input-text">
                     Decription (max {DESCRIPTION_MAX_LEN} chars.)
                  </div>
                  <input
                      type='text'
                      name='description'
                      className='form-control ads-input'
                      value={description}
                      onChange={this.onEditField}
                      placeholder='Enter description'
                  />
                  {errors.descriptionError && <div className='badge-warning'>
                     Please enter a description
                  </div>}
                  {errors.descriptionTooLong && <div className='badge-warning'>
                     {DESCRIPTION_MAX_LEN} Character Max
                  </div>}               
               </div>
               <br></br>
               <div className="input-section">
                  <div className="ads-input-text">
                     Decription URL
                  </div>
              <input
                  type='url'
                  name='url'
                  className='form-control ads-input'
                  value={url}
                  onChange={this.onEditField}
                  placeholder='Enter URL'
              />
              {errors.urlError && <div className='badge-warning'>
                 Please enter a URL
              </div>}
              {errors.needsHTTP && <div className='badge-warning'>
                 Make sure to include http:// or https://
              </div>}               
              </div>
               <div className="ads-title">
                  Live Preview
               </div>
               <EditableAd
                        title={title.length ? title : defaults.title}
                        description={description.length ? description : defaults.description}
                        url={url}
               />
               <div className="ads-title">
                  Period
               </div>
               <div className="ads-period">
                  Your ad will run from 
                  <div className="ad-date-hightlight">&nbsp;{new Date(Date.now()  + 1000 * 60 * 60 * 24 * 1).toLocaleDateString({}, dateOptions)}&nbsp;</div>
                  to 
                  <div className="ad-date-hightlight">&nbsp;{new Date(Date.now() + 1000 * 60 * 60 * 24 * 31).toLocaleDateString({}, dateOptions)}</div>
               </div>
               <div className="ads-title">
                  Ad slots
               </div>
               <div className="ads-input-text">
                  Each Slot represents 5% of all nanospeed.live impressions for the month and are available on a first-come, first-served basis. You may purchase up to 5 slots.
               </div>
               <div className="ad-slot-cards-wrapper">
                 {
                  SLOTS.map((slot) => ( // create NUM_SLOTS number of radio buttons
                      <div key={slot} className="ad-slot-card">
                          <input
                              className='form-check-input'
                              type='radio'
                              value={slot}
                              onChange={this.onRadioChange}
                              checked={selectedSlot === slot}
                          />
                          <label htmlFor={slot}>
                           <div className="ad-slot">{slot} Slot{slot > 1 ? 's' : ''}</div>
                           <div className="ad-cost">{this.state.costPerSlot * slot } nano</div>
                          </label>
                      </div>
                  ))
                 }
               </div>
         <div className="ads-main-area-three">
            <div className="ads-main-area-three-wrapper center-horizontally">
               <div className="ad-text">
                  Your ad will be reviewed within 24 hours and you'll receive an e-mail. If your ad is approved, you must submit payment in order to secure your ad slot(s).
               </div>
              <button onClick={this.onSubmit} type='submit' className='ads-main-area-three-button'>Submit</button>
            </div>
         </div>
        </form>
      </div>
    </div>
  </main>
 );
}
}

export default BuildAd;