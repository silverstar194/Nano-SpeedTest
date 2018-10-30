import React from 'react';
import PropTypes from 'prop-types';
import HeaderItem from './HeaderItem';
import {connect} from 'react-redux';
import { switchTab } from '../actions/navigation';

const Header = ({activeTab, onSwitchTab}) => {
	return (
		<div className='nav nav-tabs'>
			<HeaderItem activeTab={activeTab} onSwitchTab={onSwitchTab} to='' text='Speed Test' tabName=''/>
			<HeaderItem activeTab={activeTab} onSwitchTab={onSwitchTab} to='Stats' text='Statistics' tabName='Stats'/>
			<HeaderItem activeTab={activeTab} onSwitchTab={onSwitchTab} to='Info' text='More Info' tabName='Info'/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
	  	activeTab: state.navigation.activeTab
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	  	onSwitchTab(tab) {
			dispatch(switchTab(tab));
	  	}
	};
};

Header.propTypes = {
	activeTab: PropTypes.string.isRequired,
	onSwitchTab: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);