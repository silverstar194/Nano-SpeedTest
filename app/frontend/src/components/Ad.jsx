import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import '../styles/Ad.css';

const Ad = ({title, message, url}) => {
    return (
        <div className='container'>
            <div className='jumbotron'>
                <div id='ad-content'>
                    <a href={url} target='_blank' rel='noopener noreferrer' className='row'>
                        <b>{title}</b>&nbsp;{message}
                    </a>
                    <p className='row'>COMMUNITY AD</p>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
	return {
       ...state.ads.currentAd
	};
};

Ad.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

export default connect (mapStateToProps)(Ad);