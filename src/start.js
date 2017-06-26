import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory, hashHistory } from 'react-router';

import {getSocket} from './Socket';
import Logo from './logo';
import axios from './axios';


import Welcome from './LoggedOutComponents/welcome.js';

import Registration from './LoggedOutComponents/WelcomeChild/registerform';
import Login from './LoggedOutComponents/WelcomeChild/loginform';


import App from './LoggedInComponents/App';


import NavBar from './LoggedInComponents/Siblings/navbar';



import Profile from './LoggedInComponents/AppChild/Profile';
import OPProfile from './LoggedInComponents/AppChild/OPProfile';
import Friends from './LoggedInComponents/AppChild/Friends';
import Online from './LoggedInComponents/AppChild/Online';
import Chat from './LoggedInComponents/AppChild/Chat';


const userIsLoggedIn = location.pathname != '/welcome';


const loggedOut = (
    <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
    <IndexRoute component={Registration} />
    <Route path="/login" component={Login} />
    </Route>
    </Router>
);

const loggedIn = (
    <Router history={browserHistory}>
    <Route path="/" component={App}>
    <IndexRoute component={Profile} />
    <Route path="/user/:id" component={OPProfile}></Route>
    <Route path="/friends" component={Friends}></Route>
    <Route path="/online" component={Online}></Route>
    <Route path="/chat" component={Chat}></Route>

    </Route>
    </Router>
);


let elem = loggedOut;
if(userIsLoggedIn){
    elem  = loggedIn
}
ReactDOM.render(elem, document.querySelector('main'));



if(location.pathname != '/welcome'){
    getSocket();
}
