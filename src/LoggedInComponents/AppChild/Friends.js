import React from 'react';
import axios from '../../axios';
import NavBar from '../Siblings/navbar';
import Logo from '../../logo';
import {Link} from 'react-router';


export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.handleFriendship = this.handleFriendship.bind(this)
        this.handleCancelFriendship = this.handleCancelFriendship.bind(this)
    }

    componentDidMount(){
            axios
            .get('/getUserFriends')
            .then((resp) => {
                this.setState(resp.data)
            })
    }

    handleFriendship(e){
        axios
        .post(`/setFriendShipStatus?friendShipStatus=confirmed&OPId=${e.target.id}`)
        .then((resp) => {
            this.componentDidMount()

        })
    }

    handleCancelFriendship(e){
        axios
        .post(`/setFriendShipStatus?cancelFriendShip=true&OPId=${e.target.id}`)
        .then((resp) => {
            this.componentDidMount()
        })
    }


    render(){

        var waitingForAnwser = "";
        var frToAccept = "";
        var frConfirmed = "";
        var waitingForAnwserTitle = "";
        var frToAcceptTitle = "";
        var frConfirmedTitle= "";

        var self = this;

        if(this.state.WaitingForAnwser && this.state.friendShipToAccept && this.state.friendShipconfirmed){
            if (this.state.WaitingForAnwser.length == 0 && this.state.friendShipToAccept == 0 && this.state.friendShipconfirmed == 0) {
                waitingForAnwserTitle = <h4 id="fr-title">You don't have friends yet...</h4>
            }
        }
        if (this.state.WaitingForAnwser) {
            if (this.state.WaitingForAnwser.length > 0) {
                waitingForAnwserTitle = <h4 id="fr-title">Waiting for Answer</h4>
            }
            waitingForAnwser = this.state.WaitingForAnwser.map(function(fr){
                return (
                    <div className="friend-request">
                        <img className="friend-image" src={fr.image}/>
                        <p className="friend-name"><Link to={fr.userUrl}>{fr.first_name} {fr.last_name}</Link></p>
                        <button id="friend-button" onClick={self.handleCancelFriendship} className="cancel-button" id={fr.id}>Cancel Friend Request</button>
                    </div>
                )
            })
        }
        if (this.state.friendShipToAccept){
            if (this.state.friendShipToAccept.length > 0) {
                frToAcceptTitle = <h4 id="fr-title">Friendship To Accept</h4>;
            }
            frToAccept = this.state.friendShipToAccept.map((fr) =>{
                return (
                    <div className="friend-request">
                        <img className="friend-image" src={fr.image}/>
                        <p className="friend-name"><Link to={fr.userUrl}>{fr.first_name} {fr.last_name}</Link></p>
                        <button id="friend-button" onClick={this.handleFriendship} className="accept-button" id={fr.id}>Accept Friend Request</button>
                    </div>
                )
            })
        }
        if (this.state.friendShipconfirmed){
            if (this.state.friendShipconfirmed.length > 0) {
                frConfirmedTitle = <h4 id="fr-title">Friendship Confirmed</h4>;
            }
            frConfirmed = this.state.friendShipconfirmed.map(function(fr){
                return (
                    <div className="friend-request">
                        <img className="friend-image" src={fr.image}/>
                        <p className="friend-name"><Link to={fr.userUrl}>{fr.first_name} {fr.last_name}</Link></p>
                    </div>
                )
            })
        }


        return(
            <div id="friends-page-container">
            {waitingForAnwserTitle}
            <div id="waitingForAnwser-container">
            {waitingForAnwser}
            </div>
            {frToAcceptTitle}
            <div id="frToAccept-container">
            {frToAccept}
            </div>
            {frConfirmedTitle}
            <div id="frConfirmed-container">
            {frConfirmed}
            </div>
            </div>
        )
    }
}
