import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Ad = ({title, message, url}) => {
    return (
            <div className="ad__wrapper max-width center-horizontally">
                  <div className="ad__text"><a href={url} target='_blank' rel='noopener noreferrer' className='ad__community__link'>
                        <b></b>{title} {message}
                    </a></div>
                  <a className="ad__community__link" href="/BuildAd">AD</a>
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