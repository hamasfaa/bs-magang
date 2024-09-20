<template>
  <v-stage ref="stage" :config="stageSize" @click="moveTarget">
    <v-layer ref="layer">
      <v-image
        :config="{
          image: image,
        }"
      />
      <v-image :config="RobotConfig" />
      <v-image :config="TargetConfig" />
    </v-layer>
  </v-stage>
</template>
<script>
import LAPANGAN from "@/assets/Lapangan.png";
import ROBOT from "@/assets/Model_Robot/blue.png";
import TARGET from "@/assets/red_dot-1.png";
import { Animation } from "konva";

let panjangLapangan = 1016;
let tinggiLapangan = 716;

export default {
  data() {
    return {
      LAPANGAN,
      ROBOT,
      TARGET,
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
        //get the robot to the right cordinate
        offset: {
          x: 40,
          y: 40,
        },
        // stroke: "red",
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
        // stroke: "red",
      },
    };
  },
  created() {
    const image = new window.Image();
    image.src = LAPANGAN;
    image.onload = () => {
      this.image = image;
    };

    const robotImage = new window.Image();
    robotImage.src = ROBOT;
    this.RobotConfig.image = robotImage;

    const targetImage = new window.Image();
    targetImage.src = TARGET;
    this.TargetConfig.image = targetImage;
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
    },
  },
  mounted() {
    window.addEventListener("keydown", this.gerak);

    new Animation(() => {
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
    }).start();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.gerak);
  },
};
</script>
