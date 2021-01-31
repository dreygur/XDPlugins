<template>
  <div>
    <!-- HELP -->
    <div class="flex items-center">
      <img src="src/asset/images/temp_icons/Help.png" class="w-3 h-3 mr-1 cursor-pointer" @click="$router.push({path: 'help'})"/>
      <span class="font-bold text-sm cursor-pointer" @click="$router.push({path: 'help'})">Help</span>
    </div>
    <div class="panel-section-divider" />

    <!-- ACCOUNT SELECT -->
    <AccountSelect />
    <div class="panel-section-divider" />

    <!-- EMPTY STATE -->
    <EmptyExperimentState v-if="!isInExperiment" />

    <!-- DESIGN SECTION -->
    <DesignSection v-if="isInExperiment" class="mb-4" />
    <div v-if="isInExperiment" class="panel-section-divider" />

    <!-- VARIANT SECTION -->
    <VariantSection v-if="isInExperiment" :addVariantListAllow="isMappableNode" class="mb-10" />

    <!-- GENERATE AND RESET BUTTONS -->
    <div v-if="isInExperiment" class="experiment-btn-wrapper w-full flex flex-col items-center">
      <button
        v-if="isInExperiment"
        uxp-variant="cta"
        @click="generateExperiment();"
        :disabled="totalArtboardVariantCount === 0 ? true : false"
        class="w-fit"
      >{{ generateBtnText }}</button>

      <button
        v-if="totalVariantListCount>0"
        uxp-variant="warning"
        @click="openResetExperimentModal()"
        class="w-fit"
      >Reset</button>

      <!-- <button
        uxp-variant="cta"
        @click="$router.push('/help')"
        class="w-fit"
      >Help</button> -->
    </div>

    <!-- MODALs -->
    <GenerateVariantModal
      v-show="totalArtboardVariantCount > 0"
      ref="generateVariantModal"
      :dialog="generateVariantModal"
      :variantCount="successfulVariantCount"
      :errorMessage="errorMessage"
    />

    <ResetExperimentModal
      v-show="renderResetExperimentModal"
      ref="resetExperimentModal"
      :dialog="resetExperimentModal"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import AccountSelect from "@/component/account/AccountSelect.vue";
import EmptyExperimentState from "@/component/EmptyExperimentState.vue";
import DesignSection from "@/component/artboard/DesignSection.vue";
import VariantSection from "@/component/variant/VariantSection.vue";
import GenerateVariantModal from "@/views/GenerateVariantModal.vue";
import ResetExperimentModal from "@/views/ResetExperimentModal.vue";
import GenerateVariant from "@/utils/GenerateVariant.js";
import Experiment from "@/utils/Experiment.js";

export default {
  name: "ExperimentPanel",
  mixins: [Experiment, GenerateVariant],
  components: {
    AccountSelect,
    EmptyExperimentState,
    DesignSection,
    VariantSection,
    GenerateVariantModal,
    ResetExperimentModal
  },
  data() {
    return {
      renderResetExperimentModal: false,
      resetExperimentModal: null
    };
  },
  computed: {
    ...mapGetters([
      "updateFlag",
      "selection",
      "groupVariantLists",
      "copyVariantLists",
      "imageVariantLists",
      "isMappableNode",
      "variantCountFlag",
      "mapFlag"
    ]),
    totalVariantListCount() {
      return (
        this.imageVariantLists.length +
        this.copyVariantLists.length +
        this.groupVariantLists.length
      );
    },
    isInExperiment() {
      return this.totalVariantListCount > 0 || this.isMappableNode;
    },
    generateBtnText() {
      if (this.totalArtboardVariantCount === 0) {
        return `Generate`;
      } else if (this.totalArtboardVariantCount === 1) {
        return `Generate 1 Variant`;
      } else {
        return `Generate ${this.totalArtboardVariantCount} Variants`;
      }
    }
  },
  watch: {
    mapFlag() {
      this.updateTotalArtboardVariantCount();
    },
    variantCountFlag() {
      this.updateTotalArtboardVariantCount();
    }
  },
  methods: {
    openResetExperimentModal() {
      this.renderResetExperimentModal = true;

      Vue.nextTick(async () => {
        this.resetExperimentModal = this.$refs.resetExperimentModal.$el;
        if (!this.$refs.resetExperimentModal.$el.open) {
          await this.$refs.resetExperimentModal.$el.showModal().then(() => {
            this.renderResetExperimentModal = false;
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.experiment-btn-wrapper {
  border-top: 1px solid #dedede;
  width: 100%;
}
</style>