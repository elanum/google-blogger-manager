import React, {Component} from 'react';


class Blogs extends Component {
    render() {
        return (
            <div>
                {!this.props.name ?
                    <div>
                        <h1>Welcome to AWFT</h1>
                        <p>An App to manage your <i>Blogs and Posts</i> from <strong>Google
                            Blogger.</strong></p>
                        <div className="divider" />
                        <p>To see content, please login with your Google Account.</p>
                    </div>
                    :
                    <div className="jumbotron">
                        <h1>Welcome {this.props.name}</h1>
                        <p>This page is WIP</p>
                        <div className="divider" />
                        <p>Cool stuff will happen here</p>
                    </div>
                }
            </div>
        )
    }
}

export default Blogs;