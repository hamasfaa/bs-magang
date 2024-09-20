// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import ROSLIB from 'roslib';

export const useRobotStore = defineStore("robot", {
    state: () => ({
        ros: null,
        bs2pc: {
            status: 0,
            tujuan_x: 0,
            tujuan_y: 0,
        },
        pc2bs: null,
        message: 0,
        x: 0,
        y: 0,
        receivedMessage: "",
        connected: false,
    }),

    actions: {
        initializeROS() {
            this.ros = new ROSLIB.Ros({
                url: "ws://localhost:9090",
            });

            this.ros.on("connection", () => {
                console.log("Connected to websocket server.");
                this.connected = true;
            });

            this.ros.on("error", (error) => {
                console.log("Error connecting to websocket server: ", error);
                this.connected = false;
            });

            this.ros.on("close", () => {
                console.log("Connection to websocket server closed.");
                this.connected = false
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
                this.bs2pc.status = this.message;
                this.bs2pc.tujuan_x = this.x;
                this.bs2pc.tujuan_y = this.y;
                const message = new ROSLIB.Message({
                    status: this.bs2pc.status,
                    tujuan_x: this.bs2pc.tujuan_x,
                    tujuan_y: this.bs2pc.tujuan_y,
                });
                this.bs2pc.publish(message);
                console.log('Sending message on ' + this.bs2pc.name + ': ' + "STATUS" + message.status + "KOORDINAT" + message.tujuan_x + "," + message.tujuan_y);
            }
        },

        updateMessage(newMessage) {
            this.message = newMessage
        },

        updateKoordinat(newX, newY) {
            this.x = newX
            this.y = newY
        }
    },
});
