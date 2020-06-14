import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, ProgressBar, Row} from "react-materialize";
import dateFormat from "dateformat";
import {Link, Redirect} from "react-router-dom";
import M from 'materialize-css';

const PostView = props => {
    //console.log("Post", props.location.state.post);
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [postDeleted, setPostDeleted] = useState(false);
    const [commentDeleted, setCommentDeleted] = useState(false);
    //const [post, setPost] = useState({loading: true});
    const [post] = useState(props.location.state.post)
    const [title] = useState(document.title);
    const [comments, setComments] = useState({loading: true});

    const getComments = (bid, pid) => {

        Requests.getComments(bid, pid, (result) => {
            console.log(result);
            if (result)
                setComments(result);
            else
                setComments({loading: false});
        })
    }

    const deleteComment = (bid, pid, cid) => {
        /*Requests.deleteComment(bid, pid, cid, () => {
            setCommentDeleted(true);
        })*/
        console.log({
            bid: bid,
            pid: pid,
            cid: cid,
        });
        setCommentDeleted(true);
    }

    useEffect(() => {
        getComments(props.match.params.blogId, props.match.params.postId);
    }, [props.match.params.blogId, props.match.params.postId])

    /*    const getPost = (bid, pid) => {
            setPost({loading: true});
            Requests.getPost(bid, pid, (result) => {
                setPost(result);
                setTitle(result.title);
            })
        }*/

    const deletePost = (bid, pid) => {
        Requests.deletePost(bid, pid, () => {
            setPostDeleted(true);
        })
    }

    useEffect(() => {
        if (props.location.state.success)
            M.toast({
                html: props.location.state.success
            })
    }, [props.location.state.success])

    /*    useEffect(() => {
            getPost(props.match.params.blogId, props.match.params.postId);
        }, [props.match.params.blogId, props.match.params.postId])*/

    useEffect(() => {
        document.title = post.title;
    }, [title, post.title])


    const addTargetBlank = content => {
        content = content.replace("<a ", '<a target="_blank"');
        return content;
    }

    return (
        <div className="container">
            {postDeleted ? (
                <Redirect to={{
                    pathname: `/blogs/${post.blog.id}`,
                    state: {
                        blog: post.blog,
                        success: 'Post deleted!'
                    }
                }}/>
            ) : comments.loading ? (
                <div className="absolute-center">
                    <ProgressBar/>
                </div>
            ) : (
                <div>
                    <p>Some Content</p>
                </div>
            )
            }
        </div>
    )
}

export default PostView;