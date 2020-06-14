import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link, Redirect, useLocation, useParams} from "react-router-dom";
import {Col, Card, Icon, Chip, ProgressBar} from "react-materialize";
import dateFormat from 'dateformat';
import M from "materialize-css";

/**
 * Component to show all posts of the selected blog
 *
 */

const BlogView = () => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";
    const {state} = useLocation();
    const {blogId} = useParams();

    const [error, setError] = useState(null);
    const [blog, setBlog] = useState({isLoading: true})
    const [posts, setPosts] = useState({isLoading: true});
    const [blogLabels, setBlogLabels] = useState(new Set());


    const getBlog = (id) => {
        Requests.getBlog(id)
            .then(result => {
                setBlog(result);
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
                setPosts(result);
                getLabels(result)
            })
            .catch(err => {
                setError(err)
            })
    }

    const getLabels = (posts) => {
        let newLabels = new Set();
        if (posts && !posts.isLoading) {
            posts.map(post => {
                if (post.labels) {
                    post.labels.map(label => {
                        return newLabels.add(label);
                    })
                }
                return true;
            })
        }
        setBlogLabels(newLabels);
    }

    const setToArray = (set) => {
        let array = Array.from(set);
        let transform = {};
        array.forEach(element => {
            return transform[element] = null;
        })
        return transform;
    }

    useEffect(() => {
        setBlog({isLoading: true});
        setPosts({isLoading: true});
        getBlog(blogId)
        if (state) {
            M.toast({
                html: state.success
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId])

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        (
            <div className="container">
                {blog.isLoading || posts.isLoading ? (
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
                                        labels: setToArray(blogLabels)
                                    }
                                }
                            }} className="btn-floating btn-large waves-effect">
                                <Icon>add</Icon>
                            </Link>
                        </div>
                        <div>
                            <h1>{blog.name}</h1>
                            <p>{blog.description}</p>
                        </div>
                        <div>
                            {posts.map((post) => (
                                <Col key={post.id}>
                                    <Card
                                        actions={[
                                            <Link key={`${post.id}-view`} to={{
                                                pathname: `${blogId}/posts/${post.id}`,
                                                state: {
                                                    post: {
                                                        title: post.title,
                                                        id: post.id
                                                    },
                                                    blog: {
                                                        labels: setToArray(blogLabels)
                                                    }
                                                }
                                            }}>
                                                <Icon>pageview</Icon>
                                            </Link>,
                                            <Link key={`${post.id}-edit`} to={{
                                                pathname: `${blogId}/posts/${post.id}/edit`,
                                                state: {
                                                    post: {
                                                        title: post.title,
                                                        id: post.id,
                                                        labels: post.labels
                                                    },
                                                    blog: {
                                                        labels: setToArray(blogLabels)
                                                    }
                                                }
                                            }}>
                                                <Icon>edit</Icon>
                                            </Link>,
                                            /*<a key={`${post.id}-delete`}><Icon>delete</Icon></a>*/
                                        ]}
                                        title={post.title}
                                    >
                                        <p className="valign-wrapper">
                                            <Icon>person</Icon>&nbsp;
                                            <a href={post.author.url} rel="noopener noreferrer"
                                               target="_blank">{post.author.displayName}</a>
                                        </p>
                                        <p className="valign-wrapper">
                                            <Icon>public</Icon>&nbsp;{dateFormat(post.published, dateMask)}
                                        </p>
                                        <p className="valign-wrapper">
                                            <Icon>edit</Icon>&nbsp;{dateFormat(post.updated, dateMask)}
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