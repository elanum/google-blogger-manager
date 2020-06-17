import {gapi} from "gapi-script";

/**
 * GET Request on '/blogs'
 *
 * @returns {Promise<Array>}
 */
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

/**
 * GET Request on 'blogs/:id'
 *
 * @param {number} [id] blogId
 *
 * @returns {Promise<Object>}
 */
const getBlog = (id) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.blogs.get({
            "blogId": id
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            console.error("getBlog", err.result.error);
            reject(err.result.error);
        })
    })
}

/**
 * GET Request on '/blogs/:id/posts'
 *
 * @param {number} [id] blogId
 *
 * @returns {Promise<Array>}
 */
const getBlogPosts = (id) => {
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

/**
 * GET Request on '/blogs/:bid/posts/:pid'
 *
 * @param {number} [bid] blogId
 * @param {number} [pid] postId
 *
 * @returns {Promise<Object>}
 */
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

/**
 * GET Request on '/blogs/:bid/posts/:pid/comments'
 *
 * @param {number} [bid] blogId
 * @param {number} [pid] postId
 *
 * @returns {Promise<Array>}
 */
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

/**
 * UPDATE Request on '/blogs/:bid/posts/:pid'
 *
 * @param {number}        [bid]     blogId
 * @param {number}        [pid]     postId
 * @param {string}        [title]   post title
 * @param {string}        [content] content as HTML-String
 * @param {Array<string>} [labels]  labels for the post as string-Array
 *
 * @returns {Promise<boolean>}
 */
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

/**
 * DELETE Request on '/blogs/:bid/posts/:pid'
 *
 * @param {number} [bid] blogId
 * @param {number} [pid] postId
 *
 * @returns {Promise<boolean>}
 */
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

/**
 * DELETE Request on '/blogs/:pid/posts/:pid/comments/:cid'
 *
 * @param {number} [bid] blogId
 * @param {number} [pid] postId
 * @param {number} [cid] commentId
 *
 * @returns {Promise<boolean>}
 */
const deleteComment = (bid, pid, cid) => {
    return new Promise((resolve, reject) => {
        gapi.client.blogger.comments.delete({
            "blogId": bid,
            "postId": pid,
            "commentId": cid
        }).then(response => {
            resolve(response.result);
        }, function (err) {
            reject(err.result.error);
            console.error("deleteComment", err.result.error);
        })
    })
}

/**
 * POST Request on '/blogs/:id/posts'
 *
 * @param {number}        [id]      blogId
 * @param {string}        [title]   post title
 * @param {string}        [content] content as HTML-String
 * @param {Array<string>} [labels]  labels for the post as string-Array
 *
 * @returns {Promise<Object>}
 */
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