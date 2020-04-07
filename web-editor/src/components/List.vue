<template>
  <div id="root">
    <p id="label" v-if="label">{{label}}</p>
    <div id="items">
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
}
#items > * {
  justify-content: left;
  width: 100%;
  border-radius: 0;
  margin: 0;
  border: none;
}
#items > *:hover {
  background-color: var(--select);
  border: none;
}
#items > *:first-of-type {
  border-radius: 4px 4px 0 0;
}
#items > *:last-of-type {
  border-radius: 0 0 4px 4px;
}
#items > *:only-of-type {
  border-radius: 4px;
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
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text);
}
</style>
