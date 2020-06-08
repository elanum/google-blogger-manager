import React, {useEffect, useState} from "react";
import Requests from "../utils/Requests";


const Blogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        retrieveBlogs();
    }, []);

    const retrieveBlogs = () => {
        Requests.getAllBlogs(results => {
            setBlogs(results);
        })
    }

    return (
        <div className="container">
            <h1>Blogs</h1>
            <ul className="collection">
                {blogs &&
                blogs.map((blog) => (
                    <li className="collection-item" key={blog.id}>{blog.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Blogs;