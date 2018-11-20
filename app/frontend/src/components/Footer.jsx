import React from 'react';
import PropTypes from 'prop-types';
import FooterItem from './FooterItem';
import {connect} from 'react-redux';
import { switchTab } from '../actions/navigation';
import '../styles/Footer.css';

const Footer = ({activeTab, onSwitchTab}) => {
	return (
	    <footer class="footer">
	        <FooterItem to='https://github.com/silverstar194/Nano-SpeedTest' text='❤️ Our Github' url='https://github.com/silverstar194/Nano-SpeedTest'/>
	    </footer>
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

Footer.propTypes = {
	activeTab: PropTypes.string.isRequired,
	onSwitchTab: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);