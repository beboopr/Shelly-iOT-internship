import { getClient } from "./client.js";

export const getData = async () => {
  const client = getClient();
  const { data } = await client.get("/fetch");
  return data;
};