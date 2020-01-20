import React from 'react';
import PropTypes from 'prop-types';

const EditableAd = ({title, description, url}) => {
    return (
        <div className='container'>
            <div className="ad__wrapper max-width">
                  <div className="ad__text"><a href={url} target='_blank' rel='noopener noreferrer' className='ad__community__link'>
                        <b></b>{title} {description}
                    </a></div>
                  <a className="ad__community__link" href="/BuildAd">AD</a>
            </div>
        </div>
    );
};



EditableAd.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string
};

export default EditableAd;