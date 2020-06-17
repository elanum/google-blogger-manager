import React from "react";
import {Route, Redirect} from 'react-router-dom';
import {AuthConsumer} from "./GoogleAuth";

/**
 * Modified <Route> to create the Route only if the user is signed in
 *
 * @param {Component} [Component] Component to render if signed in
 * @param {*}         [rest]      any other variables passed to <ProtectedRoute>
 */
const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <AuthConsumer>
            {({isSignedIn}) => (
                <Route
                    render={props =>
                        isSignedIn ? <Component {...props} /> : <Redirect to={{
                            pathname: "/",
                            state: {from: props.location}
                        }}/>
                    }
                    {...rest}
                />
            )}
        </AuthConsumer>
    )
}

export default ProtectedRoute;