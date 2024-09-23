<template lang="">
  <div class="flex flex-col items-center space-y-6">
    <div class="grid grid-cols-2 gap-4">
      <button
        v-for="num in [1, 2, 3, 4]"
        :key="num"
        @click="selectMessage(num)"
        :class="{
          'w-16 h-16 text-white rounded-full shadow-lg transition-transform duration-300 focus:outline-none': true,
          'bg-blue-500 hover:scale-105 hover:bg-blue-600 active:bg-blue-700':
            selectedMessage !== num,
          'bg-yellow-500': selectedMessage === num,
        }"
      >
        {{ num }}
      </button>
    </div>

    <button
      @click="sendMessage"
      class="w-32 h-12 bg-green-500 text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none active:bg-green-700"
    >
      SEND
    </button>

    <p class="text-lg font-semibold">Received message: {{ receivedMessage }}</p>

    <div
      v-if="robotStore.connected"
      class="w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
    >
      <span class="text-white text-lg">Online</span>
    </div>
    <div
      v-else
      class="w-16 h-16 bg-red-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
    >
      <span class="text-white text-lg">Offline</span>
    </div>
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
      selectedMessage: null,
    };
  },
  computed: {
    receivedMessage() {
      return this.robotStore.receivedMessage;
    },
    connected() {
      return this.robotStore.connected;
    },
  },
  methods: {
    selectMessage(message) {
      this.selectedMessage = message;
    },
    sendMessage() {
      if (this.selectedMessage !== null) {
        this.robotStore.updateMessage(this.selectedMessage);
        this.robotStore.sendMessage();
      }
    },
  },
};
</script>
<style lang=""></style>
