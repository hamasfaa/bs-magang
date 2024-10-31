class Odometry {
    constructor(enc_left, enc_right, th) {
        this.enc_left = enc_left;
        this.enc_right = enc_right;
        this.th = th;
    }
}


export default Odometry; // Ekspor kelas Odometry agar dapat digunakan di file lain