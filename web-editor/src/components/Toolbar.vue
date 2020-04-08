<template>
  <div id="root">
    <button
      class="flat icon"
      :style="{width: widthPer}"
      :key="action"
      @click="$emit(action)"
      :tooltip="action"
      v-for="(icon, action) of actions"
    >
      <i class="material-icons-outlined">{{icon}}</i>
    </button>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  props: ["actions"],
  computed: {
    widthPer: function() {
      return 100 / Object.keys(this.actions).length + "%";
    }
  }
};
</script>

<style scoped>
#root {
  margin-bottom: 5px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
}
</style>
