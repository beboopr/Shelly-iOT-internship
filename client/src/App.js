import './App.css';
import { Route, Routes } from 'react-router-dom';
import Device from './Data.js';
import { useEffect, useState} from 'react'
import { getData } from "./services/device.js";

function App() {
  const [deviceData, setDeviceData] = useState();

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await getData();
      setDeviceData(response)
      // ...
    }
    fetchData();
  }, []);
  console.log("front", deviceData)
 
  return (
    <div className="App">
      {deviceData ?(
        <h3>{deviceData.voltage}</h3>
      ): (
        <h3>loading...</h3>
      )}
      
    </div>
  );
}

export default App;

{/* <Routes>
  <Route path='/fetch' element={<Device />}>
  </Route>
</Routes> */}