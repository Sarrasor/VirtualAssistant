<template>
  <div id="root">
    <p id="empty">click or drag files here to upload</p>
  </div>
</template>

<script>
export default {
  name: "FileUpload"
};
</script>

<style scoped>
#root {
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  box-shadow: inset 0 0 5px var(--shadow);
  place-content: center;
}
#root > * {
  justify-content: left;
  width: 100%;
  border-radius: 0;
  border: none;
  margin: 0;
  background-color: transparent;
}
#empty {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
  user-select: none;
}
</style>
