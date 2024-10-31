import Ikm from "../motor_logic/Ikm.js";
import Odometry from "../motor_logic/Odometry.js";
import Pose from "../motor_logic/Pose.js";

class Encoder {
    static angle1 = 315.0;
    static angle2 = 45.0;
    static DEG2RAD = 0.0174532925199432957;

    constructor(pose) {
        this.pose = pose;
    }

    inverseKinematicEncoder() {
        console.log(`Input enc x: ${this.pose.x}, y: ${this.pose.y}, th: ${this.pose.th}`);

        // Mengonversi sudut dari derajat ke radian
        const theta1 = Encoder.angle1 * Encoder.DEG2RAD;
        const theta2 = Encoder.angle2 * Encoder.DEG2RAD;

        // Menghitung kecepatan encoder berdasarkan sudut dinamis
        let enc1 = (this.pose.x * Math.cos(theta1) + this.pose.y * Math.sin(theta1));
        let enc2 = (this.pose.x * Math.cos(theta2) + this.pose.y * Math.sin(theta2));
        let th = this.pose.th;

        // Membulatkan nilai kecil ke nol untuk output yang lebih bersih
        enc1 = this.roundToZero(enc1);
        enc2 = this.roundToZero(enc2);

        console.log(`enc1: ${enc1}, enc2: ${enc2}`);

        // Mengembalikan objek encoder dengan nilai enc1 dan enc2
        return { enc_left: enc1, enc_right: enc2, th: th };
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

export default Encoder; // Ekspor kelas Encoder agar dapat digunakan di file lain