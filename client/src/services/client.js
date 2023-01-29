import axios from "axios";

export const getClient = () => {
  return axios.create({
    baseURL: "http://localhost:3030",
  });
};
