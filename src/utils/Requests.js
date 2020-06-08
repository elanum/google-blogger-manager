import {gapi} from "gapi-script";

const items = new Map();

// Logged in User Info
const getSelf = callback => {
    let request = gapi.client.request({
        "method": "GET",
        "path": "blogger/v3/users/self"
    });
    request.execute(callback);
}

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


export default {
    getSelf,
    getAllBlogs
}