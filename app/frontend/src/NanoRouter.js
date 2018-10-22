import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage'

export default() => (
    <BrowserRouter>
        <div>
            {/*<Header />*/}
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                {/*<Route component={NotFoundPage} />*/}
            </Switch>
        </div>
    </BrowserRouter>
);