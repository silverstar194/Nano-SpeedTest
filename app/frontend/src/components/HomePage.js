import React, {Component} from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { switchTab } from '../actions/navigation';
import '../styles/HomePage.css';

class HomePage extends Component {
    onClick = () => {
        // navigate to /Stats route
        this.props.history.push('/Stats');
        this.props.onGoPressed(); // Update current active tab
    };
    render() {
        return (
            <div className="HomePage">
                <Header/>
                <h1 className="page-header text-center">Welcome to NanoSpeed.live</h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="button" className="btn btn-success btn-circle btn-xl" onClick={this.onClick}>Go</button>
                            <br/>
                            {/*<button type="button" className="btn btn-outline-primary">Advanced</button>*/}
                            {/*<br/>*/}
                            Run your live test now.
                        </div>
                    </div>
                    <div/>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
	  	onGoPressed() {
			dispatch(switchTab("Stats")); // Update current active tab
	  	}
	};
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
    onGoPressed: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(HomePage);