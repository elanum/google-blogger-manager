import {gapi} from "gapi-script";

const getAllBlogs = () => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.blogs.listByUser({
            "userId": "self"
        }).then(response => {
            resolve(response.result.items);
        }, function (err) {
            reject(err.result.error);
            console.error("getAllBlogs", err.result.error);
        })
    })
}

const getBlog = id => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.blogs.get({
            "blogId": id
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("getBlog", err.result.error);
        })
    })
}

const getBlogPosts = id => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.posts.list({
            "blogId": id
        }).then(response => {
            resolve(response.result.items);
        }, function (err) {
            reject(err.result.error);
            console.error("getBlogPosts", err.result.error);
        })
    })
}

const getPost = (bid, pid) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.posts.get({
            "blogId": bid,
            "postId": pid
        }).then(response => {
            resolve(response.result)
        }, function (err) {
            reject(err.result.error);
            console.error("getPost", err.result.error);
        })
    })
}

const getComments = (bid, pid) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.comments.list({
            "blogId": bid,
            "postId": pid,
        }).then(response => {
            resolve(response.result.items);
        }, function (err) {
            reject(err.result.error);
            console.error("getComments", err.result.error);
        })
    })
}

const updatePost = (bid, pid, title, content, labels) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.posts.update({
            "blogId": bid,
            "postId": pid,
            "resource": {
                "title": title,
                "content": content,
                "labels": labels
            }
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("updatePost", err.result.error);
        })
    })
}

const deletePost = (bid, pid) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.posts.delete({
            "blogId": bid,
            "postId": pid
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("deletePost", err.result.error);
        })
    })
}

const deleteComment = (bid, pid, cid) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.comments.delete({
            "blogId": bid,
            "postId": pid,
            "commentId": cid
        }).then(response => {
            console.log(response);
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("deleteComment", err.result.error);
        })
    })
}

const createPost = (id, title, content, labels) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.posts.insert({
            "blogId": id,
            "resource": {
                "title": title,
                "content": content,
                "labels": labels
            }
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("createPost", err.result.error);
        })
    })
}

export default {
    getAllBlogs,
    getBlog,
    getBlogPosts,
    getPost,
    getComments,
    updatePost,
    deletePost,
    deleteComment,
    createPost
}