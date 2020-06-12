import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link} from "react-router-dom";
import {Modal, Button, Col, Card, ProgressBar, Icon, Chip} from "react-materialize";
import dateFormat from 'dateformat';


const BlogView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [title, setTitle] = useState(document.title);
    const [blog, setBlog] = useState({loading: true});
    const [posts, setPosts] = useState([]);
    const [labels, setLabels] = useState(new Set());

    const getBlog = id => {
        setBlog({loading: true});
        Requests.getBlog(id, (result) => {
            setBlog(result);
            setTitle(result.name);
        })
    }

    const getBlogPosts = id => {
        Requests.getBlogPosts(id, (result) => {
            let update = new Set(labels)
            setPosts(result);
            if (result) {
                result.map(post => {
                    if (post.labels) {
                        post.labels.map(l => {
                            return update.add(l);
                        })
                    }
                    return true;
                })
            }
            setLabels(update);
        })
    }

    useEffect(() => {
        getBlog(props.match.params.blogId);
        getBlogPosts(props.match.params.blogId);
    }, [props.match.params.blogId]) // eslint-disable-line


    useEffect(() => {
        document.title = title;
    }, [title])

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
            {!blog.loading ? (
                <div>
                    <Button fab large floating icon={<Icon>add</Icon>}/>
                    <Button fab large floating icon={<Icon>add</Icon>}/>
                    {posts &&
                    posts.map((post) => (
                        <Col key={post.id}>
                            <Card
                                actions={[
                                    <Link key={blog.id} to={{
                                        pathname: `${blog.id}/posts/${post.id}`,
                                        labels: transformLabels(labels)
                                    }}>
                                        View
                                    </Link>,
                                    <Link key={`${post.id}-edit`} to={{
                                        pathname: `${blog.id}/posts/${post.id}/edit`,
                                        post: {...post, labels: post.labels || []},
                                        labels: transformLabels(labels)
                                    }}>
                                        Edit
                                    </Link>,
                                    <Modal
                                        key={`${post.id}-delete`}
                                        actions={[
                                            <Button flat modal="close" node="button">Close</Button>
                                        ]}
                                        header="Testheader"
                                        id="modal-delete"
                                        trigger={
                                            <a href="#" data-target="modal-delete">Delete</a> // eslint-disable-line
                                        }
                                    >
                                        <p>Some Text</p>
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
            ) : (
                <div className="absolute-center">
                    <ProgressBar/>
                </div>
            )}
        </div>
    )
}

export default BlogView;