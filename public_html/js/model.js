/* 
 * @licence CC BY-SA 4.0
 * @author Paul Kluge
 */

"use strict";
const model = (function () {

    // private Variablen von Model
    var items = new Map();
    let loggedIn = false;
    let pathGetBlogs = 'blogger/v3/users/self/blogs';
    let pathBlogs = 'blogger/v3/blogs';

    // Öffentliche Schnittstelle von Model
    return {

        // Setter für loggedIn.
        setLoggedIn(b) {
            loggedIn = b;
        },
        // Getter für loggedIn
        isLoggedIn() {
            return loggedIn;
        },
        // Liefert den angemeldeten Nutzer mit allen Infos
        getSelf(callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': 'blogger/v3/users/self'
            });
            // Execute the API request.
            request.execute(callback);
        },
        // Liefert alle Blogs des angemeldeten Nutzers
        getAllBlogs(callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathGetBlogs
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result.items);
            });
        },
        getAllBlogsSimple() {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathGetBlogs
            });
            return response.data;
        },
        // Liefert den Blog mit der Blog-Id bid
        getBlog(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },
        // Liefert die Daten der Posts des Blogs mit der Blog-Id bid
        getBlogPosts(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + "/posts"
            });
            // Execute the API request.
            request.execute((result) => {
                // Hier wird auf die Items in der Post-Liste zugegriffen.
                callback(result.items);
            });
        },
        // Liefert den Blog mit der Blog-Id bid
        getBlogFromPost(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },
        // Liefert einen Post mit der Blog-Id bid und der pid
        getPost(bid, pid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + "/posts/" + pid,
                'params': {'fetchImages': false, 'fetchBody': true}
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },
        // Liefert die Kommentare mit der Blog-Id bid und der pid
        getAllComments(bid, pid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + "/posts/" + pid + "/comments"
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result.items);
            });
        },
        // Original getBlogPosts
        getBlogPostsAll(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + "/posts"
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },
        getAll(callback) {
            callback(items.values());
        },
        getData(id, callback) {
            let data = items.get(id);
            callback(data);
        },
        updatePost(bid, pid, content, text) {
            console.log("Neuer Name: " + content);
            var request = gapi.client.request({
                'method': 'PATCH',
                'path': pathBlogs + "/" + bid + "/posts/" + pid,
                'headers': {
                    'content-Type': 'application/json'
                },
                'body': {"title": `${content}`, "content": `${text}`}
            });
            // Execute the API request.
            request.execute();
            console.log("ausgeführt");
        },
        createPost(bid, content, text) {

            var request = gapi.client.request({
                'method': 'POST',
                'path': pathBlogs + "/" + bid + "/posts",
                'headers': {
                    'content-Type': 'application/json'
                },
                'body': {"title": `${content}`, "content": `${text}`}
            });
            // Execute the API request.
            request.execute();
            console.log("ausgeführt");
        },
        deletePost(bid, pid) {
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': pathBlogs + "/" + bid + "/posts/" + pid
            });
            // Execute the API request.
            request.execute();
            console.log("gelöscht");
        },

        deleteComment(bid, pid, cid) {
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': pathBlogs + "/" + bid + "/posts/" + pid + "/comments/" + cid
            });
            // Execute the API request.
            request.execute();
            console.log("gelöscht");
        }

    };
})();
