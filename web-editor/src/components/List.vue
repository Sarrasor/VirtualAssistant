<template>
  <div id="root">
    <p class="label" v-if="label">{{label}}</p>
    <div id="items">
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
  props: ["items", "label"],
  data() {
    return {
      selected: 0
    };
  }
};
</script>

<style scoped>
#items {
  display: flex;
  flex-wrap: wrap;
  place-content: flex-start;
  overflow-y: auto;
  height: 100px;
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
