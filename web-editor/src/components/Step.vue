<template>
  <div>
    <div class="card">
      <p class="label bold">steps</p>
      <div class="toolbar">
        <button @click="createStep" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button @click="duplicateStep" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button @click="deleteStep" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
      </div>
      <div class="list" style="height: 125px">
        <button
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(stp, i) in steps"
        >{{stp.name}}</button>
      </div>
      <template v-if="step">
        <p class="label">name</p>
        <input type="text" v-model="step.name" />
        <p class="label">description</p>
        <textarea v-model="step.description" />
        <p class="label">preview</p>
        <FileDrop />
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
      selected: 0
    };
  },
  computed: {
    step: function() {
      return this.steps?.length > 0 ? this.steps[this.selected] : null;
    }
  },
  watch: {
    selected(value) {
      this.$emit("select", value);
    }
  },
  methods: {
    createStep() {
      if (!this.steps) return;

      this.steps.push({
        name: "Step " + (this.steps.length + 1),
        description: "Lorem impsum dolor sit amet",
        preview_url: undefined,
        assets: []
      });
      this.selected = this.steps.length - 1;
    },
    duplicateStep() {
      if (!this.steps) return;

      let duplicate = JSON.parse(JSON.stringify(this.steps[this.selected]));
      duplicate.name += "(copy)";
      this.steps.push(duplicate);
      this.selected = this.steps.length - 1;
    },
    deleteStep() {
      if (!this.steps) return;

      this.steps.splice(this.selected, 1);
      if (this.selected >= this.steps.length)
        this.selected = this.steps.length - 1;
    }
  }
};
</script>
