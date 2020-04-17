<template>
  <div>
    <div class="card">
      <p class="label bold">instructions</p>
      <template v-if="instructions">
        <div class="toolbar">
          <button v-if="instructions" @click="createInstruction" :tooltip="'create new'">
            <i class="material-icons-outlined">add</i>
          </button>
          <button v-if="instruction" @click="duplicateInstruction" :tooltip="'duplicate'">
            <i class="material-icons-outlined">library_add</i>
          </button>
          <button v-if="instruction" @click="$emit('upload')" :tooltip="'upload to server'">
            <i class="material-icons-outlined">publish</i>
          </button>
          <button v-if="instruction" @click="deleteInstruction" :tooltip="'delete'">
            <i class="material-icons-outlined">delete</i>
          </button>
        </div>
        <div v-if="instructions.length>0" class="list" style="height: 125px">
          <button
            :class="{selected: i===selected}"
            :key="i"
            @click="selected=i"
            v-for="(ins, i) in instructions"
          >{{ins.index.name}}</button>
        </div>
      </template>
      <template v-if="instruction">
        <p class="label">name</p>
        <input type="text" v-model="instruction.index.name" />
        <p class="label">description</p>
        <textarea v-model="instruction.index.description" />
        <p class="label">preview</p>
        <FileDrop :types="[1]" v-model="instruction.index.preview_url" />
      </template>
    </div>
    <div class="card" style="margin-top: 20px; width: 430px">
      <p class="label bold">files</p>
      <FileUpload v-if="instruction" v-model="instruction.files" @upload="validateMediaLinks" />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import FileDrop from "./FileDrop";
import FileUpload from "./FileUpload";

export default {
  name: "Instruction",
  props: ["instructions"],
  components: {
    FileDrop,
    FileUpload
  },
  data() {
    return {
      selected: undefined
    };
  },
  watch: {
    instructions(value) {
      if (value) this.selectLast();
    }
  },
  computed: {
    instruction: function() {
      this.$emit("select", this.selected);
      return this.instructions?.length > 0
        ? this.instructions[this.selected]
        : null;
    }
  },
  methods: {
    validateMediaLinks() {
      const files = this.instruction.files;
      const missing = file => !files.find(f => f.name === file);

      if (missing(this.instruction.preview_url))
        this.instruction.preview_url = "";

      for (const step of this.instruction.steps) {
        if (missing(step.preview_url)) step.preview_url = "";
        for (const asset of step.assets) {
          if (missing(asset.media.url)) {
            asset.media.url = "";
            asset.media.type = 0;
          }
        }
      }
    },
    createInstruction() {
      this.instructions.push({
        index: {
          id: uuidv4(),
          size: 0,
          name: "Instruction " + (this.instructions.length + 1),
          description: "",
          preview_url: "",
          step_count: 0,
          last_modified: ""
        },
        steps: [],
        files: []
      });
      this.selectLast();
    },
    duplicateInstruction() {
      let duplicate = JSON.parse(JSON.stringify(this.instruction));
      duplicate.name += " (copy)";
      this.instructions.push(duplicate);
      this.selectLast();
    },
    deleteInstruction() {
      this.instructions.splice(this.selected, 1);
      if (this.selected >= this.instructions.length) this.selectLast();
    },
    selectLast() {
      this.selected = this.instructions.length - 1;
    }
  }
};
</script>
