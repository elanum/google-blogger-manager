import React, {useState} from "react";
import {Redirect, useLocation, useParams} from "react-router-dom";
import Requests from "./Requests";
import {Button, Chip, Col, Icon, Row, Textarea, TextInput} from "react-materialize";

/**
 * Component to create a new post in the current blog
 *
 */

const PostCreate = () => {
    const {state} = useLocation();
    const {blogId} = useParams();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [createdPost, setCreatedPost] = useState({});
    const [blogLabels, setBlogLabels] = useState(state.blog.labels);
    const [chipData, setChipData] = useState([]);

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

    return error ?
        <Redirect to={{pathname: "/error", state: error}}/> :
        (
            <div className="container">
                <div>
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
                            post: {...createdPost},
                            blog: {
                                labels: blogLabels
                            },
                            success: 'Post created!'
                        }
                    }}/>
                )}
            </div>
        )
}

export default PostCreate;