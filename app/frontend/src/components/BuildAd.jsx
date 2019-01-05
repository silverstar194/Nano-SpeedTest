import React, { Component } from 'react';
import EditableAd from './EditableAd';
import { fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import 'styles/AdBuild.css';
import { Helmet } from "react-helmet";

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
         <div className='AdBuild'>
            <Helmet>
                <title>NanoSpeed.live - Build a community ad.</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="Build a community ad using out interactive ad builder. Ads are a fixed monthly cost."
                 />
            </Helmet>

                { this.state.showSpinner ?
                    <div className='loading-container'>
                        <div className='loader-container d-flex justify-content-center'>
                            <div className='loader'></div>
                        </div>
                        <div>
                            <p className='text-center'>Processing Request. Please Wait</p>
                        </div>
                    </div>
                : <div className='form-container'>
                    <h1>Create Ad</h1>

                    <div id="alert-info" className="alert alert-primary alert-dismissible fade show" role="alert">
                        <h4 className="alert-heading">About our Ads</h4>
                            <h5>Where and how often are the ads shown?</h5>
                            <p>Our ads show up directly at the top of each page.
                               <br/>
                               Each time the page changes a new ad is selected.
                                <br/>
                               1 slot represents 5% of the total monthly views.
                            </p>
                            <a href="mailto:iliketoemail@ymail.com?Subject=Ad Information: NanoSpeed" target="_top">Please contact us with any questions.</a>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.dismiss}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>

                    <b>Live Preview</b>
                    <EditableAd
                        title={title.length ? title : defaults.title}
                        description={description.length ? description : defaults.description}
                        url={url}
                    />
                    <br/>

                   <h2>Ad Content</h2>
                   <form onSubmit={this.onSubmit} >

                      <div className='form-group'>
                        <label htmlFor='title'>Title</label>
                        <small> (max. {TITLE_MAX_LEN} chars)</small>
                        <input
                            type='text'
                            className='form-control'
                            name='title'
                            value={title}
                            onChange={this.onEditField}
                            placeholder='Enter title'
                        />
                        {errors.titleError && <div className='badge-warning'>
                           Please enter a title
                        </div>}
                        {errors.titleTooLong && <div className='badge-warning'>
                           {TITLE_MAX_LEN} Character Max
                        </div>}
                      </div>

                     <div className='form-group'>
                        <label>Description</label>
                        <small> (max. {DESCRIPTION_MAX_LEN} chars)</small>
                        <input
                            type='text'
                            name='description'
                            className='form-control'
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

                      <div className='form-group'>
                        <label>Destination URL</label>
                        <input
                            type='url'
                            name='url'
                            className='form-control'
                            value={url}
                            onChange={this.onEditField}
                            placeholder='Enter URL'>
                        </input>
                        {errors.urlError && <div className='badge-warning'>
                           Please enter a URL
                        </div>}
                        {errors.needsHTTP && <div className='badge-warning'>
                           Make sure to include http:// or https://
                        </div>}
                      </div>

                      <h2>Timing & Pricing</h2>
                      <p>Your ad will run from <b>{new Date(Date.now()  + 1000 * 60 * 60 * 24 * 1).toLocaleDateString({}, dateOptions)}</b> to <b>{ // tomorrow
                            new Date(Date.now() + 1000 * 60 * 60 * 24 * 31).toLocaleDateString({}, dateOptions) // 31 days later
                        }</b>
                      </p>

                      <h3>Ad Slots</h3>
                      <p>Each Slot represents 5% of all nanospeed.live impressions for the month and are available on a first-come, first-served basis. You may purchase up to 5 slots.</p>

                         <div className='form-group'>
                              <div className='col-sm-10'>
                                {
                                    SLOTS.map((slot) => ( // create NUM_SLOTS number of radio buttons
                                        <div key={slot} className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                value={slot}
                                                onChange={this.onRadioChange}
                                                checked={selectedSlot === slot}
                                            />
                                            <label className='form-check-label'>
                                               <b>{slot} Slot{slot > 1 ? 's' : ''}</b> <strike><b>({this.state.costPerSlot * slot  / .1} Nano)</b></strike>
                                                 <div className="text-success"><i>({this.state.costPerSlot * slot } Nano)</i></div>
                                            </label>
                                        </div>
                                    ))
                                }
                            </div>
                          </div>

                         <h2>Contact Info</h2>
                         <div className='form-group'>
                            <label><b>Project Name</b></label>
                            <br/>
                            <small>Used only for reference, will not part of ad.</small>
                            <input
                                type='text'
                                className='form-control'
                                name='project'
                                value={project}
                                onChange={this.onEditField}
                                placeholder='Enter Project Name'
                            />
                            {errors.projectError && <div className='badge-warning'>
                                Please enter a Project Name
                            </div>}
                      </div>

                      <div className='form-group'>
                            <label htmlFor='email'><b>E-mail Address</b></label>
                            <input
                                type='text'
                                className='form-control'
                                name='email'
                                value={email}
                                onChange={this.onEditField}
                                placeholder='Enter Email'>
                            </input>
                            {errors.emailError && <div className='badge-warning'>
                                Please enter an email
                            </div>}
                      </div>

                       <p>Your ad will be reviewed within 24 hours and you'll receive an e-mail.
                           <b> If your ad is approved, you must submit payment in order to secure your ad slot(s).</b>
                        </p>
                      <button onClick={this.onSubmit} type='submit' className='btn btn-success submit-button'>Submit</button>
                    </form>
                </div>
                }
          </div>
        );
    }
}

export default BuildAd;