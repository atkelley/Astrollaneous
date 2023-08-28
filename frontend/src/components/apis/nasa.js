import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_TECHPORT_API_KEY = process.env.NASA_API_KEY;

export const getDailyPhotoData = axios.create({
  baseURL: `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
});

export const getMarsWeatherData = axios.create({
  baseURL: `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=${NASA_API_KEY}`,
});

export const getRoverData = axios.create({
  baseURL: `https://api.nasa.gov/mars-photos/api/v1/rovers/`,
});

export const getTechportData = axios.create({
  baseURL: `https://techport.nasa.gov/api/projects?api_key=${NASA_TECHPORT_API_KEY}`,
});

export const getTechportProjectData = axios.create({
  baseURL: 'https://techport.nasa.gov/api/projects/',
});

export const getNasaData = axios.create({
  baseURL: 'https://images-api.nasa.gov',
});