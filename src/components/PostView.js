import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {CardPanel, Col, Icon, ProgressBar, Row, Toast} from "react-materialize";
import dateFormat from "dateformat";
import {Link} from "react-router-dom";
import M from 'materialize-css';


const PostView = props => {
    const dateMask = "dd.mm.yyyy, HH:MM:ss";

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

    useEffect(() => {
        if (props.location.success)
            M.toast({
                html: 'Post updated!'
            })
    }, [])

    useEffect(() => {
        document.title = title;
        getPost(props.match.params.blogId, props.match.params.postId);
        getComments(props.match.params.blogId, props.match.params.postId);

    }, [title, props.match.params.blogId, props.match.params.postId])


    const addTargetBlank = content => {
        content = content.replace("<a ", '<a target="_blank"');
        return content;
    }

    const postUpdated = () => {
        M.toast({html: 'Post updated!'})
    }

    return (
        <div className="container">
            {!post.loading ? (
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
                        <Link to={{
                            pathname: `/blogs/${post.blog.id}/posts/${post.id}/edit`,
                            post: post
                        }} className="btn">Edit</Link>
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