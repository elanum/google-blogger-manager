import React, {Component} from "react";
import {gapi} from "gapi-script";
import M from "materialize-css/dist/js/materialize.min.js";

const AuthContext = React.createContext();

class AuthProvider extends Component {
    state = {isSignedIn: null}

    constructor(props) {
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentDidMount() {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                client_id: '835840484437-f27qtek3epp6n65s8gu41gv6i95n44l5.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/blogger'
            }).then(() => {
                this.auth = gapi.auth2.getAuthInstance();
                this.handleAuthChange();
                this.auth.isSignedIn.listen(this.handleAuthChange);
            }).catch(console.error)
        })
    };

    handleAuthChange = () => {
        this.setState({isSignedIn: this.auth.isSignedIn.get()});
    };

    handleSignIn() {
        this.auth.signIn().then(() =>
            M.toast({html: 'Logged in.'})
        );
    };

    handleSignOut() {
        this.auth.signOut().then(() =>
            M.toast({html: 'Logged out.'})
        )
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isSignedIn: this.state.isSignedIn,
                    google: this.auth,
                    login: this.handleSignIn,
                    logout: this.handleSignOut
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer;
export {AuthProvider, AuthConsumer};