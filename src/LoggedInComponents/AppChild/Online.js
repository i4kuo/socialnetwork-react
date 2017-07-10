import React from 'react';
import axios from '../../axios';
import NavBar from '../Siblings/navbar';
import Logo from '../../logo';
import {Link} from 'react-router';
import {getSocket, UpdateUser} from '../../Socket'
let socket;




export default class Online extends React.Component {
    constructor(props){
        super(props);
        this.state = { users : [] };
        this.getOnlineUsers = this.getOnlineUsers.bind(this);
        this.renderOnlineUsers = this.renderOnlineUsers.bind(this);
        socket = getSocket();
    }

    componentDidMount(){
        this.getOnlineUsers();
        socket.on('OnlineUserChange', () => {
            this.getOnlineUsers()
        })
    }

    getOnlineUsers(){
        axios
        .get('/getOnlineUsers')
        .then((resp) => {
            this.setState({users : resp.data.users});

        });
    }

    renderOnlineUsers(){
        return this.state.users.map(function(user){
            return (
                <div>
                    <img id="online-icon" src="/online.svg"/>
                    <img className="friend-image" src={user.image}/>
                    <p className="friend-name"><Link to={user.userUrl}>{user.first_name} {user.last_name}</Link></p>
                </div>
            )
        })
    }



    render(){

        return(
            <div id="online-page">
                {this.renderOnlineUsers()}
            </div>
        )
    }
}
