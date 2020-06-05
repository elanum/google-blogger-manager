import React, {Component} from "react";

class Sidenav extends Component {

    componentDidMount() {
        let element = document.querySelector('.sidenav');
        M.Sidenav.init(element, {
            edge: 'left',
            inDuration: 250
        });
    }

    render() {
        return (
            <div>
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
            </div>
        );
    }
}

export default Sidenav;