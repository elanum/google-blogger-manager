import http from "../http-common";

const getAll = () => {
    return http.get("/development");
};

const get = id => {
    return http.get(`/development/${id}`);
};

const create = data => {
    return http.post("/development", data);
};

const update = (id, data) => {
    return http.put(`/development/${id}`, data);
}

const remove = id => {
    return http.delete(`/development/${id}`);
};

const removeAll = () => {
    return http.delete("/development");
};

const findByTitle = title => {
    return http.get(`/development?title=${title}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle
}