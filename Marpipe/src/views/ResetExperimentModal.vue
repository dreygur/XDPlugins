<template>
  <dialog>
    <div class="reset-dialog-container">
      <div class="dialog-header">Reset Experiment</div>
      <div class="dialog-section-divider"></div>
      <div
        class="dialog-content"
      >All your assets and linked designs will be cleared out. You can currently find your previous assets in your asset library on Marpipe Web App.</div>
      <footer class="dialog-btn-footer-container">
        <button uxp-variant="secondary" @click="close()">Cancel</button>
        <button uxp-variant="warning" @click="resetExperiment()">Reset</button>
      </footer>
    </div>
  </dialog>
</template>

<script>
export default {
  name: "ResetExperimentModal",
  props: {
    dialog: {}
  },
  methods: {
    close() {
      this.dialog.close();
    },
    resetExperiment() {
      this.$store.dispatch("removeAllDesign");
      this.$store.dispatch("resetImages");
      this.$store.dispatch("resetCopies");
      this.$store.dispatch("resetGroupVariants");
      this.$store.dispatch("setMapFlag");
      this.$store.dispatch("setVariantCountFlag");
      this.close();
    }
  }
};
</script>

<style scoped>
.reset-dialog-container {
  width: 370px;
}
</style>