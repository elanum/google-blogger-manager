import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import {Col, Card, Icon, Chip, ProgressBar, Modal, Button, Row} from "react-materialize";
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
                                        labels: blogLabels
                                    }
                                }
                            }} className="btn-floating btn-large waves-effect">
                                <Icon>add</Icon>
                            </Link>
                        </div>
                        <Row>
                            <Col s={12}>
                                <h4>{blog.name}</h4>
                                <blockquote>{blog.description}</blockquote>
                                <div className="divider"/>
                            </Col>
                            <Col m={6} s={12}>
                                <p>{blog.url}</p>
                            </Col>
                            <Col m={6} s={12}>
                                <p>{blog.posts.totalItems}</p>
                            </Col>
                            <Col m={6} s={12}>
                                <p>{formatDate(blog.published)}</p>
                            </Col>
                            <Col m={6} s={12}>
                                <p>{formatDate(blog.updated)}</p>
                            </Col>
                        </Row>
                        <div>
                            {posts &&
                            posts.map((post) => (
                                <Col key={post.id}>
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
                                                    <Button flat modal="close" node="button" className="red white-text"
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
                                                <p>Do you really want to delete "<code>{post.title}</code>"? This cannot
                                                    be undone!</p>
                                            </Modal>
                                        ]}
                                        title={post.title}
                                    >
                                        <p className="valign-wrapper">
                                            <Icon>person</Icon>&nbsp;
                                            <a href={post.author.url} rel="noopener noreferrer"
                                               target="_blank">{post.author.displayName}</a>
                                        </p>
                                        <p className="valign-wrapper">
                                            <Icon>public</Icon>&nbsp;{formatDate(post.published)}
                                        </p>
                                        <p className="valign-wrapper">
                                            <Icon>edit</Icon>&nbsp;{formatDate(post.updated)}
                                        </p>
                                        <p className="valign-wrapper">
                                            <Icon>comment</Icon>&nbsp;{post.replies.totalItems}
                                        </p>
                                        <div>
                                            {post.labels && (
                                                post.labels.map((label) => (
                                                    <Chip key={label}>{label}</Chip>
                                                ))
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
}

export default BlogView;