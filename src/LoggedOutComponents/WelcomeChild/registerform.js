import {Link} from 'react-router';
import React from 'react';
import Welcome from '../welcome';
import axios from '../../axios';

export default class Registration extends React.Component {
    constructor (props){
        super(props);
        this.state = {}
    }
    handleClick(){
        const { first, last, email, password} = this.state

        if (!first || !last || !email || !password) {

            this.setState({
                error: true,
                message : "Please fill all the form !"
            })
            return
        }else if (!email.includes("@")){
            this.setState({
                error: true,
                message : "Please enter a valid email"
            })
            return
        }

        axios.post('/registerUser', { first, last, email, password })
        .then((resp)=>{

            if(resp.data.success){;
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

            <div>


            <div className="form-container">
            <div className="register">

            <h2 id="register-title">Register</h2>

            <p className="error-message">{elem}</p>

            <input type="text" name="first" onChange={this.handleInput.bind(this)}/>
            <p>First Name</p>

            <input type="text" name="last" onChange={this.handleInput.bind(this)}/>
            <p>Last Name</p>

            <input type="email" name="email" onChange={this.handleInput.bind(this)}/>
            <p>Email Adress</p>

            <input type="password" name="password" onChange={this.handleInput.bind(this)}/>
            <p>Password</p>

            <button id="button" type="submit" onClick={this.handleClick.bind(this)}>Sign Up</button>

            </div>
            <p id="advert">If you are already member, please <Link to="/login">Log In</Link></p>
            </div>
            </div>

        )
    }
}
