<template>
  <div id="root" v-if="instruction">
    <div class="card">
      <p class="label bold">instructions</p>
      <div class="toolbar">
        <button class="flat icon" @click="$emit('add')" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button class="flat icon" @click="$emit('duplicate')" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button class="flat icon" @click="$emit('delete')" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
        <button class="flat icon" @click="$emit('upload')" :tooltip="'upload to server'">
          <i class="material-icons-outlined">publish</i>
        </button>
      </div>
      <div class="list" style="height: 125px">
        <button
          class="flat"
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(item, i) in ['instruction 1', 'instruction 2', 'instruction 3', 'instruction 4', 'instruction 5', 'instruction 6']"
        >{{item}}</button>
      </div>
      <p class="label">name</p>
      <input type="text" v-model="instruction.name" />
      <p class="label">description</p>
      <textarea v-model="instruction.description" />
      <p class="label">preview</p>
      <FileDrop :label="'preview'" />
    </div>
    <div class="card" style="margin-top: 20px; width: 380px">
      <p class="label bold">assets</p>
      <div id="files">
        <div class="list" style="height: 125px">
          <button
            class="flat"
            :class="{selectedFile: i===selectedFile}"
            :key="i"
            @click="selectedFile=i"
            v-for="(item, i) in ['preview.png', 'schema.png', 'narration.m4a', 'duck.obj', 'tutorial.mp4', 'arrow.obj']"
          >{{item}}</button>
        </div>
        <FileUpload />
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import FileDrop from "./FileDrop";
import FileUpload from "./FileUpload";

export default {
  name: "InstructionEditor",
  props: ["inInstruction"],
  components: {
    FileDrop,
    FileUpload
  },
  data() {
    return {
      instruction: undefined,
      selected: 0,
      selectedFile: 0
    };
  },
  watch: {
    inInstruction: {
      handler: function(value) {
        this.instruction = value || {
          id: uuidv4(),
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
#files {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 5px;
}
</style>
