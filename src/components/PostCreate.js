import React, {useEffect, useState} from "react";
import {Redirect, useLocation, useParams} from "react-router-dom";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, Row, TextInput} from "react-materialize";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {convertToRaw, EditorState} from "draft-js";

/**
 * Component to create a new post in the current blog
 */
const PostCreate = () => {
    const {state} = useLocation();
    const {blogId} = useParams();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [createdPost, setCreatedPost] = useState({});
    const [blogLabels, setBlogLabels] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const savePost = event => {
        event.preventDefault();
        if (createdPost.title && createdPost.content) {
            Requests.createPost(blogId, createdPost.title, createdPost.content, createdPost.labels)
                .then(result => {
                    setCreatedPost(result);
                    setSuccess(true);
                })
                .catch((err) => {
                    setError(err);
                })
        }
    }

    const handleChipAdd = (data, object) => {
        const chip = object.firstChild.data;
        const addLabels = createdPost.labels ? createdPost.labels : [];
        const addBlogLabels = blogLabels;

        addLabels.push(chip);
        addBlogLabels[chip] = null;

        setCreatedPost({...createdPost, labels: addLabels});
        setChipData(data);
        setBlogLabels(addBlogLabels);
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

    const handleEditorState = e => {
        setEditorState(e)
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setCreatedPost({...createdPost, content: html});
    }

    useEffect(() => {
        document.title = state.blog.name + ": New"
    })

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        success ?
            <Redirect to={{
                pathname: `/blogs/${createdPost.blog.id}/posts/${createdPost.id}`,
                state: {
                    post: {...createdPost},
                    blog: {
                        labels: blogLabels
                    },
                    success: 'Post created!'
                }
            }}/> :
            (
                <div className="container">
                    <div>
                        <Row>
                            <Col s={12}>
                                <CardPanel className="center deep-orange white-text">
                                    <h5>New Post</h5>
                                </CardPanel>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={12} className="no-padding">
                                <TextInput
                                    s={12}
                                    id="post-title"
                                    label="Title"
                                    onChange={handleInputChange}
                                    data-length={75}
                                    name="title"
                                />
                            </Col>
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
                                            data: blogLabels
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
                            <Col s={12}>
                                <label>Content</label>
                                <CardPanel>
                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={handleEditorState}
                                        toolbar={{
                                            blockType: {
                                                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote', 'Code']
                                            },
                                            image: {
                                                uploadEnabled: false
                                            }
                                        }}
                                    />
                                </CardPanel>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={12}>
                                <Modal
                                    actions={[
                                        <Button flat modal="close" node="button" className="green white-text"
                                                onClick={savePost}>Submit</Button>,
                                        <Button flat modal="close" node="button">Cancel</Button>
                                    ]}
                                    header="Confirm Submit"
                                    trigger={
                                        <Button node="button" className="green right">Send<Icon
                                            right>send</Icon></Button>
                                    }
                                >
                                    <p>Already finished?</p>
                                </Modal>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
}

export default PostCreate;