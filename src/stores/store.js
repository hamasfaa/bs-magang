// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import ROSLIB from 'roslib';
import MotorLogic from '@/motor_logic/MotorLogic.js';
import Fkm from '@/motor_logic/Fkm';
import Encoder from '@/motor_logic/Encoder';

export const useRobotStore = defineStore("robot", {
    state: () => ({
        ros: null,
        robot: {
            vx: 0,
            vy: 0,
            vth: 0,
            pos_x: 0,
            pos_y: 0,
            pos_theta: 0,
        },
        pc2bs: {
            bola_x: 0,
            bola_y: 0,
            motor1: 0,
            motor2: 0,
            motor3: 0,
        },
        bs2pc: {
            status: 0,
            tujuan_x: 0,
            tujuan_y: 0,
            enc_left: 0,
            enc_right: 0,
            th: 0,
        },
        message: 0,
        x: 0,
        y: 0,
        receivedMessage: "",
        connected: false,
        alpha: 0,
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
                messageType: "FP_Magang/PC2BS",
            });

            // buat publish
            this.bs2pc = new ROSLIB.Topic({
                ros: this.ros,
                name: "/bs2pc",
                messageType: "FP_Magang/BS2PC",
            });

            this.pc2bs.subscribe((message) => {
                this.pc2bs.motor1 = message.motor1;
                this.pc2bs.motor2 = message.motor2;
                this.pc2bs.motor3 = message.motor3;
                this.pc2bs.bola_x = message.bola_x;
                this.pc2bs.bola_y = message.bola_y;
                this.receiveProcess();
            });

            this.randomNumber();

        },
        receiveProcess() {
            let fkm = new Fkm(this.pc2bs.motor1, this.pc2bs.motor2, this.pc2bs.motor3)
            let logic = new MotorLogic(fkm);
            let encoder = new Encoder({ x: this.robot.pos_x, y: this.robot.pos_y, th: this.robot.pos_theta });
            let fowardOoutput = logic.forwardKinematic();
            let endcoderOutput = encoder.inverseKinematicEncoder();

            this.robot.vx = fowardOoutput.vx;
            this.robot.vy = fowardOoutput.vy;
            this.robot.vth = fowardOoutput.vth;

            this.robot.pos_x += (this.robot.vx / 50) * this.alpha;
            this.robot.pos_y += (this.robot.vy / 50) * this.alpha;
            this.robot.pos_theta += (this.robot.vth / 50) * this.alpha;

            this.bs2pc.enc_left = endcoderOutput.enc_left;
            this.bs2pc.enc_right = endcoderOutput.enc_right;
            this.bs2pc.th = endcoderOutput.th;

            //sendMessage
            this.sendMessage();
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
                    enc_left: this.bs2pc.enc_left,
                    enc_right: this.bs2pc.enc_right,
                    th: this.bs2pc.th,
                });
                // console.log(this.bs);
                this.bs2pc.publish(message);
            }
        },

        updateMessage(newMessage) {
            this.message = newMessage
        },

        updateKoordinat(newX, newY) {
            this.x = newX
            this.y = newY
        },

        resetDataRobot() {
            this.robot.pos_x = 0;
            this.robot.pos_y = 0;
            this.robot.pos_theta = 0;
            this.robot.v_x = 0;
            this.robot.v_y = 0;
            this.robot.v_theta = 0;
            this.pc2bs.bola_x = 0;
            this.pc2bs.bola_y = 0;
            this.bs2pc.tujuan_x = 0;
            // this.
        },
        randomNumber() {
            const min = 0.8;
            const max = 1.2;
            this.alpha = Math.random() * (max - min) + min;
        }
    },
});