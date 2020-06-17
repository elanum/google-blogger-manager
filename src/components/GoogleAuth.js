import React, {Component} from "react";
import {gapi} from "gapi-script";
import M from "materialize-css/dist/js/materialize.min.js";

const AuthContext = React.createContext();

class AuthProvider extends Component {
    state = {
        isSignedIn: null,
        user: null
    }

    constructor(props) {
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentDidMount() {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                client_id: '835840484437-f27qtek3epp6n65s8gu41gv6i95n44l5.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/blogger',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest']
            }).then(() => {
                this.auth = gapi.auth2.getAuthInstance();
                this.handleAuthChange();
                this.auth.isSignedIn.listen(this.handleAuthChange);
            }, function (e){
                console.error(e);
            })
        })
    };

    handleAuthChange = () => {
        let signInStatus = this.auth.isSignedIn.get();
        if (signInStatus) {
            let basicProfile = this.auth.currentUser.get().getBasicProfile();
            this.setState({
                user: {
                    name: basicProfile.getName(),
                    email: basicProfile.getEmail(),
                    image: basicProfile.getImageUrl()
                }
            })
        }
        this.setState({isSignedIn: signInStatus});
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
                    user: this.state.user,
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
export {AuthProvider, AuthConsumer, AuthContext};