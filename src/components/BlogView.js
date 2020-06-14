import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link} from "react-router-dom";
import {Col, Card, Icon, Chip, ProgressBar} from "react-materialize";
import dateFormat from 'dateformat';
import M from "materialize-css";


const BlogView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [title] = useState(document.title);
    const [blog] = useState(props.location.state.blog);
    const [posts, setPosts] = useState({loading: true});
    const [labels, setLabels] = useState(new Set());

    const getBlogPosts = id => {
        setPosts({loading: true});
        Requests.getBlogPosts(id, (result) => {
            console.log(result);
            setPosts(result);

            let updateLabels = new Set(labels);
            if (result) {
                result.map(post => {
                    if (post.labels) {
                        post.labels.map(l => {
                            return updateLabels.add(l);
                        })
                    }
                    return true;
                })
            }
            setLabels(updateLabels);
        })
    }

    useEffect(() => {
        getBlogPosts(props.match.params.blogId);
    }, [props.match.params.blogId]) // eslint-disable-line


    useEffect(() => {
        document.title = blog.name;
    }, [title, blog.name])

    useEffect(() => {
        if (props.location.state.success)
            M.toast({
                html: props.location.state.success
            })
    }, [props.location.state.success])

    const transformLabels = set => {
        let arr = Array.from(set);
        let transform = {}
        arr.forEach(e => {
            return transform[e] = null;
        })
        return transform;
    }

    return (
        <div className="container">
            {posts &&
            posts.loading ? (
                <div className="absolute-center">
                    <ProgressBar/>
                </div>
            ) : (
                <div>
                    <div className="fixed-action-btn">
                        <Link to={{
                            pathname: `${blog.id}/posts/new`,
                            state: {
                                labels: transformLabels(labels)
                            }
                        }} className="btn-floating btn-large waves-effect">
                            <Icon>add</Icon>
                        </Link>
                    </div>
                    <div>
                        {posts.map((post) => (
                            <Col key={post.id}>
                                <Card
                                    actions={[
                                        <Link key={`${post.id}-view`} to={{
                                            pathname: `${blog.id}/posts/${post.id}`,
                                            state: {
                                                post: post,
                                                labels: transformLabels(labels)
                                            }
                                        }}>
                                            <Icon>pageview</Icon>
                                        </Link>,
                                        <Link key={`${post.id}-edit`} to={{
                                            pathname: `${blog.id}/posts/${post.id}/edit`,
                                            state: {
                                                post: {...post, labels: post.labels || []},
                                                labels: transformLabels(labels)
                                            }
                                        }}>
                                            <Icon>edit</Icon>
                                        </Link>,
                                        <a key={`${post.id}-delete`}><Icon>delete</Icon></a>
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