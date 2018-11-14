import React, { Component } from 'react';
import Modal from 'react-modal';
import '../styles/AdvancedModal.css';
import { Form, FormGroup, Input, Label } from 'reactstrap';
// Need to make this a class component so it can have some local state
export default class AdvancedModal extends Component {
    state = {
        locationsActive: true,
        multipleActive: false
    };

    // Having 2 separate sounds silly.  Is there a way to condense?
    setLocationsTab = () => {
        this.setState(() => ({
            locationsActive: true,
            multipleActive: false
        }));
    };

    setMultipleTab = () => {
        this.setState(() => ({
            locationsActive: false,
            multipleActive: true
        }));
    };

    render() {
        return (
            <Modal
                appElement={document.getElementById('root')}
                isOpen={this.props.open}
                contentLabel='Advanced Settings'
                style={{
                    content: {
                        bottom: 'auto'
                    }
                }}
            >
                <h3>Advanced Settings</h3>
                <hr/>
                {this.state.locationsActive ?
                    (
                        <div className='row'>
                            <div className='adv-form-button col-6'>
                                <button
                                    className='btn btn-primary col-12'
                                    onClick={this.setLocationsTab}
                                >Choose Locations
                                </button>
                            </div>
                            <div className='adv-form-button col-6'>
                                <button
                                    className='btn col-12'
                                    onClick={this.setMultipleTab}
                                >Multiple Transactions
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='row'>
                            <div className='adv-form-button col-6'>
                                <button
                                    className='btn col-12'
                                    onClick={this.setLocationsTab}
                                >Choose Locations
                                </button>
                            </div>
                            <div className='adv-form-button col-6'>
                                <button
                                    className='btn btn-primary col-12'
                                    onClick={this.setMultipleTab}
                                >Multiple Transactions
                                </button>
                            </div>
                        </div>
                    )}
                {this.state.locationsActive ?
                    (
                        <Form onSubmit={this.props.handleLocationSettings}>
                            <p>Select the node locations that you want to be used for your test.</p>
                            <FormGroup>
                                <Label for="origin">Origin</Label>
                                <Input type="select" name="origin" id="origin">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="destination">Destination</Label>
                                <Input type="select" name="destination" id="destination">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                            <div>
                                <button className='btn btn-light float-right col-2'>Cancel</button>
                                <button id='submit' className='btn btn-primary float-right col-2'>Save</button>
                            </div>
                        </Form>
                    ) : (
                        <Form onSubmit={this.props.handleLocationSettings}>
                            <p>Select to send either 5 or 10 random transactions for your test.</p>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type='radio'
                                        name='five-rand'/>
                                    5 Random Transactions
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type='radio'
                                        name='five-rand'/>
                                    10 Random Transactions
                                </Label>
                            </FormGroup>
                            <div>
                                <button className='btn btn-light float-right col-2'>Cancel</button>
                                <button id='submit' className='btn btn-primary float-right col-2'>Save</button>
                            </div>
                        </Form>
                    )}
            </Modal>
        );
    }
}