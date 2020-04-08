<template>
  <div id="root">
    <p id="empty">click or drag your local files here to upload</p>
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
  border: 2px dashed var(--select);
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
