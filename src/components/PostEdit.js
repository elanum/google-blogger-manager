import React, {useState} from "react";
import Requests from "./Requests";
import {Button, Icon, Row, Textarea, TextInput} from "react-materialize";
import {Redirect} from "react-router-dom";

const PostEdit = props => {

    const post = props.location.post;
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState(post);

    const savePost = () => {
        Requests.updatePost(post.blog.id, post.id, update.title, update.content, () => {
            setSuccess(true);
        });
    }

    const handleInputChange = event => {
        const {name, value} = event.target;
        setUpdate({...update, [name]: value});
    }

    return (
        <div className="container">
            <div>
                <h4>{post.title}</h4>
                <Row>
                    <TextInput
                        s={12}
                        id="post-title"
                        label="Title"
                        value={update.title}
                        onChange={handleInputChange}
                        data-length={75}
                        name="title"
                    />
                </Row>
                <Row>
                    <Textarea
                        s={12}
                        id="post-content"
                        label="Content"
                        value={update.content}
                        onChange={handleInputChange}
                        name="content"
                    />
                </Row>
                <Row>
                    <Button
                        node="button"
                        waves="light"
                        onClick={savePost}
                    >
                        Submit<Icon right>send</Icon>
                    </Button>
                </Row>
            </div>
            {success && (
                <Redirect to={{
                    pathname: `/blogs/${post.blog.id}/posts/${post.id}`,
                    success: true
                }}/>
            )}
        </div>
    )
}

export default PostEdit;