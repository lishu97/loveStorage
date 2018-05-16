import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Index from './pages/index';
import Login from './pages/login';
import store from './store';

export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Index} />
            <Route path="/login" component={Login}/>
        </Router>
    </Provider>
);