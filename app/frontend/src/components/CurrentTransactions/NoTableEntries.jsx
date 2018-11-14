import React from 'react';

const NoTableEntries = () => (
    <div className='container centered'>
        <h3 className='map-header page-header text-left'>
            Here you can normally view information about the tests you have run
            but it appears you haven't run any tests yet! Navigate to the Speed Test
            page to run a test.
            <br/>
            FOR DEV -
            <br />
            Additionally, a map of your most recent transaction will appear bellow
            Make this default to locations that we host NANO
        </h3>
    </div>
);

export default NoTableEntries;