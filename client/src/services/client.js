import axios from "axios";
import { useState } from "react";

// export const getClient = () => {
//   return axios.create({
//     baseURL: "http://localhost:3030",
//   });
// };

export const getClient = () => {
  const [deviceData, setDeviceData] = useState([]);

  const getStatus = () => {
    console.log("Button cliked");
    axios
      .get("http://localhost:3030")
      .then((res) => {
        console.log(res);
        setDeviceData(res.data);
      })
      .then(console.log(deviceData))
      .catch(console.error);
  };

  const flipSwitch = () => {
    axios.get("http://192.168.15.35/rpc/Switch.GetStatus?id=0");
  };
};

export default getClient;
