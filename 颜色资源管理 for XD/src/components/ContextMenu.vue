<template>
  <div class="context-menu" v-show="show" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "context-menu",
  props: {
    show: Boolean
  },
  computed: {
    style() {
      return {
        left: "0px",
        top: "0px"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.context-menu {
  z-index: 1000;
  display: block;
  position: absolute;
}
</style>