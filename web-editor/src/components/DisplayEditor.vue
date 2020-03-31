<template>
  <div id="display" v-if="display">
    <select id="type" v-model="display.type">
      <option value="0">Text</option>
      <option value="1">Image</option>
      <option value="2">Audio</option>
      <option value="3">Video</option>
      <option value="4">3D Model</option>
    </select>
    <textarea class="body" v-if="display.type==0" v-model="display.content" />
    <input type="text" v-else v-model="display.content" />
    <button @click="$emit('delete', index)">Remove</button>
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
  display: flex;
  flex-flow: column;
}
#type {
  width: 100%;
}
</style>
