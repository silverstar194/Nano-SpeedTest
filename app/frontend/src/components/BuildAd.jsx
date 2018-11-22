import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import EditableAd from './EditableAd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'styles/AdBuild.css';

const placeHolders = {
    title: '💰Do a thing with your Nano today!',
    description: 'Add a description here as well!',
    url: null,
    project: null,
    email: null
};

class BuildAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...placeHolders
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onEditField = this.onEditField.bind(this);
    }

    onSubmit() {
        const {title, description, url, project, email} = this.state;
        console.log(JSON.stringify({
            title,
            description,
            url,
            project,
            email
        }));
    }

    onEditField(event, field) {
        let input = event.target.value && event.target.value.trim();
        if (!input) input = placeHolders[field];
        this.setState({[field]: input});
    }

    render() {
        const {title, description, url} = this.state;
        return (
         <div className='AdBuild'>
               <Header/>

               <div className='form-container'>
                    <h3>Create Ad</h3>
                    <b>Live Preview</b>
                    <EditableAd title={title} description={description} url={url}/>
                    <br/>

                   <h3>Ad Content</h3>
                   <form>
                      <div className='form-group'>
                        <label htmlFor='title'>Title</label>
                        <small> (max. 40 chars)</small>
                        <input
                            type='text'
                            onChange={(e) => this.onEditField(e, 'title')}
                            className='form-control'
                            id='title'
                            placeholder='Enter title'>
                        </input>
                      </div>
                      <div className='form-group'>
                        <label htmlFor='description'>Description</label>
                        <small> (max. 120 chars)</small>
                        <input
                            type='text'
                            onChange={(e) => this.onEditField(e, 'description')}
                            className='form-control'
                            id='description'
                            placeholder='Enter description'>
                        </input>
                      </div>
                      <div className='form-group'>
                        <label htmlFor='url'>Destination URL</label>
                        <input
                            type='url' onChange={(e) => this.onEditField(e, 'url')}
                            className='form-control'
                            id='url'
                            placeholder='Enter URL'>
                        </input>
                      </div>

                      <h3>Timing & Pricing</h3>
                      <p>Your ad will run from <b>DATE ONE</b> to <b>DATE TWO</b></p>

                      <h4>Ad Slots</h4>
                      <p>Each Slot represents 5% of all Nanode impressions for the month and are available on a first-come, first-served basis.</p>

                         <div className='form-group'>
                              <div className='col-sm-10'>
                                <div className='form-check'>
                                  <input className='form-check-input' type='radio' name='gridRadios' id='gridRadios1' value='1' defaultChecked></input>
                                  <label className='form-check-label' htmlFor='gridRadios1'>
                                     <b>1 Slot (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div className='form-check'>
                                  <input className='form-check-input' type='radio' name='gridRadios' id='gridRadios2' value='2'></input>
                                  <label className='form-check-label' htmlFor='gridRadios2'>
                                     <b>2 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div className='form-check'>
                                  <input className='form-check-input' type='radio' name='gridRadios' id='gridRadios3' value='3'></input>
                                  <label className='form-check-label' htmlFor='gridRadios3'>
                                    <b> 3 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div className='form-check'>
                                  <input className='form-check-input' type='radio' name='gridRadios' id='gridRadios4' value='4'></input>
                                  <label className='form-check-label' htmlFor='gridRadios4'>
                                     <b>4 Slots (PLACEHOLD NANO)</b>
                                  </label>
                                </div>
                                <div className='form-check'>
                                  <input className='form-check-input' type='radio' name='gridRadios' id='gridRadios5' value='5'></input>
                                  <label className='form-check-label' htmlFor='gridRadios5'>
                                    <b>5 Slots (PLACEHOLD NANO)</b>
                                  </label>
                              </div>
                            </div>
                          </div>

                         <h4>Contact Info</h4>
                         <div className='form-group'>
                            <label htmlFor='project'><b>Project Name</b></label>
                            <br/>
                            <small>Used only for reference, will not part of ad.</small>
                            <input
                                type='text'
                                onChange={(e) => this.onEditField(e, 'project')}
                                className='form-control'
                                id='project'
                                placeholder='Enter Project Name'>
                            </input>
                      </div>
                      <div className='form-group'>
                            <label htmlFor='email'><b>E-mail Address</b></label>
                            <input
                                type='text'
                                onChange={(e) => this.onEditField(e, 'email')}
                                className='form-control'
                                id='email'
                                placeholder='Enter Email'>
                            </input>
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
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

BuildAd.propTypes = {
    history: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildAd);