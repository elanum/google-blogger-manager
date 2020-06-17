import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import {Col, Card, Icon, Chip, ProgressBar, Modal, Button, Row, CardPanel} from "react-materialize";
import M from "materialize-css";
import {sendToast, formatDate, transformSetToArray, sortArray} from '../helper';

/**
 * Component to show all posts of the selected blog
 */
const BlogView = () => {
    const {state} = useLocation();
    const {blogId} = useParams();
    const [error, setError] = useState(null);
    const [blog, setBlog] = useState({isLoading: true})
    const [posts, setPosts] = useState({isLoading: true});
    const [blogLabels, setBlogLabels] = useState(new Set());
    const [triggerPostDeleted, setTriggerPostDeleted] = useState(false);

    const getBlog = (id) => {
        Requests.getBlog(id)
            .then(result => {
                setBlog(result);
                document.title = result.name;
            })
            .then(() => {
                getBlogPosts(id)
            })
            .catch((err) => {
                setError(err)
            })
    }

    const getBlogPosts = (id) => {
        Requests.getBlogPosts(id)
            .then(result => {
                if (result)
                    result.sort((a, b) => sortArray('date', a.published, b.published));
                setPosts(result);
                getLabels(result)
            })
            .catch(err => {
                setError(err)
            })
    }

    const getLabels = (posts) => {
        let set = new Set();
        if (posts && !posts.isLoading) {
            posts.map(post => {
                if (post.labels) {
                    post.labels.map(label => {
                        return set.add(label);
                    })
                }
                return true;
            })
        }
        setBlogLabels(transformSetToArray(set));
    }

    const deletePost = (bid, pid) => {
        Requests.deletePost(bid, pid)
            .then(() => {
                setTriggerPostDeleted(!triggerPostDeleted);
            })
            .then(() => {
                sendToast('Post Deleted!')
            })
            .catch((err) => {
                setError(err);
            })
    }

    useEffect(() => {
        setBlog({isLoading: true});
        setPosts({isLoading: true});
        getBlog(blogId)
        if (state.success) {
            M.toast({
                html: state.success
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId, triggerPostDeleted])

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        (
            <div className="container">
                {blog.isLoading || (posts && posts.isLoading) ? (
                    <div className="absolute-center">
                        <ProgressBar/>
                    </div>
                ) : (
                    <div>
                        <div className="fixed-action-btn">
                            <Link to={{
                                pathname: `${blogId}/posts/new`,
                                state: {
                                    blog: {
                                        name: blog.name,
                                        labels: blogLabels
                                    }
                                }
                            }} className="btn-floating btn-large">
                                <Icon>add</Icon>
                            </Link>
                        </div>
                        <Row>
                            <Col s={12}>
                                <CardPanel className="no-padding center">
                                    <div className="info-header">
                                        <h5>
                                            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.name}</a>
                                        </h5>
                                        <blockquote>{blog.description}</blockquote>
                                    </div>
                                    <div className="info">
                                        <Row>
                                            <Col m={4} s={12}>
                                                <Icon
                                                    className="inline">library_books</Icon><span>&nbsp;{blog.posts.totalItems} Posts</span>
                                            </Col>
                                            <Col m={4} s={12}>
                                                <Icon className="inline">public</Icon>&nbsp;{formatDate(blog.published)}
                                            </Col>
                                            <Col m={4} s={12}>
                                                <Icon className="inline">edit</Icon>&nbsp;{formatDate(blog.updated)}
                                            </Col>
                                        </Row>
                                    </div>
                                </CardPanel>
                            </Col>
                        </Row>
                        <div>
                            {posts &&
                            posts.map((post) => (
                                <Row key={post.id}>
                                    <Col s={12}>
                                        <Card
                                            actions={[
                                                <Link key={`${post.id}-view`} to={{
                                                    pathname: `${blogId}/posts/${post.id}`,
                                                    state: {
                                                        post: {...post},
                                                        blog: {
                                                            labels: blogLabels
                                                        }
                                                    }
                                                }}>
                                                    <Icon>pageview</Icon>
                                                </Link>,
                                                <Link key={`${post.id}-edit`} to={{
                                                    pathname: `${blogId}/posts/${post.id}/edit`,
                                                    state: {
                                                        post: {...post},
                                                        blog: {
                                                            labels: blogLabels
                                                        }
                                                    }
                                                }}>
                                                    <Icon>edit</Icon>
                                                </Link>,
                                                <Modal
                                                    key={`${post.id}-delete`}
                                                    actions={[
                                                        <Button flat modal="close" node="button"
                                                                className="red white-text"
                                                                onClick={() => {
                                                                    deletePost(post.blog.id, post.id)
                                                                }}>Delete</Button>,
                                                        <Button flat modal="close" node="button">Cancel</Button>
                                                    ]}
                                                    header="Confirm Deletion"
                                                    trigger={
                                                        // eslint-disable-next-line
                                                        <a className="pointer"><Icon>delete</Icon></a>
                                                    }
                                                >
                                                    <p>Do you really want to delete "<code>{post.title}</code>"? This
                                                        cannot
                                                        be undone!</p>
                                                </Modal>
                                            ]}
                                            title={post.title}

                                        >
                                            <Row>
                                                <Col s={12} m={6} l={3}>
                                                    <Icon className="inline">person</Icon>
                                                    &nbsp;<a href={post.author.url} rel="noopener noreferrer"
                                                             target="_blank">{post.author.displayName}</a>
                                                </Col>
                                                <Col s={12} m={6} l={3}>
                                                    <Icon
                                                        className="inline">public</Icon>&nbsp;{formatDate(post.published)}
                                                </Col>
                                                <Col s={12} m={6} l={3}>
                                                    <Icon className="inline">edit</Icon>&nbsp;{formatDate(post.updated)}
                                                </Col>
                                                <Col s={12} m={6} l={3}>
                                                    <Icon
                                                        className="inline">comment</Icon>&nbsp;{post.replies.totalItems}
                                                </Col>
                                            </Row>

                                            {post.labels && (
                                                <Row>
                                                    <Col s={12}>
                                                        {post.labels.map((label) => (
                                                            <Chip key={label}>{label}</Chip>

                                                        ))}
                                                    </Col>
                                                </Row>
                                            )}

                                        </Card>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
}

export default BlogView;