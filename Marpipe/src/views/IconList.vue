<template>
  <div class="flex flex-col items-center">
    <div v-for="(icon, idx) in iconList" :key="idx" class="mb-2 flex items-center icon-name">
      <IconBase :icon="icon" class="w-6 h-6" />
      {{ icon }}
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

let iconList = [
  "image",
  "text",
  "combo",
  "combo-blue",
  "active-add-circle",
  "inactive-add-circle",
  "plus",
  "minus",
  "link",
  "unlink",
  "triangle-point-right",
  "triangle-point-down",
  "pencil",
  "upload",
  "eye"
];

export default {
  name: "IconList",
  components: {
    IconBase
  },
  data() {
    return {
      iconList: iconList
    };
  }
};
</script>

<style scoped>
.icon-name {
  font-size: 0.7rem;
}
</style>