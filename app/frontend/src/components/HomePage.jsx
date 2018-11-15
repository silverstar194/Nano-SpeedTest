import React, { Component } from 'react';
import Header from './Header';
import Ad from './Ad';
import AdvancedModal from './AdvancedModal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { switchTab } from '../actions/navigation';
import { fetchRandomTransaction } from '../actions/table';
import '../styles/HomePage.css';

class HomePage extends Component {
    // component specific state -- don't need to add to redux store
    state = {
        modalOpen: false
    };

    onAdvancedClick = () => {
      this.setState(() => ({modalOpen: true}));
    };

    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Stats');
        this.props.onGoPressed(); // Update current active tab and dispatch action to get transaction data
    };

    handleLocationSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({modalOpen: false}));
    };

    handleMultiSettings = (e) => {
        // don't reload page on form submit from modal
        e.preventDefault();
        this.setState(() => ({modalOpen: false}));

        console.log(this.props.advSettings.values);
    };

    handleCancel = () => {
        this.setState(() => ({modalOpen: false}));
    };

    render() {
        return (
            <div className='HomePage'>
                <Header/>
                <Ad/>
                <AdvancedModal
                    open={this.state.modalOpen}
                    handleLocationSettings={this.handleLocationSettings}
                    handleMultiSettings={this.handleMultiSettings}
                    handleCancel={this.handleCancel}
                />
                <h1 className='greeting page-header text-center'>Welcome to NanoSpeed.live!</h1>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            <button type='button' className='btn btn-success btn-circle btn-xl' onClick={this.onClick}>
                                Go
                            </button>
                            <br/>
                            <button id='advanced-btn' type='button' className='btn btn-primary' onClick={this.onAdvancedClick}>Advanced</button>
                            <br/>
                            <p className='greeting'>Run your live test now.</p>
                        </div>
                    </div>
                    <div/>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        advSettings: state.form.advSettings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGoPressed() {
            dispatch(fetchRandomTransaction());
            dispatch(switchTab('Stats')); // Update current active tab
        }
    };
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);