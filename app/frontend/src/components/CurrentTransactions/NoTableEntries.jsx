import React from 'react';
import { Link } from 'react-router-dom';

const NoTableEntries = () => (
    <div className='container centered'>
        <h4 className='map-header page-header text-left'>
            Here you can normally view information about the tests you have run
            but it appears you haven't run any tests yet!
        </h4>
        <p/>
        <Link className='btn btn-success ml-3' to='/'>Send a transaction and try it yourself</Link>
    </div>
);

export default NoTableEntries;