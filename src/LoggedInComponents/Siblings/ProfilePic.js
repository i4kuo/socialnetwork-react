import React from 'react';
import axios from '../../axios';
import ProfileMenu from './ProfileMenu';


export default class ProfilePic extends React.Component {
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
        let elem = '';

        if (this.props.ShowMenu) {
            elem = <ProfileMenu openUpload={this.props.openUpload} />
        }
        return (
            <div>
            <div id="wrap-profilepic-profilemenu">
                <div id="profile-picture-container" onClick={this.props.ShowProfileMenu} >
                    <p id="upload-profile-picture">Edit Profile</p>
                    <img id="profile-picture" src={this.props.url} />
                </div>
                <p>{this.props.first_name} {this.props.last_name}</p>
                {elem}
            </div>
            </div>
        )
    }
}
