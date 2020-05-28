import React, {useState, useEffect} from "react";
import BloggerService from "../services/BloggerService";

const Development = props => {
    const initialState = {
        id: null,
        title: "",
        description: "",
        published: false
    };

    const [currentDevelopment, setCurrentDevelopment] = useState(initialState);
    const [message, setMessage] = useState("");

    const getDevelopment = id => {
        BloggerService.get(id)
            .then(response => {
                setCurrentDevelopment(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.error(e)
            });
    };

    useEffect(() => {
        getDevelopment(props.match.params.id);
    }, [props.match.params.id]);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setCurrentDevelopment({...currentDevelopment, [name]: value});
    };

    const updatePublished = status => {
        var data = {
            id: currentDevelopment.id,
            title: currentDevelopment.title,
            description: currentDevelopment.description,
            published: status
        };

        BloggerService.update(currentDevelopment.id, data)
            .then(response => {
                setCurrentDevelopment({...currentDevelopment, published: status})
                console.log(response.data);
            })
            .catch(e => {
                console.error(e);
            });
    };

    const updateDevelopment = () => {
        BloggerService.update(currentDevelopment.id, currentDevelopment)
            .then(response => {
                console.log(response.data)
                setMessage("The Development was updated successfully!");
            })
            .catch(e => {
                console.error(e);
            })
    }

    const deleteDevelopment = () => {
        BloggerService.remove(currentDevelopment.id)
            .then(response => {
                console.log(response.data);
                props.history.push("/development");
            })
            .catch(e => {
                console.error(e);
            });
    };

    return (
        <div>
            {currentDevelopment ? (
                <div className="edit-form">
                    <h4>Development</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={currentDevelopment.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={currentDevelopment.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <strong>Status:</strong>
                            </label>{" "}
                            {currentDevelopment.published ? "Published" : "Pending"}
                        </div>
                    </form>

                    {currentDevelopment.published ? (
                        <button
                            className="badge badge-primary mr-2"
                            onClick={() => updatePublished(false)}
                        >
                            UnPublish
                        </button>
                    ) : (
                        <button
                            className="badge badge-primary mr-2"
                            onClick={() => updatePublished(true)}
                        >
                            Publish
                        </button>
                    )}

                    <button className="badge badge-danger mr-2" onClick={deleteDevelopment}>
                        Delete
                    </button>

                    <button
                        type="submit"
                        className="badge badge-success"
                        onClick={updateDevelopment}
                        >
                        Update
                    </button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a Development...</p>
                </div>
            )}
        </div>
    );
};

export default Development;