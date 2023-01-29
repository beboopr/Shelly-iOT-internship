import React from "react";
import { useState, useEffect } from "react";
import { getData } from "./services/device.js";

export default function Device() {
  const [deviceData, setDeviceData] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await getData();
      setDeviceData(response);
    }
    fetchData();
  }, []);
  console.log("front", deviceData);
  return <h3>{deviceData.voltage}</h3>;
}
