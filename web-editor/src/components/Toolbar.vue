<template>
  <div class="card">
    <button
      class="flat icon"
      :style="{width: widthPer}"
      :key="action"
      @click="$emit(action)"
      v-for="(icon, action) of actions"
    >
      <i class="material-icons">{{icon}}</i>
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
.card {
  padding: 5px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
}
</style>
