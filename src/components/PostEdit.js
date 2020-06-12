import React, {useEffect, useState} from "react";
import Requests from "./Requests";
import {Button, Chip, Col, Icon, Row, Textarea, TextInput} from "react-materialize";
import {Redirect} from "react-router-dom";

const PostEdit = props => {
/*    const post = props.location.post;
    document.title = post.title + " - Edit";
    console.log("initPostValue", props.location.post.labels)

    // Initialize Pre-Chip Data
    let initialChipData = [];
    post.labels.forEach(e => {
        initialChipData.push({
            tag: e
        });
    })*/
    /*
    data: [
        {
            tag: 'label'
        }
    ]
     */

    // Initialize Chip Auto Complete Data from inherited variable
    /*let initAutoCompleteData = {};
    props.location.labels.forEach((e) => {
        return initAutoCompleteData[e] = null;
    })*/

    const [post] = useState(props.location.post);
    const [title] = useState(document.title);
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState({...post});
    const [autoCompleteData] = useState(props.location.labels);
    const [chipData, setChipData] = useState([]);

    const savePost = () => {
        Requests.updatePost(post.blog.id, post.id, update.title, update.content, update.labels, () => {
            setSuccess(true);
        });
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
        initDefaultChips();
    }, [post])

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
                    <Col s={12}>
                        <label>Labels</label>
                        <Chip
                            close={false}
                            closeIcon={<Icon className="close">close</Icon>}
                            options={{
                                data: chipData,
                                autocompleteOptions: {
                                    data: autoCompleteData,
                                },
                                onChipAdd: (e, chip) => {
                                    handleChipAdd(e[0].M_Chips.chipsData, chip)
                                },
                                onChipDelete: (e, chip) => {
                                    /*console.log("e", e);
                                    console.log("chip",chip);*/
                                    handleChipDelete(chip);
                                }
                            }}
                            name="labels"
                        />
                    </Col>
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