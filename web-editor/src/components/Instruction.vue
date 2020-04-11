<template>
  <div id="root">
    <div class="card">
      <p class="label bold">instructions</p>
      <div class="toolbar">
        <button class="flat icon" @click="$emit('add')" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button class="flat icon" @click="$emit('duplicate', selected)" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button class="flat icon" @click="$emit('upload', selected)" :tooltip="'upload to server'">
          <i class="material-icons-outlined">publish</i>
        </button>
        <button class="flat icon" @click="$emit('delete', selected)" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
      </div>
      <div class="list" style="height: 125px">
        <button
          class="flat"
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(inst, i) in instructions"
        >{{inst.name}}</button>
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
    <div class="card" style="margin-top: 20px; width: 380px">
      <p class="label bold">files</p>
      <div id="files" v-if="instruction">
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
      selected: 0,
      selectedFile: 0
    };
  },
  computed: {
    instruction: function() {
      return this.instructions.length > 0
        ? this.instructions[this.selected]
        : null;
    }
  },
  watch: {
    instructions: {
      handler: function(value) {
        console.log("instructions arrived", value);
        if (this.selected >= value.length)
          this.selected = Math.max(0, value.length - 1);
      },
      immediate: true
    },
    instruction: {
      handler: function(value) {
        console.log("instruction changed", value);
        this.$emit("instruction", value);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    delete() {}
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
