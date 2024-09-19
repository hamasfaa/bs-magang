// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import ROSLIB from 'roslib';

export const useRobotStore = defineStore("robot", {
    state: () => ({
        ros: null,
        bs2pc: null,
        pc2bs: null,
        message: 0,
        receivedMessage: "",
    }),

    actions: {
        initializeROS() {
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

            //buat subscribe
            this.pc2bs = new ROSLIB.Topic({
                ros: this.ros,
                name: "/pc2bs",
                messageType: "std_msgs/String",
            });

            // buat publish
            this.bs2pc = new ROSLIB.Topic({
                ros: this.ros,
                name: "/bs2pc",
                messageType: "tes/BS2PC",
            });

            this.pc2bs.subscribe((message) => {
                this.receivedMessage = message.data;
                console.log('Received message on ' + this.pc2bs.name + ': ' + message.data);
            });
        },

        sendMessage() {
            if (this.bs2pc) {
                const message = new ROSLIB.Message({
                    status: this.message
                });
                this.bs2pc.publish(message);
                console.log('Sending message on ' + this.bs2pc.name + ': ' + message.status);
            }
        },

        updateMessage(newMessage) {
            this.message = newMessage
        }
    },
});
