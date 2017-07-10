import React from 'react';
import axios from '../../axios';
import App from '../App';


export default class Bio extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    handleEditBio(){
        if (this.state.editBio) {
            this.setState({
                editBio : false
            })
        }else {
            this.setState({
                editBio : true
            })
        }
    }

    handleBioTextEdited(e){
        this.setState({
            newBio : e.target.value
        })
    }

    handleSubmitYesBio(e){
        let newBio = this.state.newBio

        axios.post('/updatingBio', { newBio })

        .then((resp)=>{

            if(resp.data.success){

                this.props.setBio(newBio);


                this.setState({
                    editBio : false
                })
            }else {

                this.setState({
                    error: true,
                    message : resp.data.message
                })
            }
        })

        .catch((e) =>{
            console.log(e, "error promises");
        })
    }

    handleSubmitNoBio(){
        this.setState({
            editBio : false
        })
    }

    render(){
        let bio = "";
        if(!this.state.editBio){
            if(!this.props.bio){
                bio = <p id="bio"><a id="button" onClick={this.handleEditBio.bind(this)}>Add your bio now</a></p>
            }else {
                bio = <p id="bio"> <em>"{this.props.bio}"</em><br/><a id="button" onClick={this.handleEditBio.bind(this)}>Edit it ?</a></p>
            }
        }

        let editBio = "";
        if(this.state.editBio){
            editBio =
            <div id="textarea-bio">
            <textarea onChange={this.handleBioTextEdited.bind(this)}id="bio-field" name="textarea" rows="10" cols="50" >{this.props.bio}</textarea>
            <div id="submit-button-container">
            <input onClick={this.handleSubmitYesBio.bind(this)} id="submit-yes-button" type="submit" value="Post your new Bio!"/>
            <input onClick={this.handleSubmitNoBio.bind(this)} id="submit-no-button" type="submit" value="Cancel"/>
            </div>
            </div>
        }

        return(
            <div id="bio-container">
                {bio}
                {editBio}
            </div>
        )
    }
}
