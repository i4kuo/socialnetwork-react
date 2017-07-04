import {Link} from 'react-router';
import React from 'react';
import Welcome from '../welcome';
import axios from '../../axios';



export default class Login extends React.Component {
    constructor (props){
        super(props);
        this.state = {}
    }
    handleClick(){
        const {email, password} = this.state;



        axios.post('/LogInUser', {email, password })
        .then((resp)=>{
            if(resp.data.success){
                location.href ='/'
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
    handleInput(e){
        this.state[e.target.name]= e.target.value;
    }
    render(){
        let elem = '';
        if (this.state.error) {
            elem = <div>{this.state.message}</div>
        }
        return (

                <div className="form-container">
                <div className="log-in">
                <h2 id="login-title">Log In</h2>
                <p className="error-message">{elem}</p>
                <input type="email" name="email" onChange={this.handleInput.bind(this)}/>
                <p>Email Adress</p>

                <input type="password" name="password" onChange={this.handleInput.bind(this)}/>
                <p>Password</p>

                <button id="button" type="submit" onClick={this.handleClick.bind(this)}>Sign In</button>
                </div>
                <p id="advert">If you are not a Wasabian member, please <Link to="/">Register</Link></p>
                </div>

        )
    }
}
