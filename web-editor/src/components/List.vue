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
  overflow-y: auto;
  height: 100px;
  border-radius: 0;
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
  font-weight: bolder;
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
