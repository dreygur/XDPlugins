<template>
  <section>
    <div
      class="flex items-center flex-no-wrap justify-between"
      @click.stop="rename = false"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="flex items-center">
        <IconBase
          :icon="open? 'triangle-point-down' : 'triangle-point-right'"
          class="triangle-pointer-icon mr-1"
          @click.native.stop="open = !open"
        />
        <IconBase icon="text" class="mr-1 h-4 w-4" />
        <form v-show="rename" @submit.prevent="rename = false">
          <input
            type="text"
            v-model="name"
            @input="debouncedUpdate"
            @blur="rename = false"
            :ref="'copyVariantList-' + this.index.toString()"
            :placeholder="name || copyVariantList.name"
          />
        </form>
        <span
          v-show="!rename"
          class="variant-list-title truncate mr-2 cursor-text"
          @dblclick.stop="renameVariantList()"
        >{{name || copyVariantList.name}}</span>
      </div>
      <div class="flex items-center">
        <IconBase
          :icon="matchingNode ? 'unlink' : 'link'"
          class="link-icon mr-2"
          v-show="mappableCopyNode"
          @click.native.stop="matchingNode ? unmapNode() : mapNode()"
        />
        <IconBase icon="plus" class="plus-icon mr-2" @click.native.stop="addCopyVariant()" />
        <IconBase icon="trash" class="trash-icon" @click.native.stop="deleteCopyVariantList()" />
      </div>
    </div>
    
    <div v-show="open" class="py-2">
      <CopyVariant
        v-for="(variant, idx) in variants"
        :key="variant.id"
        :number="idx + 1"
        :copyVariant="variant"
        :currentCopyId="currentCopyId"
        @removeVariant="removeVariant(variant)"
        @changeCurrentCopy="changeCurrentCopy(variant.id)"
        :class="{'mb-2': idx !== variants.length - 1}"
      />
    </div>
    
  </section>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";
import CopyVariant from "@/component/variant/copy/CopyVariant.vue";
import { mapGetters } from "vuex";

export default {
  name: "CopyVariantList",
  components: {
    IconBase,
    CopyVariant
  },
  props: {
    index: Number,
    copyVariantList: Object
  },
  data() {
    return {
      open: false,
      name: "",
      rename: false,
      debouncedUpdate: this.debounce(this.updateCopyVariantList, 500),
      currentCopyId: null,
      hover: false,
      nameInput: "copyVariantList-" + this.index.toString()
    };
  },
  computed: {
    ...mapGetters([
      "selection",
      "isSingleSelection",
      "nodeVariantType",
      "isMappableNode",
      "copyNodes"
    ]),
    mappedCopyNodes() {
      const nodeIDs = this.copyVariantList.nodeIDs;
      return nodeIDs.map(id => this.copyNodes[id]);
    },
    matchingNode() {
      const updateFlag = this.$store.getters.updateFlag;
      if (this.isSingleSelection) {
        return this.mappedCopyNodes
          .map(node => node.guid)
          .includes(this.node.guid);
      }
    },
    variants() {
      return this.$store.getters.copyVariantsByList(this.copyVariantList.id);
    },
    node() {
      const updateFlag = this.$store.getters.updateFlag;
      return this.selection.items[0];
    },
    mappableCopyNode() {
      const updateFlag = this.$store.getters.updateFlag;
      return (
        this.nodeVariantType === "Text" &&
        (this.isMappableNode || this.matchingNode)
      );
    }
  },
  methods: {
    addCopyVariant() {
      this.$store
        .dispatch("createCopy", {
          name: `Text-${this.variants.length + 1}`,
          listID: this.copyVariantList.id
        })
        .then(copy => {
          this.$store.dispatch("addCopyToList", copy);
          this.$store.dispatch("setVariantCountFlag");
        });
    },
    updateCopyVariantList() {
      this.$store.commit(
        "SET_COPY_VARIANT_LIST",
        Object.assign({}, this.copyVariantList, { name: this.name })
      );
    },
    removeVariant(copy) {
      this.$store.dispatch("deleteCopy", copy);
      this.$store.dispatch("removeCopyFromList", copy);
      this.$store.dispatch("setVariantCountFlag");
    },
    renameVariantList() {
      this.rename = true;
      this.$refs[this.nameInput].focus();
    },
    deleteCopyVariantList() {
      this.$store.dispatch("deleteCopyVariantList", this.copyVariantList);
    },
    mapNode() {
      this.node.listID = this.copyVariantList.id;
      this.$store.dispatch("mapCopyNode", this.node);
      this.$store.dispatch("addMappingToDesign", this.node);

      const listID = this.copyVariantList.id;
      const copy = {
        name: `Text-${this.variants.length + 1}`,
        listID
      };
      const copyLines = this.node.text.split("\n");

      this.$store.dispatch("createCopy", copy).then(copy => {
        this.$store.dispatch("addCopyToList", copy);
        this.$store.dispatch("setVariantCountFlag");

        copyLines.forEach((copyLine, index) =>
          this.$store.dispatch("createCopyLine", {
            variantID: copy.id,
            listID,
            text: copyLine,
            index
          })
        );
      });
    },
    unmapNode() {
      const node = this.copyNodes[this.node.guid];
      this.$store.dispatch("unmapCopyNode", node);
      this.$store.dispatch("deleteMappingFromDesign", node);
    },
    changeCurrentCopy(copyId) {
      this.currentCopyId = copyId;
    }
  },
  watch: {
    variants(newValue, oldValue) {
      if (newValue) {
        this.open = this.variants.length > 0;
      }
    }
  }
};
</script>

<style scoped>
</style>