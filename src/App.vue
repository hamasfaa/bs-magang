<template>
  <router-view></router-view>
</template>

<script>
import { useRobotStore } from "./stores/store";

export default {
  setup() {
    const robotStore = useRobotStore();

    return {
      robotStore,
    };
  },

  created() {
    this.robotStore.initializeROS();
    this.robotStore.resetDataRobot();
  },
};
</script>
