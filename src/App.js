import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import {gapi} from "gapi-script";

import M from "materialize-css/dist/js/materialize.min.js";
import './App.scss';

import Blogs from './components/Blogs';


class App extends Component {

    GoogleAuth;

    constructor(props) {
        super(props);
        this.state = {
            btnText: "Login",
            user: null,
        }
        this.setSignInStatus = this.setSignInStatus.bind(this);
        this.updateSignInStatus = this.updateSignInStatus.bind(this);
    }


    componentDidMount() {
        this.initSidenav();
        this.initGAPI();
    }

    initSidenav() {
        let element = document.querySelector('.sidenav');
        M.Sidenav.init(element, {
            edge: 'left',
            inDuration: 250
        });
    }

    initGAPI() {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                'client_id': '835840484437-f27qtek3epp6n65s8gu41gv6i95n44l5.apps.googleusercontent.com',
                'scope': 'https://www.googleapis.com/auth/blogger'
            }).then(() => {
                this.GoogleAuth = gapi.auth2.getAuthInstance();
                this.GoogleAuth.isSignedIn.listen(this.updateSignInStatus);
                this.setSignInStatus();
            })
        })
    }

    handleAuthClick() {
        if (this.GoogleAuth.isSignedIn.get()) {
            this.GoogleAuth.signOut()
        } else {
            this.GoogleAuth.signIn()
        }
    }

    setSignInStatus() {
        let user = this.GoogleAuth.currentUser.get();
        let isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/blogger');
        if (isAuthorized) {
            this.setState({
                user: {
                    name: user.getBasicProfile().getName()
                }
            })
            this.setState({btnText: "Logout"})
            M.toast({html: 'Logged in!'})
        } else {
            this.setState({btnText: "Login"})
            this.setState({user: null})
            M.toast({html: 'Logged out!'})
        }
    }

    updateSignInStatus() {
        this.setSignInStatus();
    }

    render() {
        return (
            <Router>
                <header>
                    <nav className="hide-on-large-only">
                        <div className="nav-wrapper">
                            <span className="brand-logo">AWFT</span>
                            <a href="/#" data-target="nav-mobile"
                               className="top-nav sidenav-trigger full"><i
                                className="material-icons">menu</i></a>
                        </div>
                    </nav>
                    <ul id="nav-mobile" className="sidenav sidenav-fixed">
                        <li>
                            <div className="user-view deep-orange">
                                <img className="circle" src="https://placeimg.com/64/64/people" alt="profile"/>
                                <span className="white-text name">Max Mustermann</span>
                                <span className="white-text email">max@mustermann.de</span>
                            </div>
                        </li>
                        <li>
                            <a href="/#" className="waves-effect" onClick={() => this.handleAuthClick()}><i
                                className="material-icons">input</i> {this.state.btnText}</a>
                        </li>
                    </ul>
                </header>

                <main>
                    <div className="container">
                        <Switch>
                            <Route path="/" exact
                                   render={() => <Blogs name={this.state.user ? this.state.user.name : null}/>}/>
                            {!this.state.user && <Redirect to={"/"}/>}
                        </Switch>
                    </div>
                </main>
            </Router>
        );
    }
}

export default App;
