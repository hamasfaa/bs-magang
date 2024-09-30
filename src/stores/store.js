// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import ROSLIB from 'roslib';

export const useRobotStore = defineStore("robot", {
    state: () => ({
        ros: null,
        pc2bs: {
            pos_x: 0,
            pos_y: 0,
            pos_theta: 0,
            v_x: 0,
            v_y: 0,
            v_theta: 0,
            bola_x: 0,
            bola_y: 0,
        },
        bs2pc: {
            status: 0,
            tujuan_x: 0,
            tujuan_y: 0,
        },
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
                messageType: "pc2bs/Msg",
            });

            // buat publish
            this.bs2pc = new ROSLIB.Topic({
                ros: this.ros,
                name: "/bs2pc",
                messageType: "tes/BS2PC",
            });

            this.pc2bs.subscribe((message) => {
                this.pc2bs.pos_x = message.pos_x;
                this.pc2bs.pos_y = message.pos_y;
                this.pc2bs.pos_theta = message.pos_theta;
                this.pc2bs.v_x = message.v_x;
                this.pc2bs.v_y = message.v_y;
                this.pc2bs.v_theta = message.v_theta;
                this.pc2bs.bola_x = message.bola_x;
                this.pc2bs.bola_y = message.bola_y;
                console.log('Received message on ' + this.pc2bs.name + ': ', message);
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