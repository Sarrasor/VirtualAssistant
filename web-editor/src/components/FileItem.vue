<template>
  <div id="area">
    <p id="empty">{{label}}</p>
  </div>
</template>

<script>
export default {
  name: "FileItem",
  props: ["file"],
};
</script>

<style scoped>
#area {
  border: 2px dashed var(--select);
  height: 30px;
  display: flex;
  align-items: center;
}
#empty {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
  user-select: none;
}
</style>
