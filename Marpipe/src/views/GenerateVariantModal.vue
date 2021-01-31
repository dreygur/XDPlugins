<template>
  <dialog>
    <div class="generate-dialog-container">
      <div class="flex items-center dialog-header">
        <IconBase icon="green-check-circle" class="w-4 h-4 mr-2" />
        <span>{{ title }}</span>
      </div>
      <div class="dialog-section-divider"></div>
      <div class="dialog-content">
        <div>Please zoom out your canvas to check your artboard variants.</div>
        <div class="text-red-400" v-show="errorMessage !== ''">{{ errorMessage }}</div>
      </div>

      <footer class="dialog-btn-container">
        <button uxp-variant="cta" @click="close()">View</button>
      </footer>
    </div>
  </dialog>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "GenerateVariantModal",
  components: {
    IconBase
  },
  props: {
    dialog: {},
    variantCount: Number,
    errorMessage: {
      type: String,
      default: ""
    }
  },
  computed: {
    title() {
      return this.variantCount === 1
        ? `${this.variantCount} Variant Generated Successfully`
        : `${this.variantCount} Variants Generated Successfully`;
    }
  },
  methods: {
    close() {
      this.dialog.close();
    }
  }
};
</script>

<style scoped>
.generate-dialog-container {
  width: 370px;
}
</style>