import {gapi} from "gapi-script";

const items = new Map();

// All Blogs from logged in User
const getAllBlogs = callback => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/users/self/blogs"
    })
    request.execute((result) => {
        callback(result.items);
    });
}

// Get Blog by Blog-ID
const getBlog = (id, callback) => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/blogs/" + id
    });
    request.execute((result) => {
        callback(result);
    })
}

// Get Posts from Blog by Blog-ID
const getBlogPosts = (id, callback) => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/blogs/" + id + "/posts",
        "params": {
            "fetchBody": false,
            "fetchImages": true
        }
    });
    request.execute((result) => {
        callback(result.items);
    })
}

// Get Post from Blog by Blog-ID and Post-ID
const getPost = (bid, pid, callback) => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/blogs/" + bid + "/posts/" + pid,
        "params": {
            "fetchImages": true,
            "fetchBody": true
        }

    });
    request.execute((result) => {
        callback(result);
    })
}

// Get Comments of a Post from Blog by Blog-ID and Post-ID
const getComments = (bid, pid, callback) => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/blogs/" + bid + "/posts/" + pid + "/comments"
    });
    request.execute((result) => {
        callback(result.items);
    })
}

// Update Post
const updatePost = (bid, pid, title, content, callback) => {
    let request = gapi.client.request({
        "method": "PATCH",
        "path": "blogger/v3/blogs/" + bid + "/posts/" + pid,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "title": title,
            "content": content
        }
    });
    request.execute((result) => {
        callback(result);
    });
}

// Delete Post
const deletePost = (bid, pid, callback) => {
    let request = gapi.client.request({
        "method": "DELETE",
        "path": "blogger/v3/blogs/" + bid + "/posts/" + pid
    });
    request.execute((result) => {
        callback(result);
    })
}

export default {
    getAllBlogs,
    getBlog,
    getBlogPosts,
    getPost,
    getComments,
    updatePost
}