<template>
  <div id="root">
    <textarea v-if="multiline" @input="$emit('text', $event.target.value)" />
    <input v-else type="text" @input="$emit('text', $event.target.value)" />
  </div>
</template>

<script>
export default {
  name: "TextArea",
  props: ["multiline"]
};
</script>

<style scoped>
#root {
  display: flex;
  flex-wrap: wrap;
}
#root > * {
  width: 100%;
}
</style>
