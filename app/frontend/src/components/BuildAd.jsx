import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import EditableAd from './EditableAd';
import PropTypes from 'prop-types';
import { fetchWrapper } from 'util/helpers';
import 'styles/AdBuild.css';

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
    email: ''
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
        fetchWrapper('http://127.0.0.1:8000/advertisements/info')
        .then((response) => {
            this.setState({
                costPerSlot: response.data.current_cost_per_slot
            });
        });
    }
    onSubmit(event) {
        const {title, description, url, project, email, selectedSlot} = this.state;
        console.log(JSON.stringify({
            title,
            description,
            url,
            project,
            email
        }));
        const errors = {};
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

        if (Object.values(errors).includes(true)) {
            this.setState({...errors});
        } else {
            fetchWrapper('http://127.0.0.1:8000/advertisements/add', {
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
            });
            this.setState({
                ...errors,
                ...initValues
            });
        }
        event.preventDefault();
    }
    onRadioChange(event) {
        this.setState({ selectedSlot: parseInt(event.target.value)} );
    }
    onEditField(event) {
        const target = event.target;
        if (!target) return;
        const name = target.name;
        let input = target.value;
        let isError = false;
        if (!input) {
            input = '';
            isError = true;
        }

        if (name === 'title' && input.length > TITLE_MAX_LEN) { // max len 40
            //TODO make sure valid input
        } else if (name === 'description' && input.length > DESCRIPTION_MAX_LEN) { // max len 120
            //TODO make sure valid input
        } else if (name === 'url' && this.state.needsHTTP) {
            let needsHTTP = false;
            if (input.indexOf('https://') === -1 && input.indexOf('http://') === -1) {
                needsHTTP = true;
            }
            this.setState({ needsHTTP });
        }

        this.setState({
            [name]: input,
            [name + 'Error']: isError
        });
    }

    render() {
        let {title, description, url, project, email, selectedSlot} = this.state;

        return (
         <div className='AdBuild'>
               <Header/>

               <div className='form-container'>
                    <h3>Create Ad</h3>
                    <b>Live Preview</b>
                    <EditableAd
                        title={title.length ? title : defaults.title}
                        description={description.length ? description : defaults.description}
                        url={url}
                    />
                    <br/>

                   <h3>Ad Content</h3>
                   <form onSubmit={this.onSubmit} >

                      <div className='form-group'>
                        <label htmlFor='title'>Title</label>
                        <small> (max. 40 chars)</small>
                        <input
                            type='text'
                            className='form-control'
                            name='title'
                            value={title}
                            onChange={this.onEditField}
                            placeholder='Enter title'
                        />
                        {this.state.titleError && <div className='badge-warning'>
                           Please enter a title
                        </div>}
                      </div>

                     <div className='form-group'>
                        <label>Description</label>
                        <small> (max. 120 chars)</small>
                        <input
                            type='text'
                            name='description'
                            className='form-control'
                            value={description}
                            onChange={this.onEditField}
                            placeholder='Enter description'
                        />
                        {this.state.descriptionError && <div className='badge-warning'>
                           Please enter a description
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
                        {this.state.urlError && <div className='badge-warning'>
                           Please enter a URL
                        </div>}
                        {this.state.needsHTTP && <div className='badge-warning'>
                           Make sure to include http:// or https://
                        </div>}
                      </div>

                      <h3>Timing & Pricing</h3>
                      <p>Your ad will run from <b>{new Date().toLocaleDateString({}, dateOptions)}</b> to <b>{
                            new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString({}, dateOptions)
                        }</b>
                      </p>

                      <h4>Ad Slots</h4>
                      <p>Each Slot represents 5% of all Nanode impressions for the month and are available on a first-come, first-served basis.</p>

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
                                                <b>{slot} Slot{slot > 1 ? 's' : ''} ({this.state.costPerSlot * slot} Nano)</b>
                                            </label>
                                        </div>
                                    ))
                                }
                            </div>
                          </div>

                         <h4>Contact Info</h4>
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
                            {this.state.projectError && <div className='badge-warning'>
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
                            {this.state.emailError && <div className='badge-warning'>
                                Please enter an email
                            </div>}
                      </div>

                       <p>Your ad will be reviewed within 24 hours and you'll receive an e-mail.
                           <b> If your ad is approved, you must submit payment in order to secure your ad slot(s).</b>
                        </p>
                      <button onClick={this.onSubmit} type='submit' className='btn btn-success'>Submit</button>
                    </form>
                </div>
                <Footer/>
          </div>
        );
    }
}

BuildAd.propTypes = {
};

export default BuildAd;