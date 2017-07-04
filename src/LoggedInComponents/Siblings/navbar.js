import React from 'react';
import {Link} from 'react-router';
import axios from '../../axios';


export default class NavBar extends React.Component{
    constructor (props){
        super(props);
        this.state = {}
    }
    handleChangeInput(e){
        console.log(e.target.value);
        var text = e.target.value
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>{
            console.log("coucou");
            axios.get("/resultsSearchInput?query="+ text)
            .then(results => {
                if (results.data.message) {
                    console.log(results.data);
                    this.setState(results.data)
                }else {
                    console.log(results.data);
                    this.setState(results.data);
                }
            })
        },200);

    }

    handleCloseSearch(){
        this.setState({
            message : false,
            results : false
        })
    }

    render(){
        var searchResults =""
        var container =""
        if(this.state.results){
            if (this.state.results.length > 0) {
                searchResults = this.state.results.map(function(user){
                    return (
                        <div className="search-results-container">
                        <img className="search-image" src={user.image}/>
                        <p className="search-name"><Link to={user.userUrl}>{user.first_name} {user.last_name}</Link></p>
                        </div>
                    )
                })
            }else {
                searchResults = <p className="search-message">No results found</p>
            }
        }
        if (this.state.results) {
            container = <div id="nav-bar-results-container">
            {searchResults}
            <img id="close-search" src="/close.svg" onClick={this.handleCloseSearch.bind(this)}/>
            </div>
        }
        return (
            <div>
            <div id="search-input">
            <input type="text" onChange={this.handleChangeInput.bind(this)}/>
            <img id="search-image" src="/search.svg"/>
            </div>
            {container}
            <div id="nav-bar-container">
            <div id="menu">
            <Link className="menu-link" to="/friends">Friends</Link>
            <Link className="menu-link" to="/chat">Chat</Link>
            <Link className="menu-link" to="/online">Online</Link>
            </div>
            </div>
            </div>
        )
    }
}



// <ul id="li-container">
// <li><Link to="/">My Profile</Link></li>
// <li><Link to="/friends">Friends</Link></li>
// <li><Link to="/online">Online Users</Link></li>
//
// </ul>
