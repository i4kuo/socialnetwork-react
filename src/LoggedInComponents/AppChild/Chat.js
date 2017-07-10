import React from 'react';
import {Link} from 'react-router';
import axios from '../../axios';
import {getSocket} from '../../Socket'
let socket;

export default class Chat extends React.Component{
    constructor (props){
        super(props);
        this.state = {}
        socket = getSocket();
    }

    componentDidMount(){
        axios
        .get(`/getMessages`)
        .then((resp) => {
            var messageInfo = resp.data
            this.setState({
                messageInfo : resp.data,
            })

            socket.on ('updateMessage', (msg) => {
                messageInfo = [...this.state.messageInfo, msg]
                if (messageInfo.length > 10) messageInfo = messageInfo.slice(messageInfo.length - 10, messageInfo.length);
                this.setState({
                    messageInfo : messageInfo,
                })

            });
        })
        .catch((err) => {
            console.log(err);
        })

    }

    handleSubmit(e){
        let that = this;
        let messageInfo;
        if (e.key =="Enter") {

            let messageContent = e.target.value
            var date = new Date().toLocaleString();
            var last = this.props.last_name;
            var first = this.props.first_name;
            var image = this.props.image;
            var id = this.props.id;
            messageInfo = {last, first, image, id, date, messageContent}
            socket.emit('chat', messageInfo);
            e.target.value ="";
        }

    }
    componentWillUnmount(){
        socket.off('chat');
    }

    render(){

        var messageInfo="";

        if(this.state.messageInfo){
            messageInfo = this.state.messageInfo.map(function(cmt){
                return (
                    <div className="message-container">
                    <div id="name-date-container">
                    <p className="message-name"><Link to={cmt.userUrl}>- {cmt.first} {cmt.last} -</Link></p>
                    <p className="message-date">{cmt.date}</p>
                    </div>
                    <div className="message-request">
                    <img className="message-image" src={cmt.image}/>
                    <p className="message-content">{cmt.messageContent}</p>
                    </div>
                    </div>
                )
            })

        }



        return (
            <div>
            <div id="chat-container">
            <div id="message-container" ref={(element) => {
                if (element) {
                    element.scrollTop = element.scrollHeight - element.clientHeight;
                }
            }}>{messageInfo}</div>
            </div>
            <div id="comment-container">
            <img id="user-image" src={this.props.image}/>
            <textarea id="text-container" onKeyDown={this.handleSubmit.bind(this)}/>
            </div>
            </div>

        )
    }
}
