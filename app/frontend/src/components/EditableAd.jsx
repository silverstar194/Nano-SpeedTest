import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Ad.css';

const EditableAd = ({title, description, url}) => {
    return (
        <div className='container'>
            <div className='jumbotron'>
                <div id='ad-content'>
                    <a href={url} target='_blank' rel='noopener noreferrer' className='row'>
                        <b>{title}</b>&nbsp;{description}
                    </a>
                    <p className='row'>COMMUNITY AD</p>
                </div>
            </div>
        </div>
    );
};

EditableAd.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string
};

export default EditableAd;