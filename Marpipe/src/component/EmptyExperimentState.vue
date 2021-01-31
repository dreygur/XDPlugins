<template>
  <div class="empty-experiment-container w-32 mx-auto flex flex-col items-center mt-10">
    <img class="w-12 mb-6" src="src/asset/shape@2x.png" alt="rectangle circle square" />
    <div
      class="empty-experiment-instruction text-center leading-5"
    >Select any Shape, Image, Text or Group layer to start adding variants</div>
  </div>
</template>

<script>
export default {
  name: "EmptyExperimentState"
};
</script>

<style scoped>
.empty-experiment-container {
  height: max-content;
  width: 8rem;
}

.empty-experiment-instruction {
  color: #c6c6c6;
  font-size: 0.9rem;
}
</style>