import React, {Component} from "react";
import {AuthConsumer} from "./GoogleAuth";
import M from 'materialize-css'
import UserCard from "./UserCard";

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
                        <nav className="hide-on-large-only">
                            <div className="nav-wrapper">
                                {
                                    // eslint-disable-next-line
                                }<a data-target="nav-mobile"
                                    className="top-nav sidenav-trigger full"><i
                                className="material-icons">menu</i></a>
                            </div>
                        </nav>
                        <ul id="nav-mobile" className="sidenav sidenav-fixed" ref={(sidenav) => {this.sidenav = sidenav}}>
                            {!isSignedIn ? (
                                // eslint-disable-next-line
                                <li><a className="waves-effect" onClick={login}><i className="material-icons">input</i>Login</a>
                                </li>
                            ) : (
                                <UserCard />
                            )}
                        </ul>
                    </div>
                )}
            </AuthConsumer>
        );
    }
}

export default Sidenav;