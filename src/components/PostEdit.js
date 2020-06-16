import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, Chip, Col, Icon, Row, Textarea, TextInput} from "react-materialize";
import {Redirect, useLocation} from "react-router-dom";

const PostEdit = () => {
    const {state} = useLocation();

    const [error, setError] = useState(null);
    const [post] = useState(state.post);
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState({...post});
    const [blogLabels, setBlogLabels] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);

    const savePost = event => {
        event.preventDefault();
        if (update.title && update.content) {
            Requests.updatePost(post.blog.id, post.id, update.title, update.content, update.labels)
                .then(() => {
                    setSuccess(true)
                })
                .catch((err) => {
                    setError(err);
                })
        }
    }

    const handleChipAdd = (data, object) => {
        const chip = object.firstChild.data;
        const addLabels = update.labels ? update.labels : [];
        const addBlogLabels = blogLabels;

        addLabels.push(chip);
        addBlogLabels[chip] = null;

        setUpdate({...update, labels: addLabels});
        setChipData(data);
        setBlogLabels(addBlogLabels);
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

    useEffect(() => {
        const setInitialChips = () => {
            const initChipData = []
            post.labels.forEach(e => {
                initChipData.push({
                    tag: e
                })
            })
            setChipData(initChipData);
        }

        setInitialChips()
    }, [post])


    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        success ?
            <Redirect to={{
                pathname: `/blogs/${post.blog.id}/posts/${post.id}`,
                state: {
                    post: {...post},
                    blog: {
                        labels: blogLabels
                    },
                    success: 'Post updated!'
                }
            }}/> :
            (
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
                                                data: blogLabels,
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
                </div>
            )
}

export default PostEdit;