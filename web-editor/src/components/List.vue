<template>
  <div id="root">
    <p class="label" v-if="label">{{label}}</p>
    <div id="items" :style="{height: height}">
      <button
        class="flat"
        :class="{selected: i===selected}"
        :key="i"
        @click="$emit('select', selected=i)"
        v-for="(item, i) in items"
      >{{item}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  props: ["items", "shown", "label"],
  data() {
    return {
      selected: 0
    };
  },
  computed: {
    height: function() {
      return (
        (isNaN(this.shown) || this.shown === 0 ? 100 : this.shown * 25) + "px"
      );
    }
  }
};
</script>

<style scoped>
#items {
  display: flex;
  flex-wrap: wrap;
  place-content: flex-start;
  overflow-y: auto;
  border-radius: 0;
  box-shadow: inset 0 0 5px var(--shadow);
}
#items > * {
  width: 100%;
  border-radius: 0;
  margin: 0;
}
:not(.selected) {
  background-color: transparent;
}
.selected {
  text-decoration: underline;
  background-color: var(--select);
}
</style>
