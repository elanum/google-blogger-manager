import React, {useState, useEffect} from 'react';
import BloggerService from "../services/BloggerService";
import {Link} from 'react-router-dom';

const DevelopmentList = () => {
    const [development, setDevelopment] = useState([]);
    const [currentDevelopment, setCurrentDevelopment] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        retrieveDevelopment();
    }, []);

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrieveDevelopment = () => {
        BloggerService.getAll()
            .then(response => {
                setDevelopment(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.error(e);
            });
    };

    const refreshList = () => {
        retrieveDevelopment();
        setCurrentDevelopment(null);
        setCurrentIndex(-1);
    };

    const setActiveDevelopment = (development, index) => {
        setCurrentDevelopment(development);
        setCurrentIndex(index);
    };

    const removeAllDevelopment = () => {
        BloggerService.removeAll()
            .then(response => {
                console.log(response.data);
                refreshList();
            })
            .catch(e => {
                console.error(e)
            });
    };

    const findByTitle = () => {
        BloggerService.findByTitle(searchTitle)
            .then(response => {
                setDevelopment(response.data);
                console.log(response.data)
            })
            .catch(e => {
                console.error(e);
            });
    };

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={onChangeSearchTitle}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByTitle}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <h4>Development List</h4>
                <ul className="list-group">
                    {development &&
                    development.map((development, index) => (
                        <li
                            className={
                                "list-group-item " + (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveDevelopment(development, index)}
                            key={index}
                        >
                            {development.title}
                        </li>
                    ))}
                </ul>

                <button
                    className="m-3 btn btn-sm btn-danger"
                    onClick={removeAllDevelopment}
                >
                    Remove All
                </button>
            </div>

            <div className="col-md-6">
                {currentDevelopment ? (
                    <div>
                        <h4>Development</h4>
                        <div>
                            <label>
                                <strong>Title:</strong>
                            </label>{" "}
                            {currentDevelopment.title}
                        </div>
                        <div>
                            <label>
                                <strong>Description:</strong>
                            </label>{" "}
                            {currentDevelopment.description}
                        </div>
                        <div>
                            <label>
                                <strong>Status:</strong>
                            </label>{" "}
                            {currentDevelopment.published ? "Published" : "Pending"}
                        </div>

                        <Link
                            to={"/development/" + currentDevelopment.id}
                            className="badge badge-warning"
                        >
                            Edit
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Please click on a Development...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DevelopmentList;