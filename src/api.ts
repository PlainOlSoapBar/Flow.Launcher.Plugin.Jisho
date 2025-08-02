import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jisho.org/api/v1/search/'
})