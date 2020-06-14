import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, Chip, Col, Icon, Row, Textarea, TextInput} from "react-materialize";
import {Redirect, useLocation} from "react-router-dom";

const PostEdit = () => {
    const {state} = useLocation();
    const [post] = useState(state.post);
    const [title] = useState(document.title);
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState({...post});
    const [autoCompleteData] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);

    const savePost = event => {
        event.preventDefault();
        if (update.title && update.content) {
            Requests.updatePost(post.blog.id, post.id, update.title, update.content, update.labels).then(() => {
                setSuccess(true)
            })
        }
    }

    const handleChipAdd = (data, object) => {
        const chip = object.firstChild.data;
        const newLabel = update.labels ? update.labels : [];
        newLabel.push(chip);
        setUpdate({...update, labels: newLabel});
        setChipData(data);
    }

    const handleChipDelete = object => {
        const chip = object.firstChild.data;
        let index = update.labels.indexOf(chip);
        const removedLabel = update.labels;
        removedLabel.splice(index, 1);
        setUpdate({...update, labels: removedLabel})
    }

    const handleInputChange = event => {
        const {name, value} = event.target;
        setUpdate({...update, [name]: value});
    }

    const initDefaultChips = () => {
        const initChipData = []
        post.labels.forEach(e => {
            initChipData.push({
                tag: e
            })
        })
        setChipData(initChipData);
    }

    useEffect(() => {
        document.title = "Edit: " + post.title;
        initDefaultChips();
    }, [title, post]) // eslint-disable-line

    return (
        <div className="container">
            <div>
                <h4>{post.title}</h4>
                <form onSubmit={savePost}>
                <Row>
                    <TextInput
                        required
                        validate
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
                    <Col s={12}>
                        <label>Labels</label>
                        <Chip
                            close={false}
                            closeIcon={<Icon>close</Icon>}
                            options={{
                                data: chipData,
                                autocompleteOptions: {
                                    data: autoCompleteData,
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
                        value={update.content}
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
                    pathname: `/blogs/${post.blog.id}/posts/${post.id}`,
                    state: {
                        post: update,
                        success: 'Post updated!'
                    }
                }}/>
            )}
        </div>
    )
}

export default PostEdit;