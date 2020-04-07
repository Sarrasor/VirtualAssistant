<template>
  <div id="root" v-if="instruction">
    <div class="card">
      <List
        :label="'instructions'"
        :items="['instruction 1', 'instruction 2', 'instruction 3', 'instruction 4', 'instruction 5']"
      />
    </div>
    <div class="card">
      <TextArea :label="'name'" @text="instruction.name=$event" />
      <TextArea :label="'description'" :multiline="true" @text="instruction.description=$event" />
      <FileDrop :label="'preview'" />
    </div>
    <Toolbar
      :actions="{add: 'note_add', delete: 'delete', duplicate: 'file_copy', upload: 'backup'}"
    />
    <div class="card">
      <FileList
        :label="'assets'"
        :items="['preview.png', 'schema.png', 'narration.m4a', 'duck.obj', 'tutorial.mp4']"
      />
    </div>
  </div>
</template>

<script>
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";
import List from "./List";
import FileList from "./FileList";
import Toolbar from "./Toolbar";

export default {
  name: "InstructionEditor",
  props: ["inInstruction"],
  components: {
    TextArea,
    FileDrop,
    List,
    FileList,
    Toolbar
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
