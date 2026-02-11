import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://trcapi.jahanmal.xyz/api",
  // timeout: 15000
});
