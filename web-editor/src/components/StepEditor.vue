<template>
  <div v-if="step">
    <div class="card">
      <p class="label bold">steps</p>
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
      </div>
      <div class="list" style="height: 125px">
        <button
          class="flat"
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(item, i) in ['step 1', 'step 2', 'step 3', 'step 4', 'step 5', 'step 6']"
        >{{item}}</button>
      </div>
      <p class="label">name</p>
      <input type="text" v-model="step.name" />
      <p class="label">description</p>
      <textarea v-model="step.description" />
      <p class="label">preview</p>
      <FileDrop />
    </div>
  </div>
</template>

<script>
import FileDrop from "./FileDrop";

export default {
  name: "StepEditor",
  props: ["inStep"],
  components: {
    FileDrop
  },
  data() {
    return {
      step: undefined,
      selected: 0
    };
  },
  watch: {
    inStep: {
      handler: function(value) {
        this.step = value || {
          name: "Step title",
          description: "Lorem impsum dolor sit amet",
          preview_url: undefined,
          assets: [null]
        };
      },
      immediate: true
    },
    step: {
      handler: function(value) {
        console.log("step", value);
        this.$emit("step", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
