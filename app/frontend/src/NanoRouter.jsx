import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserResultsPage from './components/UserResultsPage';
import HistoricalDataView from './components/HistoricalData/HistoricalDataView';
import MoreInfoPage from './components/MoreInfoPage';
import NotFoundPage from './components/NotFoundPage';
import BuildAd from './components/BuildAd';
import Partners from './components/Partners';
import ScrollToTop from 'components/ScrollToTop';
import Toasts from 'components/Notifications/Toasts';
import Header from 'components/Header';
import Footer from 'components/Footer';

export default() => (
    <BrowserRouter>
        <ScrollToTop>
            <Header />
            <Switch>
                <Route path='/' component={HomePage} exact={true} />
                <Route path='/Stats' component={HistoricalDataView}/>
                <Route path='/Results' component={UserResultsPage}/>
                <Route path='/Info' component={MoreInfoPage}/>
                <Route path='/BuildAd' component={BuildAd}/>
                <Route path='/Discover' component={Partners}/>
                <Route component={NotFoundPage}/>
            </Switch>
            <Toasts />
            <Footer />
        </ScrollToTop>
    </BrowserRouter>
);