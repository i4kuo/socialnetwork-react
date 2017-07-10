import React from 'react';
import ReactDOM from 'react-dom';
import Logo from '../logo';

export default function Welcome(props){
    return (
        <div>
        <div id="welcome-background"></div>
        <div id="big-logo">
            <Logo />
        </div>
            {props.children}
        </div>
    )
}
