<template>
  <div>
    <!-- Back button, routes to help index -->
    <div class="flex mb-3 items-center">
      <IconBase
        icon="back-arrow"
        class="h-4 w-4 mr-2 cursor-pointer"
        @click.native.stop="$router.push('/help')"
      />
      <span
        class="cursor-pointer text-xs"
        @click.stop="$router.push('/help')"
      >Back</span>
    </div>

    <!-- Header with help topic name, taken from route param 'topic' -->
    <span
      class="text-base font-medium mb-6"
    >{{topic}}</span>

    <!-- Instructional gif -->
    <img
      :src="gif"
      class="object-contain mb-4"
    />

    <!-- Instructional text -->
    <p>{{instruction}}</p>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

  export default {
    name: "HelpPage",
    components: {
      IconBase,
    },
    data() {
      return {
        // Object containing associated gif and instructional text for topic
        topics: {
          'account select': {
            instruction: 'Now that you’re signed into your Marpipe account inside of Adobe XD, you’ll want to click the account section and choose your default ad account from the dropdown. Marpipe allows you to split assets and experiments across different brands. It’s important to select the relevant account whenever working in the plugin so that your assets sync how you intend them to.',
            gif: 'src/asset/gifs/Account select.gif'
          },
          'adding image variants': {
            instruction: 'Once you have an artboard with elements that you’re ready to experiment with you’ll notice that selecting an element activates the add button (+) in the plugin panel. Clicking the plus while a rectangle or shape object is selected will prompt you to upload files from your computer. Select the files you want to add as variants to the layer then click open. Once your files are finished uploading you will see them populate in the element group to the left. To save yourself the headache later, you should name the element group by double clicking on “Image Group-1”. This is important because the name will later be used to automatically label each generated artboard with its respective layer variants.',
            gif: 'src/asset/gifs/Add Image Variants.gif'
          },
          'adding copy variants': {
            instruction: 'Using the add button to map a text element from your design will create a text element group and save the initial state of your text layer as the first variant in the group. Clicking the + near the title of the element group will create a new empty field. To get started, you should create 3-4 text variations and then click through each to see how the text fills in the mapped layer. Note that just as with images, text element groups/variant names can both be edited by double clicking (we promise you, it’s a huge time saver to name as you go).',
            gif: 'src/asset/gifs/Add Copy Variants.gif'
          },
          'adding combo variants': {
            instruction: 'Now what if you have multiple layers that you want to vary only with each other? To do this, first group those elements, then use the add button to map the group into your experiment. You’ll see a pop-up appear prompting you to map each layer in the group to a new experiment element (currently, Combo Groups require that everything in the group be mapped to a variant). Once you’ve clicked submit, you will see a new combo group appear in the left plugin panel. Just as with a single text element, you can create additional combo variants by clicking the plus next to the title of the group. Clicking through each combo variant will preview both mapped layers on the artboard to the values that you’ve established in the Marpipe for Adobe XD panel.',
            gif: 'src/asset/gifs/Add Combo Variants.gif'
          },
          'previewing variants': {
            instruction: 'Once you’ve added multiple variants to a group, you have the ability to preview the linked artboard layers on the canvas. Open any group and click a variant to display it in all linked layers.',
            gif: 'src/asset/gifs/Preview.gif'
          },
          'linking & unlinking a layer': {
            instruction: 'Any variant group that has been created can be linked or unlinked to a layer or group on an artboard. When a layer is not linked to a variant group, you will see the link icon appear on all available variant groups in the plugin panel. If the selected layer is linked, then you will see the unlink icon appear on the group that it is mapped to.',
            gif: 'src/asset/gifs/Link_Unlink.gif'
          },
          'multiple artboards and designs': {
            instruction: 'At this point, you’re rocking with some serious iteration potential, but let’s go ahead and sweeten the deal. Duplicate your artboard and notice that the layers on the duplicated artboard are not mapped to the experiment. You are now free to completely remix your design. Once you have your new design outlined, you can map your desired elements back to the outlined experiment in the left panel by selecting a layer and then clicking the link button on the group that you want to map. Once you’ve mapped all of your elements, previewing different variants in the left panel will swap assets across both of the artboards that you have mapped layers to.',
            gif: 'src/asset/gifs/Multiple design.gif'
          },
          'unlinking an artboard': {
            instruction: 'Once a layer from any given artboard is linked to the experiment, the whole artboard will be added to the experiment (it will be used to generate the variants). To unlink an artboard and all layers associated with it. Use the unlink button next to the preview in the design section of the plugin.',
            gif: 'src/asset/gifs/Unlink Artboard.gif'
          },
          'generate': {
            instruction: 'The experiment is now ready to generate. Click that beautiful blue button on the bottom of the left panel and watch as every possible combination of your inputs appear almost instantly across your Adobe XD project. From here, rendering your designs is a breeze. Since every variant has been perfectly named all you have to do is highlight all our artboard variants and use the keyboard shortcut CMD+E to export your selection.',
            gif: 'src/asset/gifs/Generate_and_Export.gif'
          },
        }
      }
    },
    computed: {
      topic() {
        return this.$route.params.topic
      },
      gif() {
        return this.topics[this.topic.toLowerCase()].gif
      },
      instruction() {
        return this.topics[this.topic.toLowerCase()].instruction
      }
    },
  }
</script>

<style scoped>

</style>