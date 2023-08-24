import axios from "axios";

const baseURL = 'https://astrollaneous.herokuapp.com//api';

export default axios.create({ baseURL: baseURL, headers: { "Content-type": "application/json" } });
