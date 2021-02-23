import axios from "axios";

export default axios.create({ baseURL: 'http://astrollaneous.herokuapp.com', headers: { "Content-type": "application/json" } });
