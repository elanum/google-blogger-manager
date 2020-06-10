import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Link} from "react-router-dom";
import {Row, Modal, Button, Col, Card, ProgressBar, Icon} from "react-materialize";
import dateFormat from 'dateformat';


const BlogView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [blog, setBlog] = useState({loading: true});
    const [posts, setPosts] = useState([]);

    const getBlog = id => {
        setBlog({loading: true});
        Requests.getBlog(id, (result) => {
            setBlog(result);
        })
    }

    const getPosts = id => {
        Requests.getBlogPosts(id, (result) => {
            setPosts(result);
            console.log("Post", result)
        })
    }

    useEffect(() => {
        getBlog(props.match.params.blogId);
        getPosts(props.match.params.blogId);
    }, [props.match.params.blogId])


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
                                    <a className="disabled">Delete</a>,
                                    <Modal key={`${post.id}-delete`}
                                           actions={[
                                               <Button flat modal="close" node="button">Close</Button>
                                           ]}
                                           header="Testheader"
                                           id="modal-delete"
                                           trigger={
                                               <a href="#" data-target="modal-delete">MODAL</a> // eslint-disable-line
                                           }
                                    >
                                        <p>Some Text</p>
                                    </Modal>
                                ]}
                                title={post.title}
                            >
                                <p className="valign-wrapper">
                                    <Icon>person</Icon>&nbsp;
                                    <a href={post.author.url} target="_blank">{post.author.displayName}</a>
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