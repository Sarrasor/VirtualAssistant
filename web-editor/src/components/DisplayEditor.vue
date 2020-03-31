<template>
  <div id="display" v-if="display">
    <div id="actions">
      <select id="type" v-model="display.type">
        <option value="0">Text</option>
        <option value="1">Image</option>
        <option value="2">Audio</option>
        <option value="3">Video</option>
        <option value="4">3D Model</option>
      </select>
      <button id="delete" @click="$emit('delete', index)">X</button>
    </div>
    <textarea class="body" v-if="display.type==0" v-model="display.content" />
    <input type="text" v-else v-model="display.content" />
  </div>
</template>

<script>
export default {
  name: "DisplayEditor",
  props: ["index", "inDisplay"],
  data() {
    return {
      display: undefined
    };
  },
  watch: {
    inDisplay: {
      handler: function(value) {
        this.display = value || {
          type: 0,
          content: "Lorem ipsum aray-uray",
          transform: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        };
      },
      immediate: true
    },
    display: {
      handler: function(value) {
        this.$emit("display", value);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
#display {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
#actions {
  display: flex;
  margin: 0 -5px 10px -5px;
}
#actions > * {
  margin: 0 5px;
}
#type {
  flex: 1;
}
#delete {
  width: 30px;
  color: var(--nord11);
}
</style>
