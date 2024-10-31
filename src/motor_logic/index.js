import MotorLogic from "../motor_logic/MotorLogic.js";
import Fkm from "../motor_logic/Fkm.js";
import Encoder from "../motor_logic/Encoder.js";
import Pose from "../motor_logic/Pose.js";

let pose = new Pose(0.000000, 100, 0.000000);
let fkm = new Fkm(0.000000, 86.602540, -86.602540);


// let fkm2 = new Fkm(100.000000, -50.000000, -50.000000)
let logic1 = new MotorLogic(fkm)
let enc = new Encoder(pose);


// let masuk = logic1.forwardKinematic(fkm);
let output = logic1.inverseKinematic(masuk);
// // let encod = enc.inverseKinematicEncoder(masuk);


let output_encoder = enc.inverseKinematicEncoder(pose);

