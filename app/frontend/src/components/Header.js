import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <div className="nav nav-tabs">
        <li className="nav-item">
            <Link className="nav-link" to=''>Speed Test</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to='Stats'>Statistics</Link>
        </li>
        <li className="nav-item">
            <Link className='nav-link' to='Info'>More Info</Link>
        </li>
    </div>
);

export default Header;