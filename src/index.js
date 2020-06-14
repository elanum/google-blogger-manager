import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {AuthProvider} from "./components/GoogleAuth";
import * as serviceWorker from './serviceWorker';

import './styles.scss';

import ProtectedRoute from "./components/ProtectedRoute";
import Sidenav from "./components/Sidenav";
import Welcome from "./components/Welcome";
import BlogView from "./components/BlogView";
import PostView from "./components/PostView";
import PostEdit from "./components/PostEdit";
import PostCreate from "./components/PostCreate";
import ErrorView from "./components/ErrorView";

const App = () => (
    <div>
        <Router>
            <AuthProvider>
                <header>
                    <Sidenav/>
                </header>
                <main>
                    <Switch>
                        <ProtectedRoute exact path="/blogs/:blogId" component={BlogView} />
                        <ProtectedRoute exact path="/blogs/:blogId/posts/new" component={PostCreate} />
                        <ProtectedRoute exact path="/blogs/:blogId/posts/:postId" component={PostView} />
                        <ProtectedRoute exact path="/blogs/:blogId/posts/:postId/edit" component={PostEdit} />
                        <ProtectedRoute exact path="/error" component={ErrorView}/>
                        <Route exact path="/" component={Welcome}/>
                        <ProtectedRoute component={ErrorView} />
                    </Switch>
                </main>
            </AuthProvider>
        </Router>
    </div>
)


ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.unregister();
