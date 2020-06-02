import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import {gapi} from "gapi-script";

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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
            console.log(`${this.state.user.name} signed in`);
            this.setState({btnText: "Logout"})
        } else {
            console.log(`${this.state.user.name} signed out`);
            this.setState({btnText: "Login"})
            this.setState({user: null})
        }
    }

    updateSignInStatus() {
        this.setSignInStatus();
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light mb-4">
                        <div className="container">
                            <Link to={"/"} className="navbar-brand">
                                AWFT
                            </Link>
                            <button className="btn btn-outline-dark" id="googleLogin" onClick={() => {
                                this.handleAuthClick()
                            }}>
                                {this.state.btnText}
                            </button>
                        </div>
                    </nav>

                    <div className="container">
                        <Switch>
                            <Route path="/" exact
                                   render={() => <Blogs name={this.state.user ? this.state.user.name : null}/>}/>
                            {!this.state.user && <Redirect to={"/"} />}
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
