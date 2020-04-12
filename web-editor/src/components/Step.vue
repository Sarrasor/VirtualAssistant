<template>
  <div>
    <div class="card">
      <p class="label bold">steps</p>
      <template v-if="steps">
        <div class="toolbar">
          <button @click="createStep" :tooltip="'create new'">
            <i class="material-icons-outlined">add</i>
          </button>
          <button v-if="step" @click="duplicateStep" :tooltip="'duplicate'">
            <i class="material-icons-outlined">library_add</i>
          </button>
          <button v-if="step" @click="deleteStep" :tooltip="'delete'">
            <i class="material-icons-outlined">delete</i>
          </button>
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
      selected: undefined
    };
  },
  computed: {
    step: function() {
      this.$emit("select", this.selected);
      return this.steps?.length > 0 ? this.steps[this.selected] : null;
    }
  },
  methods: {
    createStep() {
      this.steps.push({
        name: "Step " + (this.steps.length + 1),
        description: "Lorem impsum dolor sit amet",
        preview_url: undefined,
        assets: []
      });
      this.selectLast();
    },
    duplicateStep() {
      let duplicate = JSON.parse(JSON.stringify(this.steps[this.selected]));
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
    }
  }
};
</script>
