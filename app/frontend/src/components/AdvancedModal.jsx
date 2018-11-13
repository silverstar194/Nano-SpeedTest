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

    changeActive = (e) => {
        this.setState(() => ({
            locationsActive: !this.state.locationsActive,
            multipleActive: !this.state.multipleActive
        }));
    };

    render() {
        return (
            <Modal
                appElement={document.getElementById('root')}
                isOpen={this.props.open}
                contentLabel='Advanced Settings'
            >
                <h3>Advanced Settings</h3>
                <hr/>
                <div className='row'>
                    <div className='adv-form-button col-6'>
                        <button
                            className='btn btn-primary col-12'
                            onClick={this.changeActive}
                        >Choose Locations
                        </button>
                    </div>
                    <div className='adv-form-button col-6'>
                        <button
                            className='btn btn-outline-primary col-12'
                            onClick={this.changeActive}
                        >Multiple Transactions
                        </button>
                    </div>
                </div>
                <Form onSubmit={this.props.handleAdvancedSettings}>
                    <FormGroup>
                        <Label for="origin">Origin</Label>
                        <Input
                            id='origin'
                            type='text'
                            name='origin'
                            placeholder='Please select your Nano transaction origin.'/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="destination">Destination</Label>
                        <Input
                            id='origin'
                            type='text'
                            name='origin'
                            placeholder='Please select your Nano transaction destination.'/>
                    </FormGroup>
                    <div>
                            <button className='btn btn-light float-right col-2'>Cancel</button>
                            <button id='submit' className='btn btn-primary float-right col-2'>Save</button>
                    </div>
                </Form>
            </Modal>
        );
    }
}