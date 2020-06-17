import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {Icon} from "react-materialize";

const ErrorView = () => {
    const {state} = useLocation();

    const [error, setError] = useState({
        code: 404,
        message: 'Page not found'
    })

    useEffect(() => {
        if (state)
            setError(state)
    }, [state])

    return (
        <div className="container center">
            <h1><Icon large>error</Icon><br/>Error {error.code}</h1>
            <p className="flow-text">{error.message}</p>
        </div>
    )
}

export default ErrorView;