import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Toast extends Component {
	render() {
		const {status} = this.props;
		return (
			<li className={`toast alert alert-${status}`}>
				<p className='toast__content'>{this.props.text}</p>
				<button className='toast__dismiss' onClick={this.props.onDismissClick}>
				x
				</button>
			</li>
		);
	}

  	shouldComponentUpdate() {
		return false;
  	}
}

Toast.propTypes = {
	// color: PropTypes.string.isRequired,
	onDismissClick: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired
};

export default Toast;
