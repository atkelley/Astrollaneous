import axios from "axios";

const baseURL = (process.env && process.env.NODE_ENV && process.env.NODE_ENV == 'development') ? 'http://localhost:8000/api' : 'http://astrollaneous.herokuapp.com';

export default axios.create({ baseURL: baseURL, headers: { "Content-type": "application/json" } });
