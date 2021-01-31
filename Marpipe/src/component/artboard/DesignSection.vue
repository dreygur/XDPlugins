<template>
  <div>
    <div class="section-title font-regular text-3xs mb-1 tracking-widest">DESIGN</div>
    <div class="design-list">
      <div
        v-for="(design, designIdx) in designs"
        :key="design.mappedArtboardNode.guid"
        class="artboard-mockup"
      >
        <div class="unlink-design-container">
          <IconBase class="unlink-icon" icon="unlink" @click.native="removeDesign(designIdx)" />
        </div>
        <ArtboardMockup :artboard="design.mappedArtboardNode" :artworks="design.mappedNodes" />
        <div
          class="artboard-name"
          :title="design.mappedArtboardNode.name"
        >{{ design.mappedArtboardNode.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArtboardMockup from "@/component/artboard/ArtboardMockup.vue";
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "DesignSection",
  components: {
    ArtboardMockup,
    IconBase
  },
  computed: {
    ...mapGetters(["designs"])
  },
  methods: {
    removeDesign(designIdx) {
      this.$store.dispatch("removeDesign", designIdx);
    }
  }
};
</script>

<style scoped>
.design-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.1rem;
}

.unlink-design-container {
  width: 100px;
  display: flex;
  justify-content: flex-end;
}

.unlink-icon {
  width: 0.75rem;
  height: 0.75rem;
  cursor: pointer;
}

.artboard-mockup {
  margin-bottom: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.artboard-name {
  margin-top: 0.75rem;
  width: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: #666666;
}
</style>
