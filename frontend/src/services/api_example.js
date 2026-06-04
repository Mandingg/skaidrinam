import axios from "axios";

// Naudojame .env kintamąjį baziniam URL (pvz., http://localhost:8001)
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
