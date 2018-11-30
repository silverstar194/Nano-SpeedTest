import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Toast extends Component {
	render() {
		const {status, text, onDismissClick} = this.props;
		return (
			<li className={'toast__padding'}>
				<div className={`toast alert alert-${status}`}>
					<p className='toast__content'>{text}</p>
					<button className='toast__dismiss' onClick={onDismissClick}>
					X
					</button>
					</div>
			</li>
		);
	}

  	shouldComponentUpdate() {
		return false;
  	}
}

Toast.propTypes = {
	onDismissClick: PropTypes.func.isRequired,
	status: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default Toast;
