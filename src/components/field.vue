<template>
  <div class="flex basis-2/3 border items-center justify-center">
    <v-stage ref="stage" :config="stageSize" @click="moveTarget">
      <v-layer ref="layer">
        <v-image
          :config="{
            image: image,
          }"
        />
        <v-image :config="RobotConfig" />
        <v-image v-if="targetVisible" :config="TargetConfig" />
        <v-image
          v-if="ballVisible && !ballAndRobotOverlap"
          :config="BallConfig"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import LAPANGAN from "@/assets/Lapangan.png";
import ROBOT from "@/assets/Model_Robot/blue.png";
import TARGET from "@/assets/red_dot-1.png";
import BALL from "@/assets/Model_Robot/bola_biru.png";
import BALLROBOT from "@/assets/Model_Robot/blue1_ball.png";
import { Animation } from "konva";
import { useRobotStore } from "../stores/store";

let panjangLapangan = 1016;
let tinggiLapangan = 716;

export default {
  setup() {
    const robotStore = useRobotStore();

    return {
      robotStore,
    };
  },
  data() {
    return {
      LAPANGAN,
      ROBOT,
      TARGET,
      BALL,
      BALLROBOT,
      stageSize: {
        width: panjangLapangan,
        height: tinggiLapangan,
      },
      image: null,
      arah: null,
      RobotConfig: {
        image: null,
        x: 60,
        y: 60,
        rotation: 0,
        offset: {
          x: 40,
          y: 40,
        },
      },
      TargetConfig: {
        image: null,
        x: 60,
        y: 60,
        width: 50,
        height: 50,
        offset: {
          x: 25,
          y: 25,
        },
      },
      BallConfig: {
        image: null,
        x: 100,
        y: 100,
        width: 25,
        height: 25,
        offset: {
          x: 12.5,
          y: 12.5,
        },
      },
    };
  },
  computed: {
    ballVisible() {
      return [1, 2, 4].includes(this.robotStore.message);
    },
    targetVisible() {
      return this.robotStore.message === 3;
    },
    robotImage() {
      if (this.ballAndRobotOverlap) {
        return this.BALLROBOT;
      }
      return this.ROBOT;
    },
    ballAndRobotOverlap() {
      return (
        this.RobotConfig.x === this.BallConfig.x &&
        this.RobotConfig.y === this.BallConfig.y
      );
    },
  },
  watch: {
    robotImage(newImage) {
      const robotImage = new window.Image();
      robotImage.src = newImage;
      robotImage.onload = () => {
        this.RobotConfig.image = robotImage;
      };
    },
  },
  created() {
    const image = new window.Image();
    image.src = LAPANGAN;
    image.onload = () => {
      this.image = image;
    };

    const robotImage = new window.Image();
    robotImage.src = this.robotImage;
    robotImage.onload = () => {
      this.RobotConfig.image = robotImage;
    };

    const targetImage = new window.Image();
    targetImage.src = TARGET;
    this.TargetConfig.image = targetImage;

    const ballImage = new window.Image();
    ballImage.src = BALL;
    ballImage.onload = () => {
      this.BallConfig.image = ballImage;
    };
  },
  methods: {
    gerak(e) {
      const key = e.key.toLowerCase();
      switch (key) {
        case "w":
          this.arah = "up";
          break;
        case "a":
          this.arah = "left";
          break;
        case "s":
          this.arah = "down";
          break;
        case "d":
          this.arah = "right";
          break;
        case "q":
          this.arah = "rotateLeft";
          break;
        case "e":
          this.arah = "rotateRight";
          break;
        case " ":
          this.arah = null;
          break;
        default:
          break;
      }
    },
    moveTarget(e) {
      this.TargetConfig.x = e.evt.layerX;
      this.TargetConfig.y = e.evt.layerY;

      this.robotStore.updateKoordinat(this.TargetConfig.x, this.TargetConfig.y);
      this.robotStore.sendMessage();
    },
  },
  mounted() {
    window.addEventListener("keydown", this.gerak);

    new Animation(() => {
      if (this.robotStore.message === 1) {
        this.RobotConfig.x = this.robotStore.pc2bs.pos_x;
        this.RobotConfig.y = this.robotStore.pc2bs.pos_y;
        this.RobotConfig.rotation = this.robotStore.pc2bs.pos_theta;
        this.BallConfig.x = this.robotStore.pc2bs.bola_x;
        this.BallConfig.y = this.robotStore.pc2bs.bola_y;
      } else {
        switch (this.arah) {
          case "up":
            this.RobotConfig.y -= 1;
            break;
          case "left":
            this.RobotConfig.x -= 1;
            break;
          case "down":
            this.RobotConfig.y += 1;
            break;
          case "right":
            this.RobotConfig.x += 1;
            break;
          case "rotateLeft":
            this.RobotConfig.rotation -= 1;
            break;
          case "rotateRight":
            this.RobotConfig.rotation += 1;
            break;
        }
      }
    }).start();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.gerak);
  },
};
</script>

<style lang=""></style>
