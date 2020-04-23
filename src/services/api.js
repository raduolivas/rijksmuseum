import axios from 'axios';

/* Key used for api requests */
export const key = 'yW6uq3BV';
export const format = 'json';

/*
* Create the base url
* */
export const api = axios.create({
    baseURL: 'https://www.rijksmuseum.nl/api/nl'
})
