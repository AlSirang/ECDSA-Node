import axios from "axios";

export const server = axios.create({
  baseURL: process.env.production
    ? "http://localhost:3000/api"
    : "http://localhost:3000/api",
});
