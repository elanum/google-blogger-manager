import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import Development from './components/Development';
import DevelopmentAdd from './components/DevelopmentAdd';
import DevelopmentList from './components/DevelopmentList';

function App() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <a href="/" className="navbar-brand">
                            AWFT
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#mobile-navbar" aria-controls="mobile-navbar" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="mobile-navbar">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to={"/development"} className="nav-link">
                                        Development
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/add"} className="nav-link">
                                        Add
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/development"]} component={DevelopmentList}/>
                        <Route exact path="/add" component={DevelopmentAdd}/>
                        <Route path="/development/:id" component={Development}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
