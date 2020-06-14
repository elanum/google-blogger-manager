import React, {useEffect, useState} from "react";
import {Redirect, useLocation} from "react-router-dom";
import Requests from "./Requests";
import {Button, Chip, Col, Icon, Row, Textarea, TextInput} from "react-materialize";

/**
 * Component to create a new post in the current blog
 *
 */

const PostCreate = props => {
    const {state} = useLocation();

    const [title] = useState(document.title);
    const [success, setSuccess] = useState(false);
    const [createdPost, setCreatedPost] = useState({});
    const [autoCompleteData] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);

    const savePost = event => {
        event.preventDefault();
        if (createdPost.title && createdPost.content) {
            Requests.createPost(props.match.blogId, createdPost.title, createdPost.content, createdPost.labels).then(result => {
                setCreatedPost(result);
                setSuccess(true);
            })
        }
    }

    const handleChipAdd = (data, object) => {
        const chip = object.firstChild.data;
        const newLabel = createdPost.labels ? createdPost.labels : [];
        newLabel.push(chip);
        setCreatedPost({...createdPost, labels: newLabel});
        setChipData(data);
    }

    const handleChipDelete = object => {
        const chip = object.firstChild.data;
        let index = createdPost.labels.indexOf(chip);
        const removedLabel = createdPost.labels;
        removedLabel.splice(index, 1);
        setCreatedPost({...createdPost, labels: removedLabel})
    }

    const handleInputChange = event => {
        const {name, value} = event.target;
        setCreatedPost({...createdPost, [name]: value});
    }

    useEffect(() => {
        document.title = title + ": New Post"
    }, [title])

    return (
        <div className="container">
            <div>
                {console.log(autoCompleteData)}
                <h4>New Post</h4>
                <form onSubmit={savePost}>
                    <Row>
                        <TextInput
                            required
                            validate
                            s={12}
                            id="post-title"
                            label="Title"
                            onChange={handleInputChange}
                            data-length={75}
                            name="title"
                        />
                    </Row>
                    <Row>
                        <Col s={12}>
                            <label>Labels</label>
                            <Chip
                                close={false}
                                closeIcon={<Icon>close</Icon>}
                                options={{
                                    data: chipData,
                                    autocompleteOptions: {
                                        data: autoCompleteData
                                    },
                                    onChipAdd: (e, chip) => {
                                        handleChipAdd(e[0].M_Chips.chipsData, chip)
                                    },
                                    onChipDelete: (e, chip) => {
                                        handleChipDelete(chip);
                                    }
                                }}
                                name="labels"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Textarea
                            required
                            validate
                            s={12}
                            id="post-content"
                            label="Content"
                            onChange={handleInputChange}
                            name="content"
                        />
                    </Row>
                    <Row>
                        <Button
                            node="button"
                            type="submit"
                        >
                            Submit<Icon right>send</Icon>
                        </Button>
                    </Row>
                </form>
            </div>
            {success && (
                <Redirect to={{
                    pathname: `/blogs/${createdPost.blog.id}/posts/${createdPost.id}`,
                    state: {
                        post: createdPost,
                        success: 'Post created!'
                    }
                }}/>
            )}
        </div>
    )
}

export default PostCreate;