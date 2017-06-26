import React from 'react';
import NavBar from './navbar';
import Logo from '../../logo';
import axios from '../../axios';
import app from '../App';

export default class ProfilePicUpload extends React.Component {

    constructor(props){
        super(props);
        this.state = {file : null}
    }

    handleChange(e){
        var fd = new FormData();
        this.setState({
            fileToUpload : e.target.files[0]
        });
        fd.append('file', e.target.files[0]);

        axios.post('/uploadImageFromReactBeforeConfirm', fd)
        .then((resp)=>{
            if(resp.data.success){

                this.setState({
                    file : resp.data.file,
                    imageUploaded : true
                });

            }else {

                this.setState({
                    error: true,
                })
            }
        })
        .catch((e) =>{
            console.log(e, "error promises");
        })
    }

    handleYesSubmit(){
        var fd = new FormData();

        fd.append('file', this.state.fileToUpload);
        axios.post('/uploadImageFromReact', fd)
        .then((resp)=>{
            if(resp.data.success){
                this.props.setImage(this.state.file);
                this.setState({
                    file : resp.data.file,
                    imageUploaded : true
                });

            }else {

                this.setState({
                    error: true
                })
            }
        })
        .catch((e) =>{
            console.log(e, "error promises");
        })
    }

    handleNoSubmit(e){
        this.setState({
            file : this.props.url,
            imageUploaded : false
        });
    }

    render(){

        if (!this.state.file){
            this.state.file = this.props.url
        }

        let image = '';
        if(this.state.file){

            image = <img id="preview-image" src={this.state.file} />
        }

        let title = <h2>Want to change your image ?</h2>
        let fileInput = <div>
        <input id="input-file" onChange={this.handleChange.bind(this)} type="file"/>
        <label id="upload-image-button" htmlFor='input-file'>Upload</label>
        </div>
        let yesAndNoButton = <div>
        <input onClick={this.handleYesSubmit.bind(this)} id="button1" type="submit" name="Upload" value="YES!"/>
        <input onClick={this.handleNoSubmit.bind(this)} id="button1" type="submit" name="Upload" value="NO!"/>
        </div>

        if (this.state.imageUploaded) {
            title = <h2> Are you happy with this one ?</h2>
            fileInput = "";
        }else {
            yesAndNoButton = "";
        }

        return(
            <div id="profile-pic-upload-container">
            <div id="else-overlay" onClick={this.props.closeUpload}></div>
            <div id="profile-pic-upload">
            <img id="cross-image-upload" onClick={this.props.closeUpload} src="/cross.svg"/>
            {title}
            <div id="upload-image">
            {fileInput}
            {yesAndNoButton}
            </div>
            {image}
            </div>
            </div>
        )
    }
}
