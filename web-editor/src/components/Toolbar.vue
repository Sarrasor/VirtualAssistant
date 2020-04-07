<template>
  <div id="root">
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
#root {
  padding-top: 5px;
  display: flex;
  flex-wrap: nowrap;
}
button:first-of-type {
  border-radius: 4px 0 0 4px;
}
button:last-of-type {
  border-radius: 0 4px 4px 0;
}
button:only-of-type {
  border-radius: 4px;
}
button {
  border-radius: 0;
}
</style>
