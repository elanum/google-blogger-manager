import React from "react";
import {Route, Redirect} from 'react-router-dom';
import {AuthConsumer} from "./GoogleAuth";

const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <AuthConsumer>
            {({isSignedIn}) => (
                <Route
                    render={props =>
                        isSignedIn ? <Component {...props} /> : <Redirect to="/"/>
                    }
                    {...rest}
                />
            )}
        </AuthConsumer>
    )
}

export default ProtectedRoute;