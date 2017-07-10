import React from 'react';
import axios from '../../axios';
import App from '../App';
import Bio from '../Siblings/Bio';
import { Link, browserHistory } from 'react-router';

export default class OPProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){


        axios
        .get(`/OPProfile?id=${this.id || this.props.params.id}`)
        .then((resp) => {
            if (resp.data.redirect) {
                return browserHistory.push('/');
            } else if(!resp.data.success){
                this.setState({message : resp.data.message})
            } else {
                this.setState(resp.data)
            }
        })
        .catch((err) => {
            console.log(err);
        })

    }



    componentWillReceiveProps(nextProps){
        if (nextProps.params.id != this.state.id) {
            this.id = nextProps.params.id;
            this.state = {}
            this.componentDidMount();
        }
    }

    handleFriendship(e){

        if (this.state.usersNotFriends) {
            axios
            .post(`/setFriendShipStatus?friendShipStatus=pending&OPId=${this.props.params.id}&toUpdate=${this.state.toUpdate}`)
            .then((resp) => {
                this.setState(resp.data)
            })
        }   else if(this.state.hasToConfirm){
            axios
            .post(`/setFriendShipStatus?friendShipStatus=confirmed&OPId=${this.props.params.id}`)
            .then((resp) => {
                this.setState(resp.data)

            })
        }else if(this.state.UnfriendConfirmation){
            axios
            .post(`/setFriendShipStatus?friendShipStatus=terminated&OPId=${this.props.params.id}`)
            .then((resp) => {
                this.setState(resp.data)
            })
        }

    }
    handleCancelFriendship(e){
        axios
        .post(`/setFriendShipStatus?cancelFriendShip=true&OPId=${this.props.params.id}`)
        .then((resp) => {
            this.setState(resp.data)
        })
    }

    handleUnfriending(e){
        this.setState({
            UnfriendConfirmation : true,
            friendShipCreated : false
        })
    }

    handleCancelUnfriending(e){
        this.setState({
            UnfriendConfirmation : false,
            friendShipCreated : true
        })
    }

    render(){
        console.log("state 2", this.state);
        console.log("props", this.props);
        let bio = "";
        if(this.state.bio){
            bio = <p id="bio"><em>"{this.state.bio}"</em></p>
        }else {
            bio = <p id="bio">There is no bio!</p>
        }
        let status = "";
        if(this.state.usersNotFriends){
                status = <div id="OP-friending"> <input type="button" id="friend-button"  onClick={this.handleFriendship.bind(this)} value="Make Friend Request" /></div>
        }else if(this.state.waitForConfirmation){
            status = <div id="OP-friending">
            <input type="button" id="friend-button" onClick={this.handleCancelFriendship.bind(this)} value="Cancel Friend Request" />
            </div>
        }else if(this.state.hasToConfirm){
            status = <input type="button" onClick={this.handleFriendship.bind(this)} value="Accept Friend Request" />
        }else if (this.state.friendShipCreated){
            status = <div id="OP-friending">
            <p>You are friend with {this.state.last_name} {this.state.first_name}</p>
            <input id="friend-button" type="button" onClick={this.handleUnfriending.bind(this)} value="Unfriend" />
            </div>
        }else if(this.state.UnfriendConfirmation){
            status = <div id="OP-friending">
            <p>Are you sure ?</p>
            <input id="friend-button" type="button" onClick={this.handleFriendship.bind(this)} value="Yes" />
            <input id="friend-button" type="button" onClick={this.handleCancelUnfriending.bind(this)} value="No" />
            </div>
        }


        let errorMessage = "";
        if (this.state.error) {
            errorMessage = <div className="error-message">
            <p>{this.state.message}</p>
            <img src="https://media.giphy.com/media/l0K4p6SITMK3fBQWY/giphy.gif"/></div>
        }

        return(
            <div id="profile-page-container">
            <div className="no-user-url">{errorMessage}</div>

            <img  id="image" src={this.state.image}/>


            <h2 id="name">{this.state.last_name} {this.state.first_name}</h2>
            <div id="bio-container">
            {bio}
            </div>
            {status}

            </div>
        )
    }
}
