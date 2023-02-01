import {
  getDeviceEventsCollection,
  getDeviceGetConfigCollection,
  getDeviceGetStatusCollection,
  getDeviceOnlineCollection,
} from "../gateway/connectDB.js";
import mqtt from "mqtt";
import { mqttConfig, mqttSetConfig, mqttStatus } from "./shellyMqtt.js";
import { BROKER_IP } from "../secrets.js";
import { LocalStorage } from "node-localstorage";

let localStorage = new LocalStorage("./scratch");

let msg = null;
let prefix = "";
const mqttConnectionTestsErrorMsg = {
  statusCode: 400,
  message: "Shelly device MQTT not connected - Check configuration",
};
const clientOnErrorMsg = {
  statusCode: 400,
  message: "Can't connect to MQTT Server",
};

export const getOnline = async (devIP) => {
  console.log("getting ip of connected devices");

  return;
  ipList.forEach(async (devIP) => {
    console.log("here", localStorage.getItem("IP"));
    console.log("Mqtt/online ip:", devIP);
    const testMqtt = await mqttConnectionTests(devIP);

    if (testMqtt > 0) {
      return mqttConnectionTestsErrorMsg;
    } else {
      const topic = prefix + "/online";
      // console.log('Topic to subscribe:',topic)
      const res = await getTopicMsg(topic, 0);

      if (res) {
        console.log("here", msg);
      }
    }
  });
};
// returns result every 60 seconds
export const getEvents = async (devIP) => {
  const testMqtt = await mqttConnectionTests(devIP);

  if (testMqtt > 0) {
    return mqttConnectionTestsErrorMsg;
  } else {
    const topic = prefix + "/events/rpc";
    // console.log('Topic to subscribe:',topic)
    const res = await getTopicMsg(topic, 1);

    if (res) {
      console.log("here", msg);
    }
  }
};
// requires timer
export const getStatus = async (devIP) => {
  const testMqtt = await mqttConnectionTests(devIP);

  if (testMqtt > 0) {
    return mqttConnectionTestsErrorMsg;
  } else {
    const command = "Shelly.GetStatus";
    const topic = prefix + "/rpc";
    // console.log('Topic to subscribe:',topic)
    const ret = await publish(topic, command);
    //
    const res = await getTopicMsg(topic, 2);
  }
};
// requires timer
export const getConfig = async (devIP) => {
  const testMqtt = await mqttConnectionTests(devIP);

  if (testMqtt > 0) {
    return mqttConnectionTestsErrorMsg;
  } else {
    const command = "Shelly.GetConfig";
    const topic = prefix + "/rpc";
    // console.log('Topic to subscribe:',topic)
    const ret = await publish(topic, command);
    const res = await getTopicMsg(topic, 2);
  }
};

const mqttConnectionTests = async (devIP) => {
  console.log("Connecting to device:", devIP);
  const devMqtt = await mqttStatus(devIP);

  if (!devMqtt) {
    console.log("Could not connect to device. Check device.");
    return 1;
  }

  console.log("Connecting to MQTT server:", BROKER_IP);
  const testMqtt = await mqttConnection(devIP, BROKER_IP);
  if (testMqtt > 0) {
    console.error(
      "Shelly device MQTT not connected - Check configuration - Error:",
      testMqtt
    );
    return 2;
  } else {
    prefix = await getTopicPrefix(devMqtt, devIP);
    return 0;
  }
};

const mqttConnection = async (SIP, BIP) => {
  const status = await mqttStatus(SIP);
  const connected = JSON.stringify(status.connected);
  if (!connected) {
    console.error(`Shelly device MQTT status ${connected}. Trying to enable.`);
    const reconnected = await mqttSetConfig(SIP, BIP);
    if (!reconnected.restart_required) return 1;
    else return 2;
  }
  return 0;
};

