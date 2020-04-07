<template>
  <div id="root">
    <p id="label" v-if="label">{{label}}</p>
    <div id="area">
      <p id="empty" v-if="label">drop a file here</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileDrop",
  props: ["label"]
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
#label {
  margin: 5px 0;
  font-style: italic;
  font-size: 12px;
  width: 100%;
}
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
