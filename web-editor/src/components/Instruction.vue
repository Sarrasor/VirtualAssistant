<template>
  <div class="card">
    <p class="label bold">instructions</p>
    <template v-if="instructions">
      <div class="toolbar">
        <button v-if="instructions" @click="createInstruction" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <template v-if="instruction">
          <button @click="duplicateInstruction" :tooltip="'duplicate'">
            <i class="material-icons-outlined">library_add</i>
          </button>
          <button @click="$emit('upload')" :tooltip="'upload to server'">
            <i class="material-icons-outlined">publish</i>
          </button>
          <button @click="deleteInstruction" :tooltip="'delete'">
            <i class="material-icons-outlined">delete</i>
          </button>
        </template>
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
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import FileDrop from "./FileDrop";

export default {
  name: "Instruction",
  props: ["instructions"],
  components: {
    FileDrop
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
    createInstruction() {
      this.instructions.push({
        index: {
          id: uuidv4(),
          name: "Instruction " + (this.instructions.length + 1),
          size: 0,
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
      duplicate.index.id = uuidv4();
      duplicate.index.name += " (copy)";
      this.instructions.push(duplicate);
      this.selectLast();
    },
    deleteInstruction() {
      this.instructions.splice(this.selected, 1);
      if (this.selected >= this.instructions.length) this.selectLast();
    },
    selectLast() {
      if (this.selected >= this.instructions.length)
        this.selected = this.instructions.length - 1;
    }
  }
};
</script>