const getTopicPrefix = async (devMqtt, devIP) => {
  // console.log(devMqtt, devIP)
  let topic;

  if (devMqtt) {
    // if device is online, get the Topic_prefix
    topic = await mqttConfig(devIP);
  } else {
    // try to reconnect to broker
    const reconnected = await mqttSetConfig(devIP, BROKER_IP);
    // if device is online, get the Topic_prefix
    topic = await mqttConfig(devIP);
  }
  // return the Topic_prefix
  return topic;
};

const publish = async (topic, command) => {
  const message = `{"id":123, "src":"${prefix}", "method":"${command}"}`;
  // console.log(message)
  const client = mqtt.connect(`mqtt://${BROKER_IP}`);

  client.on("connect", () => {
    if (client.connected) {
      client.publish(topic, message, { qos: 1, retain: false }, (err) => {
        if (err) {
          return { statusCode: 400, message: err };
        }
      });
      return { statusCode: 200, message: `${topic} published` };
    }
  });

  client.on("error", function (error) {
    clientOnErrorMsg.errorMessage(error);
    return clientOnErrorMsg;
  });
};

const getTopicMsg = async (topic, collection) => {
  const client = mqtt.connect(`mqtt://${BROKER_IP}`);

  client.on("connect", () => {
    client.subscribe(topic, { qos: 1 });
  });

  client.on("message", async (topic, data) => {
    const obj1 = await JSON.parse(data.toString());
    let docObj = {};

    if (collection === 0) {
      try {
        docObj = { device: prefix, timestamp: Date.now(), online: obj1 };
      } catch (e) {
        console.log("ERROR", e);
      }
    }

    if (collection === 1) {
      // obj2 = obj1.params['switch:0']
      // console.log(obj2)
      try {
        docObj = {
          device: obj1.src,
          timestamp: obj1.params.ts,
          totalWattsConsumed: obj1.params["switch:0"].aenergy.total,
        };
      } catch (e) {
        console.log("ERROR", e);
      }
    }

    if (collection === 2) {
      // if(obj1){
      // obj3 = obj1.result.wifi;
      // obj2 = obj1.result['switch:0'];
      // }
      try {
        docObj = {
          device: obj1.src,
          timestamp: Date.now(),
          voltage: obj1.result["switch:0"].voltage,
          wifi: obj1.result.wifi.ssid,
          totalWattsConsumed: obj1.result["switch:0"].aenergy.total,
          deviceTempF: obj1.result["switch:0"].temperature.tF,
          deviceTempC: obj1.result["switch:0"].temperature.tC,
        };
      } catch (e) {
        console.log("ERROR", e);
      }
    }

    if (collection === 3) {
      console.log(obj1);
    }

    console.log(docObj);
    if (docObj) {
      let docDB = await mqttMsgToMongo(docObj, collection);
      return docDB;
    }
  });

  client.on("error", function (error) {
    clientOnErrorMsg.errorMessage(error);
    return clientOnErrorMsg;
  });
};

const mqttMsgToMongo = async (inputJson, collection) => {
  let col;
  try {
    return new Promise(async (resolve, reject) => {
      if (collection === 0) {
        col = await getDeviceOnlineCollection();
      }
      if (collection === 1) {
        col = await getDeviceEventsCollection();
      }
      if (collection === 2) {
        col = await getDeviceGetStatusCollection();
      }
      if (collection === 3) {
        col = await getDeviceGetConfigCollection();
      }
      const { insertedId } = await col.insertOne(inputJson);
      if (insertedId) {
        resolve({
          statusCode: 200,
          message: "Document created",
          insertedId: insertedId,
        });
      } else {
        reject({
          statusCode: 201,
          message: "Document not created in the Database",
        });
      }
    });
  } catch (e) {
    console.log(e.message);
  }
};

// To be used when th IP comes for de DB

// const devicesIP = async () => {
//   const col = await getDeviceCollection()
//   const ipArray = await col
//     .aggregate([{
//       $project: {
//         ip : "$ip"
//       }
//     }])
//     .toArray();
//     return ipArray
// }
