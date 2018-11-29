import React from 'react';
import 'styles/Footer.css';

const Footer = () => {
	return (
	    <footer className='footer'>
			<span className='text-muted'>
				<a
				  className='footer-item'
				  href={'https://github.com/silverstar194/Nano-SpeedTest'}
				  target='_blank'
				  rel='noopener noreferrer'>{'❤️ Our Github'}</a>
      		</span>
	    </footer>
	);
};

export default Footer;