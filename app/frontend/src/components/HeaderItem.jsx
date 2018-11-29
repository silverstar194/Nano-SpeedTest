import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HeaderItem = ({ad, activeTab, onSwitchTab, tabName, to, text}) => {
	const styles = 'nav-link ' + (activeTab === tabName ? 'active' : '') + (ad === 'true' ? ' font-weight-bold' : '');
    return (
      	<li className='nav-item'>
			<Link className={styles} to={to} onClick={() => onSwitchTab(to)}> {text} </Link>
      	</li>
    );
};

HeaderItem.propTypes = {
	activeTab: PropTypes.string.isRequired,
	onSwitchTab: PropTypes.func.isRequired,
	tabName: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default HeaderItem;