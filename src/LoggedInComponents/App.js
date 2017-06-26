import React from 'react';
import NavBar from './Siblings/navbar';
import Logo from '../logo';
import axios from '../axios';
import ProfilePicUpload from './Siblings/ProfilePicUpload';
import ProfileMenu from './Siblings/ProfileMenu';
import ProfilePic from './Siblings/ProfilePic';
import Profile from './AppChild/Profile';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
        this.setImage = this.setImage.bind(this)
    }

    componentDidMount(){

            axios
            .get('/myProfile')
            .then((resp) => {
                this.setState(resp.data)
            })
    }

    openUpload(){

        this.setState({
            showUpload: true,
            showProfileMenu : false
        })
    }

    closeUpload(){

        this.setState({
            showUpload: false,
        })
    }

    setImage(url){

        this.setState({
            image : url,
            showUpload: false,
            showProfileMenu : false
        })
    }

    setBio(newBio){

        this.setState({
            bio : newBio,

        })
    }
    ShowProfileMenu(){

        if (this.state.showProfileMenu) {
            this.setState({
                showProfileMenu : false
            })
        }else {
            this.setState({
                showProfileMenu : true
            })
        }
    }

    render(){

        const {first_name, last_name, bio, image, id} = this.state;


        const children = React.cloneElement(this.props.children,

            {
                first_name,
                last_name,
                bio,
                image,
                id,
                setBio : this.setBio.bind(this),
                openUpload : this.openUpload.bind(this)
            });


        return(
            <div id="tiny-logo">
                <NavBar />
                <Logo />
                <ProfilePic
                first={this.state.first_name}
                last={this.state.last_name}
                url={this.state.image}
                ShowProfileMenu = {this.ShowProfileMenu.bind(this)}
                ShowMenu = {this.state.showProfileMenu}
                openUpload={this.openUpload.bind(this)}
                />
                {this.state.showUpload && <ProfilePicUpload closeUpload={this.closeUpload.bind(this)} url={this.state.image} setImage={this.setImage.bind(this)} />}
                {children}
            </div>
        )
    }
}
