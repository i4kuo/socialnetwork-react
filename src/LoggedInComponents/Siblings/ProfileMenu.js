import React from 'react';
import {Link} from 'react-router';
import axios from '../../axios';

export default class ProfileMenu extends React.Component{
    constructor (props){
        super(props);
        this.state = {}
    }
    handleClick(){

        axios.post('/logout', {})
        .then((resp)=>{
            location.href ='/';
            userIsLoggedIn = null;
        })
        .catch((e) =>{
            console.log(e, "error promises");
        })
    }
    render(){
        return (
            <div id="profile-menu">
            <div className="arrow-up"></div>
            <ul>
            <li><Link to="/" className="profile-menu-link">My Profile</Link></li>
            <li><a className="profile-menu-link" onClick={this.props.openUpload}>Edit Profile Picture</a></li>
            <li><a className="profile-menu-link" onClick={this.handleClick}>Log Out</a></li>
            </ul>
            </div>
        )
    }
}
