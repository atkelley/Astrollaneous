import axios from 'axios';

export const getDailyPhotoData = axios.create({
  baseURL: `https://api.nasa.gov/planetary/apod?api_key=${(process.env.NASA_API_KEY) || env['NASA_API_KEY']}`,
});

export const getMarsWeatherData = axios.create({
  baseURL: `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=${(process.env.NASA_API_KEY) || env['NASA_API_KEY']}`,
});

export const getRoverData = axios.create({
  baseURL: `https://api.nasa.gov/mars-photos/api/v1/rovers/`,
});

export const getTechportData = axios.create({
  baseURL: `https://api.nasa.gov/techport/api/projects?api_key=${(process.env.NASA_API_KEY) || env['NASA_API_KEY']}`,
});

export const getTechportProjectData = axios.create({
  baseURL: 'https://api.nasa.gov/techport/api/projects/',
});

export const getNasaData = axios.create({
  baseURL: 'https://images-api.nasa.gov',
});