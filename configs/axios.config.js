import axios from "axios";

export const server = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://ecdsa-node-alchemy.vercel.app/api"
      : "http://localhost:3000/api",
});
