<template lang="">
  <div
    class="flex flex-col items-center space-y-10 p-6 bg-gray-50 rounded-lg shadow-lg"
  >
    <div class="flex space-x-6 items-center">
      <div
        v-if="robotStore.connected"
        class="w-40 h-12 bg-green-600 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <span class="text-white text-2xl font-bold">Online</span>
      </div>
      <div
        v-else
        class="w-40 h-12 bg-red-600 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <span class="text-white text-2xl font-bold">Offline</span>
      </div>

      <div
        class="w-40 h-12 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <span class="text-2xl font-bold">{{ robotStore.message }}</span>
      </div>

      <div
        class="w-40 h-12 bg-orange-600 hover:scale-105 hover:bg-orange-700 active:bg-orange-800 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <span class="text-white text-2xl font-bold" @click="refreshPage">
          Refresh
        </span>
      </div>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-700">
        Robot Data
      </h2>

      <div class="space-y-6 text-gray-600">
        <div class="flex flex-col">
          <h3 class="font-bold text-xl text-gray-700">Posisi:</h3>
          <p class="text-lg">
            X:
            <span class="font-medium">{{ robotStore.robot.pos_x }}</span>
          </p>
          <p class="text-lg">
            Y:
            <span class="font-medium">{{ robotStore.robot.pos_y }}</span>
          </p>
          <p class="text-lg">
            Θ (Theta):
            <span class="font-medium">{{ robotStore.robot.pos_theta }}</span>
          </p>
        </div>

        <div class="flex flex-col">
          <h3 class="font-bold text-xl text-gray-700">Posisi Bola:</h3>
          <p class="text-lg">
            X:
            <span class="font-medium">{{ robotStore.pc2bs.bola_x }}</span>
          </p>
          <p class="text-lg">
            Y:
            <span class="font-medium">{{ robotStore.pc2bs.bola_y }}</span>
          </p>
        </div>

        <div class="flex flex-col">
          <h3 class="font-bold text-xl text-gray-700">Kecepatan:</h3>
          <p class="text-lg">
            X: <span class="font-medium">{{ robotStore.robot.vx }}</span>
          </p>
          <p class="text-lg">
            Y: <span class="font-medium">{{ robotStore.robot.vy }}</span>
          </p>
          <p class="text-lg">
            Θ (Theta):
            <span class="font-medium">{{ robotStore.robot.vth }}</span>
          </p>
        </div>

        <div class="flex flex-col">
          <h3 class="font-bold text-xl text-gray-700">Posisi Tujuan:</h3>
          <p class="text-lg">
            X: <span class="font-medium">{{ robotStore.bs2pc.tujuan_x }}</span>
          </p>
          <p class="text-lg">
            Y: <span class="font-medium">{{ robotStore.bs2pc.tujuan_y }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <button
        v-for="num in [1, 2, 3, 4]"
        :key="num"
        @click="selectMessage(num)"
        :class="{
          'w-24 h-14 text-white rounded-lg shadow-lg transition-transform duration-300 focus:outline-none': true,
          'bg-blue-600 hover:scale-105 hover:bg-blue-700 active:bg-blue-800':
            selectedMessage !== num,
          'bg-yellow-500': selectedMessage === num,
        }"
      >
        <span class="text-xl">{{ num }}</span>
      </button>
    </div>

    <button
      @click="sendMessage"
      class="w-40 h-14 bg-emerald-600 text-white font-bold text-xl rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-emerald-700 focus:outline-none active:bg-emerald-800"
    >
      Send Message
    </button>
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
      if ([1, 2, 4].includes(message)) {
        this.robotStore.updateKoordinat(0, 0);
      }
    },
    sendMessage() {
      if (this.selectedMessage !== null) {
        this.robotStore.updateMessage(this.selectedMessage);
        this.robotStore.sendMessage();
      }
    },
    refreshPage() {
      location.reload();
    },
  },
};
</script>
<style lang=""></style>
