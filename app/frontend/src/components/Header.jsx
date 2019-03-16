import React from 'react';
import PropTypes from 'prop-types';
import HeaderItem from './HeaderItem';
import { withRouter } from 'react-router'; // provides access to the history and location

/**
 * location: has pathname to current url which is used on the tab
 * to: url to navigate to
 * text: display name of the tab
 */
const Header = ({location}) => {
	const activeTab = location && location.pathname.substring(1);
	return (
	<>
		<div className='nav nav-tabs'>
			<HeaderItem activeTab={activeTab} to='' text='Speed Test' />
			<HeaderItem activeTab={activeTab} to='Results' text='Your Results' />
			<HeaderItem activeTab={activeTab} to='Stats' text='Global Statistics' />
			<HeaderItem activeTab={activeTab} to='Info' text='More Info' />
			<HeaderItem activeTab={activeTab} to='BuildAd' text='Advertise' />
			<HeaderItem activeTab={activeTab} to='Discover' text='Use Nano' />
		</div>
        <a  href="https://nanocenter.org/projects/bea2eee0-4504-11e9-b8fd-f1b4d2ae12dc">
        <div class="alert alert-info alert-dismissible fade show" role="alert">
            Help fund us through the <a href="#" class="alert-link">NanoCenter</a> today.
            Status: <i>Funding pending...</i>
            <button type="button" class="close" data-dismiss="alert" aria-label="Go">
                <span aria-hidden="true">-></span>
            </button>
        </div>
       </a>
    </>
	);
};

Header.propTypes = {
	location: PropTypes.object.isRequired
};

export default withRouter(Header);