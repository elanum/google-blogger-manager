import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {AuthProvider} from "./utils/GoogleAuth";

import * as serviceWorker from './serviceWorker';

import ProtectedRoute from "./utils/ProtectedRoute";
import Sidenav from "./components/Sidenav";
import Blogs from "./components/Blogs";
import Welcome from "./components/Welcome";

import './styles.scss';


const App = () => (
    <div>
        <Router>
            <AuthProvider>
                <header>
                    <Sidenav/>
                </header>
                <main>
                    <Switch>
                        <ProtectedRoute exact path="/blogs" component={Blogs} variable={"Test"}/>
                        <Route exact path="/" component={Welcome}/>
                        <Route component={() => "404 NOT FOUND"}/>
                    </Switch>
                </main>
            </AuthProvider>
        </Router>
    </div>
)


ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.unregister();
