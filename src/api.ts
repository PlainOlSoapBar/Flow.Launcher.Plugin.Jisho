import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jisho.org/api/v1/search/',
  timeout: 5000, // 5 seconds
  headers: { // Fake browser header to prevent Status Code 403
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
    'Accept': 'application/json'
  }
})