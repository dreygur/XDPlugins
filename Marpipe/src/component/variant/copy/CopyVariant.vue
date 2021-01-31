<template>
  <div
    class="flex flex-col cursor-pointer rounded-lg p-1"
    :class="[
      currentCopyVariant ? 'border border-solid border-blue' : '',
      hover && !currentCopyVariant ? 'copy-variant' : ''
    ]"
    @click.stop="updateCopyNodes()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="flex items-center justify-between cursor-pointer h-4"
      @click.stop="updateCopyNodes()"
    >
      <form v-show="rename" @submit.prevent="updateCopyVariant()">
        <input
          type="text"
          v-model="name"
          @blur="updateCopyVariant()"
          :ref="'copyVariant' + this.copyVariant.id"
          :placeholder="name || copyVariant.name"
        />
      </form>
      <p
        v-show="!rename"
        class="text-xs whitespace-no-wrap underline cursor-text"
        :class="currentCopyVariant ? 'text-blue' : 'copy-label'"
        @dblclick.stop="renameVariant()"
      >{{name || copyVariant.name}}</p>

      <div class="flex items-center cursor-pointer">
        <IconBase icon="eye" v-show="currentCopyVariant" class="eye-icon mr-2 fill-blue" />
        <IconBase
          icon="minus"
          class="minus-icon"
          @click.native.stop="removeVariant()"
          :class="[currentCopyVariant || hover ? 'fill-red-500' : 'fill-red-500-60']"
        />
      </div>
    </div>
    <div class="flex items-center rounded-lg">
      <textarea
        v-show="showInput || !copyLineInput"
        v-model="copyLineInput"
        :ref="'copyInput-' + number.toString()"
        @blur="updateCopyLines()"
        placeholder="Type your text variant"
        class="rounded-lg cursor-text overflow-y-visible w-full"
        @focus="focusedTextArea = true"
      />
      <span
        v-if="!showInput && copyLineInput"
        class="text-xs ml-2 w-full cursor-pointer"
        @dblclick.stop="editCopyLines()"
        @click.stop="updateCopyNodes()"
      >{{ copyLineInput }}</span>
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "CopyVariant",
  components: {
    IconBase
  },
  props: {
    number: Number,
    copyVariant: Object,
    currentCopyId: String
  },
  data() {
    return {
      copyLineInput: "",
      name: "",
      nameRef: "copyVariant" + this.copyVariant.id,
      copyInput: "copyInput-" + this.number.toString(),
      rename: false,
      showInput: true,
      hover: false,
      focusedTextArea: false
    };
  },
  computed: {
    currentCopyVariant() {
      return this.currentCopyId === this.copyVariant.id;
    },
    copyLines() {
      const copyLines = this.$store.getters.copyLines;
      const copyLineIDs = this.copyVariant.copyLineIDs;
      return copyLineIDs
        .map(id => copyLines[id])
        .sort((a, b) => (a.index > b.index ? 1 : -1));
    }
  },
  watch: {
    copyLines(newValue, oldValue) {
      if (newValue) {
        this.copyLineInput = this.copyLines
          .map(copyLine => copyLine.text)
          .join("\n");
      }
    }
  },
  methods: {
    removeVariant() {
      this.$emit("removeVariant");
    },
    updateCopyNodes() {
      const application = require("application");
      const { listID } = this.copyVariant;
      const text = this.copyLineInput;

      application.editDocument(() => {
        this.$store.dispatch("updateCopyNodes", { listID, text });
      });

      this.$emit("changeCurrentCopy");
      this.rename = false;
    },
    updateCopyLines() {
      let newLines = this.copyLineInput.split("\n");
      let oldLines = this.copyLines;
      let mostLines = newLines.length >= oldLines.length ? newLines : oldLines;
      let fewerLines = newLines.length >= oldLines.length ? oldLines : newLines;

      let variantID = this.copyVariant.id;

      for (let i = 0; i < mostLines.length; i++) {
        let newLine = newLines[i];
        let oldLine = oldLines[i];

        if (fewerLines.length > i) {
          this.$store.dispatch(
            "updateCopyLine",
            Object.assign({}, oldLine, { text: newLine, index: i })
          );
        } else if (oldLines.length < newLines.length) {
          this.$store.dispatch("createCopyLine", {
            variantID,
            text: newLine,
            index: i
          });
        } else {
          this.$store.dispatch("deleteCopyLine", oldLine);
        }
      }

      this.focusedTextArea = false;
      this.showInput = false;
    },
    renameVariant() {
      this.rename = true;
      this.$refs[this.nameRef].focus();
    },
    updateCopyVariant() {
      this.copyVariant.name = this.name;
      this.$store.dispatch("updateCopy", this.copyVariant);
      this.rename = false;
    },
    editCopyLines() {
      this.showInput = true;
      this.$refs[this.copyInput].focus();
    }
  },
  mounted() {
    this.name = this.copyVariant.name;
    this.$refs[this.copyInput].focus();
  }
};
</script>

<style scoped>
.copy-label {
  color: rgb(211, 213, 224, 0.7);
}

.copy-variant:hover .copy-label {
  color: rgba(72, 190, 199, 0.5);
}

.copy-variant {
  border: solid 1px rgba(72, 190, 199, 0.5);
}
</style>