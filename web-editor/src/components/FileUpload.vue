<template>
  <div id="root" @click="$refs.input.click()">
    <p id="empty">click or drag your local files here to upload</p>
    <input
      ref="input"
      accept="audio/*, video/*, image/*, .glb"
      hidden
      multiple
      type="file"
      @change="upload"
    />
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  props: ["files"],
  methods: {
    async upload(event) {
      this.$emit(
        "upload",
        this.files.concat(
          await Promise.all(Array.from(event.target.files).map(this.readFile))
        )
      );
    },
    readFile(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ name: file.name, type: file.type, content: reader.result });
        reader.onerror = reject;
        reader.readAsBinaryString(file);
      });
    }
  },
  model: {
    prop: "files",
    event: "upload"
  }
};
</script>

<style scoped>
#root {
  display: flex;
  flex-wrap: wrap;
  border: 2px dashed var(--select);
  place-content: center;
  cursor: pointer;
}
#root:hover {
  border-color: var(--text);
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
