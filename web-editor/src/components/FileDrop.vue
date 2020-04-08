<template>
  <div id="root">
    <p id="empty" v-if="label">drop an asset here</p>
  </div>
</template>

<script>
export default {
  name: "FileDrop"
};
</script>

<style scoped>
#root {
  display: flex;
  flex-wrap: wrap;
  border: 2px dashed var(--select);
  height: 25px;
  align-items: center;
}
#root > * {
  width: 100%;
}
#empty {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
  user-select: none;
}
</style>
