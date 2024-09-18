<template>
  <!-- <router-view> </router-view> -->
  <div>
    <input type="text" v-model="message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import ROSLIB from "roslib";
import { useRobotStore } from "./stores/store";

export default {
  data() {
    return {
      ros: null,
      talker: null,
      message: "",
    };
  },
  created() {
    this.ros = new ROSLIB.Ros({
      url: "ws://localhost:9090",
    });

    this.ros.on("connection", () => {
      console.log("Connected to websocket server.");
    });

    this.ros.on("error", (error) => {
      console.log("Error connecting to websocket server: ", error);
    });

    this.ros.on("close", () => {
      console.log("Connection to websocket server closed.");
    });

    this.listener = new ROSLIB.Topic({
      ros: this.ros,
      name: "/pc2bs",
      messageType: "std_msgs/String",
    });

    this.listener.subscribe((message) => {
      console.log(
        "Received message on " + this.listener.name + ": " + message.data
      );
    });

    this.talker = new ROSLIB.Topic({
      ros: this.ros,
      name: "/bs2pc",
      messageType: "std_msgs/String",
    });
  },
  methods: {
    sendMessage() {
      var str = new ROSLIB.Message({
        data: this.message,
      });
      this.talker.publish(str);
    },
  },
};
</script>
