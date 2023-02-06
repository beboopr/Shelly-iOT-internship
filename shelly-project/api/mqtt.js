import mqtt from "mqtt"

const subTst = '#'
const subTopic1 = 'shellyplus1pm-a8032ab9c910/online'      // no need to manually pub
const subTopic2 = 'shellyplus1pm-a8032ab9c910/events/rpc' // no need to manually pub

const subTopic3 = 'shellyplus1p-Shelly-GetStatus/rpc'
const subTopic4 = 'shellyplus1p-Switch-Set/rpc'
const subTopic5 = 'shellyplus1p-Switch-Toggle/rpc'

// const topicList = [subTst]
const topicList = [subTopic2]
// const topicList = [subTopic1,subTopic2,subTopic3,subTopic4,subTopic5]

const client = mqtt.connect('mqtt://192.168.15.226:2022')

if(client.connected){
    console.error('problem connecting')
    client.on("error",function(error){
        console.log("Can't connect" + error);
        process.exit(1)
    });
} else {

    client.on('connect', () => {
        client.subscribe(topicList,{qos:1})
    })
    
    client.on('message',async (topic, data) => {
        console.log(data.toString())
        // let deviceData = data.toString();
        // let funRes = await mqttMsgToMongo(JSON.parse(deviceData));
        // console.log(funRes)
    })

}

// export MQTT_SERVER="192.168.15.226"
// export MQTT_PORT=2022
// export SHELLY_ID="shellypro4pm-f008d1d8b8b8" # The <shelly-id> of your device
// mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t ${SHELLY_ID}/events/rpc


