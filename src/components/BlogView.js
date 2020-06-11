import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link} from "react-router-dom";
import {Modal, Button, Col, Card, ProgressBar, Icon} from "react-materialize";
import dateFormat from 'dateformat';


const BlogView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [title, setTitle] = useState(document.title);
    const [blog, setBlog] = useState({loading: true});
    const [posts, setPosts] = useState([]);

    const getBlog = id => {
        setBlog({loading: true});
        Requests.getBlog(id, (result) => {
            setBlog(result);
            setTitle(result.name);
        })
    }

    const getPosts = id => {
        Requests.getBlogPosts(id, (result) => {
            setPosts(result);
        })
    }

    useEffect(() => {
        document.title = title;
        getBlog(props.match.params.blogId);
        getPosts(props.match.params.blogId);
    }, [title, props.match.params.blogId])


    return (
        <div className="container">
            {!blog.loading ? (
                <div>
                    {posts &&
                    posts.map((post) => (
                        <Col key={post.id}>
                            <Card
                                actions={[
                                    <Link key={blog.id} to={`${blog.id}/posts/${post.id}`}>View</Link>,
                                    <Link key={`${post.id}-edit`} to={{
                                        pathname: `${blog.id}/posts/${post.id}/edit`,
                                        post: post
                                    }}>Edit</Link>,
                                    <Modal key={`${post.id}-delete`}
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
                                    <a href={post.author.url} rel="noopener noreferrer" target="_blank">{post.author.displayName}</a>
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