import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, ProgressBar, Row} from "react-materialize";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import {sendToast, formatDate, addTargetBlank, sortArray} from "../helper";

/**
 * Component to show the selected post
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
                document.title = result.title;
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
                                    <div className="fixed-action-btn">
                                        { // eslint-disable-next-line
                                        }<a className="btn-floating btn-large red"
                                            style={{right: '79px'}}><Icon>delete</Icon></a>
                                    </div>
                                }
                            >
                                <p>Do you really want to delete "<code>{post.title}</code>"? This cannot be undone!
                                </p>
                            </Modal>
                            <div className="fixed-action-btn">
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
                                    className="btn-floating btn-large"
                                >
                                    <Icon>edit</Icon>
                                </Link>
                            </div>
                            <Row>
                                <Col s={12}>
                                    <CardPanel className="no-padding center">
                                        <div className="info-header">
                                            <h5>
                                                <a href={post.url} target="_blank"
                                                   rel="noopener noreferrer">{post.title}</a>
                                            </h5>
                                        </div>
                                        <div className="info">
                                            <Row>
                                                <Col m={3} s={12}>
                                                    <Icon className="inline">person</Icon>
                                                    &nbsp;<a href={post.author.url} rel="noopener noreferrer"
                                                             target="_blank">{post.author.displayName}</a>
                                                </Col>
                                                <Col m={3} s={12}>
                                                    <Icon className="inline">public</Icon>
                                                    &nbsp;{formatDate(post.published)}
                                                </Col>
                                                <Col m={3} s={12}>
                                                    <Icon className="inline">edit</Icon>
                                                    &nbsp;{formatDate(post.updated)}
                                                </Col>
                                                <Col m={3} s={12}>
                                                    <Icon className="inline">comment</Icon>
                                                    &nbsp;{post.replies.totalItems}
                                                </Col>
                                            </Row>
                                            {post.labels && (
                                                <Row>
                                                    <br/>
                                                    <Col s={12}>
                                                        {post.labels.map(l => (
                                                            <Chip key={l}>{l}</Chip>
                                                        ))}
                                                    </Col>
                                                </Row>
                                            )}
                                        </div>
                                    </CardPanel>
                                </Col>
                            </Row>
                            <Row>
                                <Col s={12}>
                                    <h5>Content</h5>
                                    <CardPanel>
                                        <div dangerouslySetInnerHTML={{__html: addTargetBlank(post.content)}}/>
                                    </CardPanel>
                                </Col>
                            </Row>

                            <div>
                                {comments.length && (
                                    <div>
                                        <Row>
                                            <Col s={12}>
                                                <h5>Comments</h5>
                                            </Col>
                                            {comments.map(c => (
                                                <Col key={c.id} s={12}>
                                                    <CardPanel>
                                                        <Row>
                                                            <Col s={12}>
                                                                <div className="card-content">
                                                                    <Row>
                                                                        <Col s={11}>
                                                                            <div className="valign-wrapper">
                                                                                <img src={c.author.image.url}
                                                                                     className="circle responsive-img"
                                                                                     alt={c.author.displayName}/>
                                                                                &nbsp;<a href={post.author.url}
                                                                                         rel="noopener noreferrer"
                                                                                         target="_blank">{c.author.displayName}</a>
                                                                                &nbsp;<Icon
                                                                                className="inline">public</Icon>
                                                                                &nbsp;{formatDate(c.published)}
                                                                            </div>
                                                                        </Col>
                                                                        <Col s={1} className="right-align">
                                                                            <Modal
                                                                                actions={[
                                                                                    <Button flat modal="close"
                                                                                            node="button"
                                                                                            className="red white-text"
                                                                                            onClick={() => {
                                                                                                deleteComment(c.blog.id, c.post.id, c.id)
                                                                                            }}>Delete</Button>,
                                                                                    <Button flat modal="close"
                                                                                            node="button">Cancel</Button>
                                                                                ]}
                                                                                header="Confirm Deletion"
                                                                                trigger={
                                                                                    <Button
                                                                                        small
                                                                                        className="red"
                                                                                        node="button"><Icon>delete</Icon></Button>
                                                                                }
                                                                            >
                                                                                <p>Do you really want to delete the
                                                                                    comment?</p>
                                                                                <p><code>{c.content}</code></p>
                                                                                <p>And all answers? This cannot be undone!
                                                                                </p>
                                                                            </Modal>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col s={12}>
                                                                            {c.content}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <>
                                                            {c.replies.length > 0 &&
                                                            c.replies.map(r => (
                                                                <div key={r.id} className="card-content">
                                                                    <Row>
                                                                        <div className="divider"/>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col s={10} offset="s1">
                                                                            <div className="valign-wrapper">
                                                                                <img src={r.author.image.url}
                                                                                     className="circle responsive-img"
                                                                                     alt={r.author.displayName}/>
                                                                                &nbsp;<a href={post.author.url}
                                                                                         rel="noopener noreferrer"
                                                                                         target="_blank">{r.author.displayName}</a>
                                                                                &nbsp;<Icon
                                                                                className="inline">public</Icon>
                                                                                &nbsp;{formatDate(r.published)}
                                                                            </div>
                                                                        </Col>
                                                                        <Col s={1} className="right-align">
                                                                            <Modal
                                                                                actions={[
                                                                                    <Button flat modal="close"
                                                                                            node="button"
                                                                                            className="red white-text"
                                                                                            onClick={() => {
                                                                                                deleteComment(r.blog.id, r.post.id, r.id)
                                                                                            }}>Delete</Button>,
                                                                                    <Button flat modal="close"
                                                                                            node="button">Cancel</Button>
                                                                                ]}
                                                                                header="Confirm Deletion"
                                                                                trigger={
                                                                                    <Button
                                                                                        small
                                                                                        className="red"
                                                                                        node="button"><Icon>delete</Icon></Button>
                                                                                }
                                                                            >
                                                                                <p>Do you really want to delete the
                                                                                    comment?</p>
                                                                                <p><code>{r.content}</code></p>
                                                                                <p>This cannot be undone!
                                                                                </p>
                                                                            </Modal>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col s={10} offset="s1">
                                                                            {r.content}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}
                                                        </>
                                                    </CardPanel>
                                                </Col>

                                            ))}
                                        </Row>
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