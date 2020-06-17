import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, CardPanel, Chip, Col, Icon, Modal, Row, TextInput} from "react-materialize";
import {Redirect, useLocation} from "react-router-dom";
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

/**
 * Component to edit a post
 */
const PostEdit = () => {
    const {state} = useLocation();

    const [error, setError] = useState(null);
    const [post] = useState(state.post);
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState({...post});
    const [blogLabels, setBlogLabels] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
            htmlToDraft(post.content)
        )
    ))

    const savePost = () => {
        if (!post.title)
            setUpdate({...update, title: 'New Post'})
        Requests.updatePost(post.blog.id, post.id, update.title, update.content, update.labels)
            .then(() => {
                setSuccess(true)
            })
            .catch((err) => {
                setError(err);
            })

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

    const handleEditorState = e => {
        setEditorState(e)
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setUpdate({...update, content: html});
    }

    useEffect(() => {
        const setInitialChips = () => {
            const initChipData = []
            if (post.labels)
                post.labels.forEach(e => {
                    initChipData.push({
                        tag: e
                    })
                })
            setChipData(initChipData);
        }
        setInitialChips()
        document.title = post.title + ": Edit"
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
                        <Row>
                            <Col s={12}>
                                <CardPanel className="center deep-orange white-text">
                                    <h5>{post.title}</h5>
                                </CardPanel>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={12} className="no-padding">
                                <TextInput
                                    s={12}
                                    id="post-title"
                                    label="Title"
                                    value={update.title}
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

export default PostEdit;