<template lang="">
  <div>
    <button @click="sendMessage(1)">1</button>
    <button @click="sendMessage(2)">2</button>
    <button @click="sendMessage(3)">3</button>
    <button @click="sendMessage(4)">4</button>

    <p>Received message: {{ receivedMessage }}</p>
  </div>
</template>
<script>
import { useRobotStore } from "../stores/store";

export default {
  setup() {
    const robotStore = useRobotStore();

    return {
      robotStore,
    };
  },

  data() {
    return {
      message: 0,
    };
  },
  computed: {
    receivedMessage() {
      return this.robotStore.receivedMessage;
    },
  },
  methods: {
    sendMessage(message) {
      this.robotStore.updateMessage(message);
      this.robotStore.sendMessage();
    },
  },
  watch: {
    message(newValue) {
      this.robotStore.updateMessage(newValue);
    },
  },
};
</script>
<style lang=""></style>
