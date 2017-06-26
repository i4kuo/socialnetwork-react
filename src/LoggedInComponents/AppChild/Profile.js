import React from 'react';
import axios from '../../axios';
import App from '../App';
import Bio from '../Siblings/Bio';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }


    render(){

        return(
            <div id="profile-page-container">
            <div id="image-container">
               <p id="upload-text">Upload</p>
                <div id="image-overlay"><img onClick={this.props.openUpload} id="image" src={this.props.image}/></div>
            </div>
                <h2 id="name">{this.props.last_name} {this.props.first_name}</h2>

                <Bio
                setBio={this.props.setBio}
                bio = {this.props.bio}
                />

            </div>
        )
    }
}
