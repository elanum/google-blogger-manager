import React, {useState} from 'react';
import BloggerService from "../services/BloggerService";

const DevelopmentAdd = () => {
    const initialState = {
        id: null,
        title: "",
        description: "",
        published: false
    };
    const [development, setDevelopment] = useState(initialState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setDevelopment({...development, [name]: value});
    };

    const saveDevelopment = () => {
        var data = {
            title: development.title,
            description: development.description
        };

        BloggerService.create(data)
            .then(response => {
                setDevelopment({
                    id: response.data.id,
                    title: response.data.title,
                    description: response.data.description,
                    published: response.data.published
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.error(e);
            });
    }

    const newDevelopment = () => {
        setDevelopment(initialState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newDevelopment}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            required
                            value={development.title}
                            onChange={handleInputChange}
                            name="title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            required
                            value={development.description}
                            onChange={handleInputChange}
                            name="description"
                        />
                    </div>

                    <button onClick={saveDevelopment} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

export default DevelopmentAdd;