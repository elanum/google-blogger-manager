import React, {Component} from 'react';


class Blogs extends Component {
    render() {
        return (
            <div>
                {!this.props.name ?
                    <div className="jumbotron">
                        <h1 className="display-4">Welcome to AWFT</h1>
                        <p className="lead">An App to manage your <i>Blogs and Posts</i> from <strong>Google
                            Blogger.</strong></p>
                        <hr className="my-4"/>
                        <p>To see content, please login with your Google Account.</p>
                    </div>
                    :
                    <div className="jumbotron">
                        <h1 className="display-4">Welcome {this.props.name}</h1>
                        <p className="lead">This page is WIP</p>
                        <hr className="my-4"/>
                        <p>Cool stuff will happen here</p>
                    </div>
                }
            </div>
        )
    }
}

export default Blogs;