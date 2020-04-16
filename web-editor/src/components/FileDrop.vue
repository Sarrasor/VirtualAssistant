<template>
  <div id="root">
    <p id="empty">drag an uploaded file here</p>
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
  place-content: center;
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
