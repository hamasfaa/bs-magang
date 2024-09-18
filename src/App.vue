<template>
  <div>
    <input type="text" v-model="message" />
    <button @click="sendMessage">Send</button>

    <p>Received message: {{ receivedMessage }}</p>
  </div>
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

  data() {
    return {
      message: "",
    };
  },
  computed: {
    receivedMessage() {
      return this.robotStore.receivedMessage;
    },
  },
  methods: {
    sendMessage() {
      this.robotStore.updateMessage(this.message);
      this.robotStore.sendMessage();
    },
  },
  created() {
    this.robotStore.initializeROS();
  },
  watch: {
    message(newValue) {
      this.robotStore.updateMessage(newValue);
    },
  },
};
</script>
