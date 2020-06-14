import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, ProgressBar, Row} from "react-materialize";
import dateFormat from "dateformat";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import M from 'materialize-css';

/**
 * Component to show the selected post
 *
 */

const PostView = () => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";
    const {state} = useLocation();
    const {blogId, postId} = useParams();

    const [error, setError] = useState(null);
    const [post, setPost] = useState({isLoading: true});
    const [comments, setComments] = useState({isLoading: true});
    const [postDeleted, setPostDeleted] = useState(false);
    const [commentDeleted, setCommentDeleted] = useState(false);

    const getPost = (bid, pid) => {
        Requests.getPost(bid, pid)
            .then(result => {
                setPost(result);
            })
            .then(() => {
                getComments(bid, pid)
            })
            .catch((err) => {
                setError(err);
            })
    }

    const getComments = (bid, pid) => {
        Requests.getComments(bid, pid)
            .then(result => {
                if (result)
                    setComments(result)
                else
                    setComments({isLoading: false})
            })
            .catch(e => {
                setError(e);
            })
    }

    const deleteComment = (bid, pid, cid) => {
        Requests.deleteComment(bid, pid, cid)
            .then(() => {
                setCommentDeleted(!commentDeleted);
            })
            .catch(err => {
                setError(err);
            })
    }

    const deletePost = (bid, pid) => {
        Requests.deletePost(bid, pid).then(() => {
            setPostDeleted(true);
        })
    }

    const addTargetBlank = content => {
        content = content.replace("<a ", '<a target="_blank"');
        return content;
    }

    useEffect(() => {
        setPost({isLoading: true});
        setComments({isLoading: true});
        getPost(blogId, postId);
        if (state.success) {
            M.toast({
                html: state.success
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId, postId])

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        postDeleted ?
            <Redirect to={`blogs/${blogId}`}/> :
            (
                <div className="container">
                    {post.isLoading || comments.isLoading ? (
                        <div className="absolute-center">
                            <ProgressBar/>
                        </div>
                    ) : (
                        <div>
                            <h4>{post.title}</h4>
                            <p className="valign-wrapper">
                                <Icon>person</Icon>
                                <a href={post.author.url} rel="noopener noreferrer"
                                   target="_blank">{post.author.displayName}</a>
                            </p>
                            <p className="valign-wrapper">
                                <Icon>public</Icon>
                                {dateFormat(post.published, dateMask)}
                            </p>
                            <p className="valign-wrapper">
                                <Icon>edit</Icon>
                                {dateFormat(post.updated, dateMask)}
                            </p>
                            <p className="valign-wrapper">
                                <Icon>comment</Icon>
                                {post.replies.totalItems}
                            </p>
                            <div>
                                {post.labels && (
                                    post.labels.map(l => (
                                        <Chip key={l}>{l}</Chip>
                                    ))
                                )}
                            </div>
                            <Link
                                to={{
                                    pathname: `/blogs/${post.blog.id}/posts/${post.id}/edit`,
                                    state: {
                                        post: post,
                                        labels: state.labels
                                    }
                                }}
                                className="btn"
                            >
                                Edit<Icon right>edit</Icon>
                            </Link>
                            <Modal
                                actions={[
                                    <Button flat modal="close" node="button" className="red white-text"
                                            onClick={() => {
                                                deletePost(post.blog.id, post.id)
                                            }}>Delete</Button>,
                                    <Button flat modal="close" node="button">Cancel</Button>
                                ]}
                                header="Confirm Deletion"
                                trigger={
                                    <Button node="button">Delete<Icon right>delete</Icon></Button>
                                }
                            >
                                <p>Do you really want to delete "<code>{post.title}</code>"? This cannot be undone!
                                </p>
                            </Modal>
                            <Row>
                                <Col s={12}>
                                    <CardPanel>
                                        <div dangerouslySetInnerHTML={{__html: addTargetBlank(post.content)}}/>
                                    </CardPanel>
                                </Col>
                            </Row>
                            <div>
                                {comments.length && (
                                    <div>
                                        {comments.map(c => (
                                            <div className="z-depth-1" key={c.id}>
                                                {c.content}
                                                <Button onClick={() => {
                                                    deleteComment(post.blog.id, post.id, c.id);
                                                }}>
                                                    <Icon>delete</Icon>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    }
                </div>
            )
}

export default PostView;