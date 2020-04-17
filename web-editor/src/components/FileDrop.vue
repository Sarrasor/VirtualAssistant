<template>
  <div
    :class="{delete: file}"
    id="root"
    @drop="drop"
    @dragover="$event.preventDefault()"
    @click="file=null"
  >
    <p v-if="file">{{file}}</p>
    <p v-else id="empty">[drag an uploaded file here]</p>
  </div>
</template>

<script>
export default {
  name: "FileDrop",
  props: ["file", "types"],
  model: {
    prop: "file",
    event: "drop"
  },
  methods: {
    drop(event) {
      const file = JSON.parse(event.dataTransfer.getData("text"));
      if (!this.types || this.types.includes(file.type))
        this.$emit("drop", file.name);
    }
  }
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
#root.delete:hover {
  border-color: var(--text);
  cursor: pointer;
}
#root > * {
  width: 100%;
}
p {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
  user-select: none;
}
p:not(#empty) {
  font-weight: bold;
}
</style>
