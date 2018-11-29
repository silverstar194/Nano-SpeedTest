import React from 'react';
import PropTypes from 'prop-types';
import HeaderItem from './HeaderItem';
import {connect} from 'react-redux';
import { switchTab } from '../actions/navigation';

const Header = ({activeTab, onSwitchTab}) => {
	return (
		<div className='nav nav-tabs'>
			<HeaderItem ad='false' activeTab={activeTab} onSwitchTab={onSwitchTab} to='' text='Speed Test' tabName=''/>
			<HeaderItem ad='false' activeTab={activeTab} onSwitchTab={onSwitchTab} to='Results' text='Your Results' tabName='Results'/>
			<HeaderItem ad='false' activeTab={activeTab} onSwitchTab={onSwitchTab} to='Stats' text='Global Statistics' tabName='Stats'/>
			<HeaderItem ad='false' activeTab={activeTab} onSwitchTab={onSwitchTab} to='Info' text='More Info' tabName='Info'/>
			<HeaderItem ad='true' activeTab={activeTab} onSwitchTab={onSwitchTab} to='BuildAd' text='Advertise' tabName='BuildAd'/>
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