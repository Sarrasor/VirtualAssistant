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
          <button v-if="instruction" @click="uploadInstruction" :tooltip="'upload to server'">
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
          >{{ins.name}}</button>
        </div>
      </template>
      <template v-if="instruction">
        <p class="label">name</p>
        <input type="text" v-model="instruction.name" />
        <p class="label">description</p>
        <textarea v-model="instruction.description" />
        <p class="label">preview</p>
        <FileDrop @drop="instruction.preview_url=$event" />
      </template>
    </div>
    <div class="card" style="margin-top: 20px; width: 430px">
      <p class="label bold">files</p>
      <div id="files" v-if="instruction">
        <div class="list" style="height: 125px">
          <button
            draggable
            @dragstart="dragFile($event, i)"
            :key="i"
            @click="selectedFile=i"
            v-for="(file, i) in files"
          >{{file.name}}</button>
        </div>
        <FileUpload v-model="files" />
      </div>
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
      selected: undefined,
      files: []
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
    dragFile(event, index) {
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify(this.files[index])
      );
    },
    createInstruction() {
      this.instructions.push({
        id: uuidv4(),
        size: 0,
        name: "Instruction " + (this.instructions.length + 1),
        description: "Lorem impsum dolor sit amet",
        preview_url: "",
        steps: [],
        step_count: 0,
        last_modified: ""
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
    uploadInstruction() {
      this.instruction.step_count = this.instruction.steps.length;
      this.instruction.last_modified = Date.now();

      let { steps, ...index } = this.instruction;
      steps.forEach(s =>
        s.assets.forEach(
          a =>
            (a.media.type = a.media.url
              ? this.files.find(f => f.name === a.media.url).type
              : null)
        )
      );

      const index_json = JSON.stringify(index);
      const steps_json = JSON.stringify(steps);
      console.log(index_json);
      console.log(steps_json);
    },
    selectLast() {
      this.selected = this.instructions.length - 1;
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
