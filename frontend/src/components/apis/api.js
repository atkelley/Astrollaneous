import axios from "axios";

const baseURL = 'https://astrollaneous.herokuapp.com';

export default axios.create({ baseURL: baseURL, headers: { "Content-type": "application/json" } });
