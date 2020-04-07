<template>
  <div>
    <p v-if="label">{{label}}</p>
    <textarea v-if="multiline" @input="$emit('text', $event.target.value)" />
    <input v-else type="text" @input="$emit('text', $event.target.value)" />
  </div>
</template>

<script>
export default {
  name: "TextArea",
  props: ["label", "multiline"]
};
</script>

<style scoped>
div {
  display: flex;
  flex-wrap: wrap;
}
div > * {
  width: 100%;
}
p {
  margin: 5px 0;
  font-style: italic;
  font-size: 12px;
  width: 100%;
}
textarea {
  height: 90px;
}
</style>
