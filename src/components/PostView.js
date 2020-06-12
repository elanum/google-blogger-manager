import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, ProgressBar, Row} from "react-materialize";
import dateFormat from "dateformat";
import {Link, Redirect} from "react-router-dom";
import M from 'materialize-css';

const PostView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

    const [deleted, setDeleted] = useState({value: false, blogId: '0'});
    const [post, setPost] = useState({loading: true});
    const [title, setTitle] = useState(document.title);
    const [comments, setComments] = useState([]);

    const getPost = (bid, pid) => {
        setPost({loading: true});
        Requests.getPost(bid, pid, (result) => {
            setPost(result);
            setTitle(result.title);
        })
    }

    const getComments = (bid, pid) => {
        Requests.getComments(bid, pid, (result) => {
            setComments(result);
        })
    }

    const deletePost = (bid, pid) => {
        Requests.deletePost(bid, pid, () => {
            setDeleted({
                value: true,
                blogId: bid
            });
        })
    }

    useEffect(() => {
        if (props.location.success)
            M.toast({
                html: 'Post updated!'
            })
    }, [props.location.success])

    useEffect(() => {
        getPost(props.match.params.blogId, props.match.params.postId);
        getComments(props.match.params.blogId, props.match.params.postId);
    }, [props.match.params.blogId, props.match.params.postId])

    useEffect(() => {
        document.title = title;
    }, [title])


    const addTargetBlank = content => {
        content = content.replace("<a ", '<a target="_blank"');
        return content;
    }

    return (
        <div className="container">
            {deleted.value ? (
                <Redirect to={`/blogs/${deleted.blogId}`}/>
            ) : !post.loading ? (
                <div>
                    <div>
                        <h4>{post.title}</h4>
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
                        <Link to={{
                            pathname: `/blogs/${post.blog.id}/posts/${post.id}/edit`,
                            post: post,
                            labels: props.location.labels
                        }} className="btn">Edit<Icon right>edit</Icon></Link>
                        <Modal
                            actions={[
                                <Button flat modal="close" node="button" waves="light" className="red white-text"
                                        onClick={() => {
                                            deletePost(post.blog.id, post.id)
                                        }}>Delete</Button>,
                                <Button flat modal="close" node="button" waves="light">Cancel</Button>
                            ]}
                            header="Confirm Deletion"
                            trigger={
                                <Button node="button">Delete<Icon right>delete</Icon></Button>
                            }
                        >
                            <p>Do you really want to delete "<code>{post.title}</code>"? This cannot be undone!</p>
                        </Modal>
                    </div>
                    <Row>
                        <Col s={12}>
                            <CardPanel>
                                <div dangerouslySetInnerHTML={{__html: addTargetBlank(post.content)}}/>
                            </CardPanel>
                        </Col>
                    </Row>
                    {comments && (
                        <div>
                            <h4>Comments</h4>
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    <Row>
                                        <Col s={12}>
                                            <CardPanel>
                                                <Row className="valign-wrapper">
                                                    <Col s={2}>

                                                        <img src={comment.author.image.url}
                                                             alt={comment.author.displayName}
                                                             className="circle responsive-img"/>

                                                    </Col>
                                                    <Col s={10}>
                                                        <p>{comment.author.displayName}</p>
                                                        <div className="divider"/>
                                                        <p className="valign-wrapper">
                                                            <Icon>public</Icon>&nbsp;{dateFormat(comment.published, dateMask)}
                                                        </p>
                                                        <p className="valign-wrapper">
                                                            <Icon>edit</Icon>&nbsp;{dateFormat(comment.updated, dateMask)}
                                                        </p>
                                                        <div className="divider"/>
                                                        <p>{comment.content}</p>
                                                    </Col>
                                                </Row>
                                            </CardPanel>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    )
                    }
                </div>
            ) : (
                <div className="absolute-center">
                    <ProgressBar/>
                </div>
            )}
        </div>
    )
}

export default PostView;