<template>
  <div>
    <div class="card">
      <p class="label bold">instructions</p>
      <div class="toolbar">
        <button @click="createInstruction" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button @click="duplicateInstruction" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button @click="uploadInstruction" :tooltip="'upload to server'">
          <i class="material-icons-outlined">publish</i>
        </button>
        <button @click="deleteInstruction" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
      </div>
      <div class="list" style="height: 125px">
        <button
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(ins, i) in instructions"
        >{{ins.name}}</button>
      </div>
      <template v-if="instruction">
        <p class="label">name</p>
        <input type="text" v-model="instruction.name" />
        <p class="label">description</p>
        <textarea v-model="instruction.description" />
        <p class="label">preview</p>
        <FileDrop :label="'preview'" />
      </template>
    </div>
    <div class="card" style="margin-top: 20px; width: 430px">
      <p class="label bold">files</p>
      <div id="files" v-if="instruction">
        <div class="list" style="height: 125px">
          <button
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
  computed: {
    instruction: function() {
      this.$emit("select", this.selected);
      return this.instructions?.length > 0
        ? this.instructions[this.selected]
        : null;
    }
  },
  methods: {
    createInstruction() {
      this.instructions.push({
        id: uuidv4(),
        name: "Instruction " + (this.instructions.length + 1),
        description: "Lorem impsum dolor sit amet",
        preview_url: undefined,
        steps: []
      });
      this.selectLast();
    },
    duplicateInstruction() {
      if (!this.instruction) return;

      let duplicate = JSON.parse(
        JSON.stringify(this.instructions[this.selected])
      );
      duplicate.name += "(copy)";
      this.instructions.push(duplicate);
      this.selectLast();
    },
    deleteInstruction() {
      this.instructions.splice(this.selected, 1);
      if (this.selected >= this.instructions.length) this.selectLast();
    },
    uploadInstruction() {
      console.log(
        "uploading (not yet)",
        JSON.stringify(this.instructions[this.selected])
      );
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
