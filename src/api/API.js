import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8932',
  headers: { 'Content-Type': 'application/json' }
});