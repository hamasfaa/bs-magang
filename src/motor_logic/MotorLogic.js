import Ikm from "../motor_logic/Ikm.js";
import Fkm from "../motor_logic/Fkm.js";
import Encoder from "../motor_logic/Encoder.js";

class MotorLogic {
    static angle1 = 0.0;
    static angle2 = 120.0;
    static angle3 = 240.0;
    static DEG2RAD = 0.0174532925199432957;

    constructor(fkm) {
        this.fkm = fkm
        // this.Ikm = new Ikm(this.motor1, this.motor2, this.motor3);
    }

    forwardKinematic() {
        const theta1 = MotorLogic.angle1 * MotorLogic.DEG2RAD;
        const theta2 = MotorLogic.angle2 * MotorLogic.DEG2RAD;
        const theta3 = MotorLogic.angle3 * MotorLogic.DEG2RAD;

        const vx = (2.0 / 3.0) * (this.fkm.motor1 * Math.cos(theta1) + this.fkm.motor2 * Math.cos(theta2) + this.fkm.motor3 * Math.cos(theta3));
        const vy = (2.0 / 3.0) * (this.fkm.motor1 * Math.sin(theta1) + this.fkm.motor2 * Math.sin(theta2) + this.fkm.motor3 * Math.sin(theta3));
        const vth = (this.fkm.motor1 + this.fkm.motor2 + this.fkm.motor3) / 3.0;

        const roundedVx = this.roundToZero(vx);
        const roundedVy = this.roundToZero(vy);
        const roundedVth = this.roundToZero(vth);

        console.log(`output vx: ${roundedVx}, vy: ${roundedVy}, vth: ${roundedVth}`);

        // Mengembalikan objek ikm
        return { vx: roundedVx, vy: roundedVy, vth: roundedVth };
    }

    // Fungsi inverseKinematic
    inverseKinematic(ikm) {
        console.log(`input vx: ${ikm.vx}, vy: ${ikm.vy}, vth: ${ikm.vth}`);

        // Mengonversi sudut dari derajat ke radian
        const theta1 = MotorLogic.angle1 * MotorLogic.DEG2RAD;
        const theta2 = MotorLogic.angle2 * MotorLogic.DEG2RAD;
        const theta3 = MotorLogic.angle3 * MotorLogic.DEG2RAD;

        // Menghitung kecepatan motor berdasarkan sudut dinamis
        let motor1 = ikm.vx * Math.cos(theta1) + ikm.vy * Math.sin(theta1) + ikm.vth;
        let motor2 = ikm.vx * Math.cos(theta2) + ikm.vy * Math.sin(theta2) + ikm.vth;
        let motor3 = ikm.vx * Math.cos(theta3) + ikm.vy * Math.sin(theta3) + ikm.vth;

        // Membulatkan nilai kecil ke nol untuk output yang lebih bersih
        motor1 = this.roundToZero(motor1);
        motor2 = this.roundToZero(motor2);
        motor3 = this.roundToZero(motor3);

        console.log(`motor1: ${motor1}, motor2: ${motor2}, motor3: ${motor3}`);

        // Mengembalikan objek fkm dengan nilai motor1, motor2, dan motor3
        return { motor1, motor2, motor3 };
    }


    roundToZero(value, threshold = 1e-5) {
        // Jika nilai absolut kurang dari threshold, kembalikan 0
        if (Math.abs(value) < threshold) {
            return 0;
        }

        // Pembulatan ke angka bulat terdekat
        return Math.round(value * 1e6) / 1e6; // Pembulatan hingga 7 desimal
    }

}

export default MotorLogic;