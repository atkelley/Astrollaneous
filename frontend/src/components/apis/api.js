import axios from "axios";

// const baseURL = (process.env.NODE_ENV == 'development') ? 'http://localhost:8000/api' : 'https://astrollaneous.herokuapp.com/api';

let baseURL = '';

if (window.location.origin === "http://localhost:3000") {
  baseURL = "http://127.0.0.1:8000"; // development address
} else {
  baseURL = window.location.origin; // production address
}

export default axios.create({ baseURL: baseURL, headers: { "Content-type": "application/json" } });
