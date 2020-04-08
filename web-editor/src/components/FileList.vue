<template>
  <div id="root">
    <p class="label" v-if="label">{{label}}</p>
    <div id="items" :style="{height: height}">
      <button
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
  overflow-y: auto;
  border-radius: 0;
  box-shadow: inset 0 0 5px var(--shadow);
}
#items > * {
  justify-content: left;
  width: 100%;
  border-radius: 0;
  border: none;
  margin: 0;
  background-color: transparent;
}
#items > *:hover {
  background-color: var(--select);
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--select);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text);
}
</style>
