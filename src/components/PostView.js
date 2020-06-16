import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, ProgressBar, Row} from "react-materialize";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import {sendToast, formatDate, addTargetBlank, sortArray} from "../helper";

/**
 * Component to show the selected post
 *
 */

const PostView = () => {
    const {state} = useLocation();
    const {blogId, postId} = useParams();

    const [error, setError] = useState(null);
    const [post, setPost] = useState({isLoading: true});
    const [comments, setComments] = useState({isLoading: true});
    const [postDeleted, setPostDeleted] = useState(false);
    const [triggerCommentDeleted, setTriggerCommentDeleted] = useState(false);

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
                if (result) {
                    result.sort((a, b) => sortArray('date', b.published, a.published))
                    const groupedComments = [];
                    result.map(c => {
                        c['replies'] = [];
                        if (c.inReplyTo) {
                            let index = groupedComments.findIndex(e => e.id === c.inReplyTo.id);
                            groupedComments[index]['replies'].push(c)
                        } else {
                            groupedComments.push(c);
                        }
                        return true;
                    })
                    setComments(groupedComments)
                } else
                    setComments({isLoading: false})
            })
            .catch((err) => {
                setError(err);
            })
    }

    const deleteComment = (bid, pid, cid) => {
        Requests.deleteComment(bid, pid, cid)
            .then(() => {
                setTriggerCommentDeleted(!triggerCommentDeleted);
            })
            .then(() => {
                sendToast('Comment Deleted!')
            })
            .catch(err => {
                setError(err);
            })
    }

    const deletePost = (bid, pid) => {
        Requests.deletePost(bid, pid)
            .then(() => {
                setPostDeleted(true);
            })
            .catch((err) => {
                setError(err);
            })
    }

    useEffect(() => {
        setPost({isLoading: true});
        setComments({isLoading: true});
        getPost(blogId, postId);
        if (state.success) {
            sendToast(state.success);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId, postId, triggerCommentDeleted]);

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        postDeleted ?
            <Redirect to={{
                pathname: `/blogs/${blogId}`,
                state: {
                    success: 'Post deleted!'
                }
            }}/> :
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
                                {formatDate(post.published)}
                            </p>
                            <p className="valign-wrapper">
                                <Icon>edit</Icon>
                                {formatDate(post.updated)}
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
                                        post: {...post},
                                        blog: {
                                            labels: state.blog.labels
                                        }
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

                            <Col s={12}>
                                <CardPanel>
                                    <div dangerouslySetInnerHTML={{__html: addTargetBlank(post.content)}}/>
                                </CardPanel>
                            </Col>

                            <div>
                                {comments.length && (
                                    <div>
                                        <h4>Comments</h4>
                                        {comments.map(c => (
                                            <Row key={c.id}>
                                                <Col s={12}>
                                                    <CardPanel>
                                                        <Row>
                                                            <Col s={12} offset={!c.replies.length ? 's1' : ''}>
                                                                {c.content}
                                                                <a className="pointer" onClick={() => {
                                                                    deleteComment(c.blog.id, c.post.id, c.id)
                                                                }}>
                                                                    <Icon>delete</Icon>
                                                                </a>
                                                            </Col>
                                                        </Row>
                                                        <>
                                                            {c.replies.length > 0 &&
                                                            c.replies.map(r => (
                                                                <div key={r.id}>
                                                                    <Row>
                                                                        <div className="divider"/>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col s={12} offset={!r.replies.length ? 's1' : ''}>
                                                                            {r.content}
                                                                            <a className="pointer" onClick={() => {
                                                                                deleteComment(r.blog.id, r.post.id, r.id)
                                                                            }}>
                                                                                <Icon>delete</Icon>
                                                                            </a>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}
                                                        </>
                                                    </CardPanel>
                                                </Col>
                                            </Row>
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