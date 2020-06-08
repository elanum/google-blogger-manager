import React, {Component, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AuthConsumer} from "../utils/GoogleAuth";
import Requests from "../utils/Requests";

const UserCard = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        retrieveBlogs();
    }, []);

    const retrieveBlogs = () => {
        Requests.getAllBlogs(results => {
            setBlogs(results);
            console.log(results);
        })
    }

    return (
        <AuthConsumer>
            {({logout, user}) => (
                <div>
                    <li>
                        <div className="user-view deep-orange">
                            <img className="circle" src={user.image}
                                 alt="profile"/>
                            <span className="white-text name">{user.name}</span>
                            <span className="white-text email">{user.email}</span>
                        </div>
                    </li>
                    {blogs &&
                    blogs.map((blog) => (
                        <div key={blog.id}>
                            {// eslint-disable-next-line
                            }<li><a className="subheader">{blog.name}</a></li>
                            <li><Link to={"/blogs"}><i className="material-icons">library_books</i>Übersicht</Link></li>
                            <li><div className="divider" /></li>
                        </div>
                    ))}
                    <li>
                        {// eslint-disable-next-line
                        }<a className="waves-effect" onClick={logout}>
                        <i className="material-icons">input</i>Logout
                    </a>
                    </li>
                </div>
            )}
        </AuthConsumer>
    )
}

export default UserCard;