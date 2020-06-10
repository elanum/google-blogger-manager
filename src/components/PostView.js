import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Col, ProgressBar, Row} from "react-materialize";


const PostView = props => {
    const [post, setPost] = useState({loading: true});
    const getPost = (bid, pid) => {
        setPost({loading: true});
        Requests.getPost(bid, pid, (result) => {
            setPost(result);
            console.log("post", result)
        })
    }

    useEffect(() => {
        getPost(props.match.params.blogId, props.match.params.postId);
    }, [props.match.params.postId])


    const addTargetBlank = content => {
        content = content.replace("<a ", '<a target="_blank"');
        return content;
    }

    return (
        <div className="container">
            {console.log(props.match.params.postId)}
            {!post.loading ? (
                <Row>
                    <Col>
                        <div className="z-depth-1 set-padding" dangerouslySetInnerHTML={{__html: addTargetBlank(post.content)}}/>
                    </Col>
                </Row>
            ) : (
                <div className="absolute-center">
                    <ProgressBar />
                </div>
            )}
        </div>
    )
}

export default PostView;