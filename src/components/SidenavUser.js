import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AuthConsumer} from "./GoogleAuth";
import Requests from "./Requests";

const SidenavUser = () => {
    const [blogs, setBlogs] = useState([]);

    const getAllBlogs = () => {
        Requests.getAllBlogs(results => {
            setBlogs(results);
        })
    }

    useEffect(() => {
        getAllBlogs();
    }, []);

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
                    <li><Link to={"/"}><i className="material-icons">home</i>Home</Link></li>
                    <li><div className="divider" /></li>
                    {// eslint-disable-next-line
                    }<li><a className="subheader">Blogs</a></li>
                    {blogs &&
                    blogs.map((blog) => (
                        // eslint-disable-next-line
                        <li key={blog.id}><Link to={`/blogs/${blog.id}`} className="sidenav-close">{blog.name}</Link></li>
                    ))}
                    <li><div className="divider" /></li>
                    <li>
                        {// eslint-disable-next-line
                        }<a className="waves-effect sidenav-close" onClick={logout}>
                        <i className="material-icons">input</i>Logout
                    </a>
                    </li>

                </div>
            )}
        </AuthConsumer>
    )
}

export default SidenavUser;
