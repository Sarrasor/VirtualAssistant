<template>
  <div>
    <div class="card">
      <p class="label bold">steps</p>
      <template v-if="steps">
        <div class="toolbar">
          <button @click="createStep" :tooltip="'create new'">
            <i class="material-icons-outlined">add</i>
          </button>
          <template v-if="step">
            <button @click="duplicateStep" :tooltip="'duplicate'">
              <i class="material-icons-outlined">library_add</i>
            </button>
            <button @click="deleteStep" :tooltip="'delete'">
              <i class="material-icons-outlined">delete</i>
            </button>
            <button @click="reoderSteps(true)" :tooltip="'move up'">
              <i class="material-icons-outlined">arrow_upward</i>
            </button>
            <button @click="reoderSteps(false)" :tooltip="'move down'">
              <i class="material-icons-outlined">arrow_downward</i>
            </button>
          </template>
        </div>
        <div v-if="steps.length>0" class="list" style="height: 125px">
          <button
            :class="{selected: i===selected}"
            :key="i"
            @click="selected=i"
            v-for="(stp, i) in steps"
          >{{stp.name}}</button>
        </div>
      </template>
      <template v-if="step">
        <p class="label">name</p>
        <input type="text" v-model="step.name" />
        <p class="label">description</p>
        <textarea v-model="step.description" />
        <p class="label">preview</p>
        <FileDrop :types="[1]" v-model="step.preview_url" />
      </template>
    </div>
  </div>
</template>

<script>
import FileDrop from "./FileDrop";

export default {
  name: "Step",
  props: ["steps"],
  components: {
    FileDrop
  },
  data() {
    return {
      selected: undefined
    };
  },
  computed: {
    step: function() {
      this.$emit("select", this.selected);
      return this.steps?.length > 0 ? this.steps[this.selected] : null;
    }
  },
  watch: {
    steps(value) {
      if (value) this.selectLast();
    }
  },
  methods: {
    createStep() {
      this.steps.push({
        name: "Step " + (this.steps.length + 1),
        description: "",
        preview_url: "",
        assets: []
      });
      this.selectLast();
    },
    duplicateStep() {
      let duplicate = JSON.parse(JSON.stringify(this.step));
      duplicate.name += " (copy)";
      this.steps.push(duplicate);
      this.selectLast();
    },
    deleteStep() {
      this.steps.splice(this.selected, 1);
      if (this.selected >= this.steps.length) this.selectLast();
    },
    selectLast() {
      this.selected = this.steps.length - 1;
    },
    reoderSteps(up) {
      const index = this.selected + (up ? -1 : 1);
      if (index < 0 || index >= this.steps.length) return;

      let temp = this.steps[index];
      this.steps[index] = this.steps[this.selected];
      this.steps[this.selected] = temp;

      this.selected = index;
    }
  }
};
</script>
