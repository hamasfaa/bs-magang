// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useRobotStore = defineStore("robot", {
    state: () => {
        return {
            bs2pc: "",
        };
    },
    actions: {
        setbs2pc(bs2pc) {
            this.bs2pc = "kosong";
        },
    },
});
