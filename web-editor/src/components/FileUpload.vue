<template>
  <div id="root" @click="$refs.input.click()" @drop="drop" @dragover="$event.preventDefault()">
    <p id="empty">click or drag your local files here to upload</p>
    <input
      ref="input"
      hidden
      multiple
      type="file"
      :accept="extensions.join()"
      @change="upload(Array.from($event.target.files))"
    />
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  props: ["files"],
  data() {
    return {
      images: [".bmp", ".jpeg", ".jpg", ".png"],
      audios: [".mp3"],
      videos: [".mp4"],
      models: [".glb"]
    };
  },
  computed: {
    types: function() {
      return [this.images, this.audios, this.videos, this.models];
    },
    extensions: function() {
      return this.types.flat();
    }
  },
  methods: {
    async upload(files) {
      this.$emit(
        "upload",
        this.files.concat(await Promise.all(files.map(this.readFile)))
      );
    },
    readFile(file) {
      const type = this.getType;
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            name: file.name,
            type: type(file.name),
            content: reader.result
          });
        reader.onerror = reject;
        reader.readAsBinaryString(file);
      });
    },
    getExt(name) {
      return "." + name.split(".").pop();
    },
    getType(name) {
      const ext = this.getExt(name);
      for (const [i, type] of this.types.entries())
        if (type.includes(ext)) return i + 1;
      return 0;
    },
    async drop(event) {
      event.preventDefault();
      if (event.dataTransfer.files?.length > 0)
        await this.upload(
          Array.from(event.dataTransfer.files).filter(f =>
            this.extensions.includes(this.getExt(f.name))
          )
        );
      else {
        const file = JSON.parse(event.dataTransfer.getData("text"));
        this.$emit(
          "upload",
          this.files.filter(f => f.name !== file.name)
        );
      }
    },
    dragOver(event) {
      event.preventDefault();
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
