import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {Icon} from "react-materialize";

const ErrorView = () => {
    const {state} = useLocation();

    const [error, setError] = useState({
        status: 404,
        message: 'Page not found'
    })

    useEffect(() => {
        setError(state)
    }, [state])

    return (
        <div className="container">
            <h1 className="valign-wrapper"><Icon large>error</Icon> Error {error.code}</h1>
            <p>{error.message}</p>
        </div>
    )
}

export default ErrorView;