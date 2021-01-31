<template>
  <div>
    <ChromePicker v-model="colors"></ChromePicker>
  </div>
</template>

<script>
import { Chrome, Sketch, Photoshop } from "vue-color";

export default {
  props: {},
  data() {
    return {
      colors: {
        hex: "#194d33",
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      }
    };
  },
  components: {
    ChromePicker: Photoshop
  },
  methods: {}
};
</script>
