import React, {Component} from "react";
import {AuthConsumer} from "./GoogleAuth";
import M from 'materialize-css'
import SidenavUser from "./SidenavUser";

/**
 * Sidenav Component
 */
class Sidenav extends Component {
    componentDidMount() {
        M.Sidenav.init(this.sidenav, {
            edge: 'left',
            inDuration: 250
        });
    }

    render() {
        return (
            <AuthConsumer>
                {({isSignedIn, login}) => (
                    <div>
                        <div className="navbar-fixed">
                            <nav className="hide-on-large-only">
                                <div className="nav-wrapper">
                                    {// eslint-disable-next-line
                                    }<a data-target="nav-mobile"
                                        className="top-nav sidenav-trigger full"><i
                                    className="material-icons">menu</i></a>
                                </div>
                            </nav>
                        </div>
                        <ul id="nav-mobile" className="sidenav sidenav-fixed" ref={(sidenav) => {
                            this.sidenav = sidenav
                        }}>

                            {!isSignedIn ? (
                                <div>
                                    <li>
                                        <div className="user-view">
                                            <span className="white-text">AWFT</span>
                                        </div>
                                    </li>
                                    <li>
                                        {// eslint-disable-next-line
                                        }<a className="sidenav-close pointer" onClick={login}>
                                            <i className="material-icons">input</i>Login
                                        </a>
                                    </li>
                                </div>
                            ) : (
                                <SidenavUser/>
                            )}
                        </ul>
                    </div>
                )}
            </AuthConsumer>
        );
    }
}

export default Sidenav;