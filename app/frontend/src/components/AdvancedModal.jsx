import React from 'react';
import Modal from 'react-modal';

export default (props) => (
    <Modal
        appElement={document.getElementById('root')}
        isOpen={props.open}
        contentLabel='Advanced Settings'
    >
        <h3>Advanced Settings</h3>
        <hr/>
        <button className='btn btn-primary' onClick={props.handleAdvancedSettings}>Submit</button>
    </Modal>
);