import React, {Component} from "react";
import {Link} from "react-router-dom";

/**
 * Landing Page if not logged in
 *
 */
class Welcome extends Component {
    componentDidMount() {
        document.title = "AWFT";
    }

    render() {
        return (
            <div className="container">
                <div className="section">
                    <div className="center">
                        <h1>Welcome to AWFT</h1>
                        <h4 className="light">An App to mange your Google Blogger Blogs and Posts</h4>
                        <div className="divider"/>
                        <p>Copyright &copy; {new Date().getFullYear()} <a href="https://gitlab.beuth-hochschule.de/s66039/awft" target="_blank" rel="noopener noreferrer">LavaScript</a></p>
                        <Link to={'/error'}>Error</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;