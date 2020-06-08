import React, {Component} from "react";
import {AuthConsumer} from "../utils/GoogleAuth";
import M from 'materialize-css'
import {Link} from "react-router-dom";

class Sidenav extends Component {

    componentDidMount() {
        let sidenav = document.querySelector('.sidenav');
        M.Sidenav.init(sidenav, {
            edge: 'left',
            inDuration: 250
        });
    }

    render() {
        return (
            <AuthConsumer>
                {({isSignedIn, login, logout}) => (
                    <div>
                        <nav className="hide-on-large-only">
                            <div className="nav-wrapper">
                                {
                                    // eslint-disable-next-line
                                }<a data-target="nav-mobile"
                                    className="top-nav sidenav-trigger full"><i
                                className="material-icons">menu</i></a>
                            </div>
                        </nav>
                        <ul id="nav-mobile" className="sidenav sidenav-fixed">
                            {!isSignedIn ? (
                                // eslint-disable-next-line
                                <li><a className="waves-effect" onClick={login}><i className="material-icons">input</i>Login</a>
                                </li>
                            ) : (
                                <div>
                                    <li>
                                        <div className="user-view deep-orange">
                                            <img className="circle" src="https://placeimg.com/64/64/people"
                                                 alt="profile"/>
                                            <span className="white-text name">Max Mustermann</span>
                                            <span className="white-text email">max@mustermann.de</span>
                                        </div>
                                    </li>
                                    <li><Link to={"/blogs"}>Blogs</Link></li>
                                    <li><Link to={"/"}>Login Page</Link></li>
                                    <li>
                                        <div className="divider"/>
                                    </li>
                                    {// eslint-disable-next-line
                                    }
                                    <li>
                                        <a className="waves-effect" onClick={logout}>
                                            <i className="material-icons">input</i>Logout
                                        </a>
                                    </li>
                                </div>

                            )}
                        </ul>
                    </div>
                )}
            </AuthConsumer>
        );
    }
}

export default Sidenav;