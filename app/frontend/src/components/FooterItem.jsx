import React from 'react';
import PropTypes from 'prop-types';

const FooterItem = ({to, text, url}) => {
    return (
      	<span className='text-muted'>
      	    <a className= 'footer-item'  href={url}>{text}</a>
      	</span>
    );
};

FooterItem.propTypes = {
	activeTab: PropTypes.string.isRequired,
	onSwitchTab: PropTypes.func.isRequired,
	tabName: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default FooterItem;