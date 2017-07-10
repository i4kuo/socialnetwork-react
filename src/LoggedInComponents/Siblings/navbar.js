import React from 'react';
import {Link} from 'react-router';
import axios from '../../axios';


export default class NavBar extends React.Component{
    constructor (props){
        super(props);
        this.state = {show : false, showSearch : true, showNotResponsiveMenu: true};
        this.showOrHideMenu = this.showOrHideMenu.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.showOrHideSearchMenu = this.showOrHideSearchMenu.bind(this);
    }
    updateDimensions() {
    var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
        this.setState({width, height});

    }
    componentWillMount() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>{
            this.updateDimensions();
        },200);
    }
    componentDidMount() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>{
            window.addEventListener("resize", this.updateDimensions);
            this.updateDimensions();
        },200);
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>{
            window.addEventListener("resize", this.updateDimensions);
        },200);
    }
    handleChangeInput(e){
        var text = e.target.value
        clearTimeout(this.timer)
        this.timer = setTimeout(() =>{
            axios.get("/resultsSearchInput?query="+ text)
            .then(results => {
                var data = Object.assign({}, results.data, {showSearch : true});
                if (results.data.message) {
                    this.setState(data)
                }else {
                    this.setState(data);
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
    showOrHideMenu(){
        if(this.state.show == false){
            this.setState({show : true})
        }else {
            this.setState({show : false,  showSearch : false})
        }
    }

    showOrHideSearchMenu(){
        if(this.state.show == false){
            this.setState({show : true})
        }else {
            this.setState({show : false, showSearch : false})
        }
        this.componentDidMount();

    }

    showOrHideNotResponsiveSearchMenu(){
        this.setState({show : false, showSearch : false})
        this.componentDidMount();
    }

    render(){
        var showNotResponsiveMenu = {
            display : 'inline-block'
        };
        if (this.state.width > 860 && this.state.showSearch == true ) {
            this.setState({show : false, showNotResponsiveMenu: true, showSearch : false})
        }else if(this.state.width < 860 && this.state.showNotResponsiveMenu == true && this.state.results){
            showNotResponsiveMenu = {
                display : 'none'
            }
            this.setState({show : true, showNotResponsiveMenu: false, showSearch :true})
        }else if (this.state.width < 860 && this.state.showNotResponsiveMenu == true){
            showNotResponsiveMenu = {
                display : 'none'
            }
            this.setState({show : false, showNotResponsiveMenu: false, showSearch :true})
        }

        var show = "";
        var showSearch = "";
        if(!this.state.showSearch){
            showSearch = {
                display : "none"
            };
        }else{
            showSearch = {
                display : "inline-block"
            };
        }
        if (this.state.show) {
            show = {
                display : "flex"
            };

        }else {
            show = {
                display: 'none',
            };
        }
        var searchResults =""
        var container =""
        if(this.state.results){
            if (this.state.results.length > 0) {
                if (this.state.show) {
                    searchResults = this.state.results.map((user)=>{

                        return (
                            <div className="search-results-container">
                            <img className="search-image" src={user.image}/>
                            <p className="search-name"><Link to={user.userUrl} onClick={this.showOrHideSearchMenu}>{user.first_name} {user.last_name}</Link></p>
                            </div>
                        )
                    })
                }else if (this.state.showNotResponsiveMenu){
                    searchResults = this.state.results.map((user)=>{

                        return (
                            <div className="search-results-container">
                            <img className="search-image" src={user.image}/>
                            <p className="search-name"><Link to={user.userUrl} onClick={this.showOrHideNotResponsiveSearchMenu}>{user.first_name} {user.last_name}</Link></p>
                            </div>
                        )
                    })
                }
            }else {
                searchResults = <p className="search-message">No results found</p>
            }
        }
        if (this.state.results) {
            if (this.state.show) {
                container = <div style={showSearch} id="nav-bar-results-responsive-container">
                {searchResults}
                <img id="close-search" src="/close.svg" onClick={this.handleCloseSearch.bind(this)}/>
                </div>
            }else if (this.state.showNotResponsiveMenu){
                container = <div style={showNotResponsiveMenu} id="nav-bar-results-container">
                {searchResults}
                <img id="close-search" src="/close.svg" onClick={this.handleCloseSearch.bind(this)}/>
                </div>
            }
        }
        return (
            <div>
            <div id="nav-bar-container">
            </div>
                <div id="search-input">
                    <input type="text" onChange={this.handleChangeInput.bind(this)}/>
                        <img id="search-image" src="/search.svg"/>
                </div>
                {container}
                <div id="menu">
                    <Link className="menu-link" to="/friends">Friends</Link>
                    <Link className="menu-link" to="/chat">Chat</Link>
                    <Link className="menu-link" to="/online">Online</Link>
                </div>
                <div id="hamburger-menu" onClick={this.showOrHideMenu}><img src="../hambergurmenu.svg"/></div>
                <div id="menu-responsive-container"style={show}>
                <div id="menu-responsive-overlay"><img id="responsive-cross" src="../responsive-cross.svg" onClick={this.showOrHideMenu}/></div>
                <div id="search-responsive-input">
                    <input type="text" onChange={this.handleChangeInput.bind(this)} placeholder="Search"/>
                </div>
                <div id="menu-responsive">
                    <Link className="menu-responsive-link" to="/friends" onClick={this.showOrHideMenu}>Friends</Link>
                    <Link className="menu-responsive-link" to="/chat" onClick={this.showOrHideMenu}>Chat</Link>
                    <Link className="menu-responsive-link" to="/online" onClick={this.showOrHideMenu}>Online</Link>
                </div>
                </div>
            </div>
        )
    }
}
