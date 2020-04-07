<template>
  <div id="root" v-if="instruction">
    <div class="card" id="list">
      <List :label="'instructions'" :items="['one', 'two', 'three', 'four']" />
    </div>
    <div class="card" id="slide">
      <TextArea :label="'name'" @text="instruction.name=$event" />
      <TextArea :label="'description'" :multiline="true" @text="instruction.description=$event" />
      <FileDrop :label="'preview'" />
    </div>
  </div>
</template>

<script>
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";
import List from "./List";

export default {
  name: "InstructionEditor",
  props: ["inInstruction"],
  components: {
    TextArea,
    FileDrop,
    List
  },
  data() {
    return {
      instruction: undefined
    };
  },
  watch: {
    inInstruction: {
      handler: function(value) {
        this.instruction = value || {
          name: "Slide title",
          description: "Lorem impsum dolor sit amet",
          preview_url: undefined,
          slides: [null]
        };
      },
      immediate: true
    },
    instruction: {
      handler: function(value) {
        this.$emit("instruction", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
</style>
