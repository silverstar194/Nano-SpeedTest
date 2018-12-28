import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fetchAndUpdateAd from 'util/fetchAndUpdateAd';

const onSwitchTab = (e, to, activeTab) => {
	if (to === activeTab) {
		e.preventDefault();
	} else if (to !== 'BuildAd') {
		fetchAndUpdateAd();
	}
};

const HeaderItem = ({activeTab, to, text}) => {
	const active = (activeTab === to ? ' active' : '');
	const buildAd = (to === 'BuildAd' ? ' font-weight-bold' : '');
	
	const styles = 'nav-link' + active + buildAd;
    return (
      	<li className='nav-item'>
			<Link className={styles} to={to} onClick={(e) => onSwitchTab(e, to, activeTab)}> {text} </Link>
      	</li>
    );
};

HeaderItem.propTypes = {
	activeTab: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default HeaderItem;