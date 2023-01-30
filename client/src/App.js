// import Device from './Data.js';
import './App.css';
import axios from "axios";
import { useState } from "react";

// export const getClient = () => {
//   return axios.create({
//     baseURL: "http://localhost:3030",
//   });
// };

function App() {
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
    axios.get("");
  };

  return (
<div className="App">
  {/* <img src={logo} alt="logo" /> */}
 <button className="button" onClick={getStatus} >DB Write/Retrive</button>
  <button className="button2" onClick={flipSwitch}>ON/OFF</button>
</div>

// { deviceData ? (
//   <div>
//   <p>ID:{deviceData.id}</p>
//   <p>Voltage:{deviceData.voltage}</p>
//   <p></p>
//   <p></p>
//   <p></p>
//   </div>
  
//   )
// }
)
}

export default App;