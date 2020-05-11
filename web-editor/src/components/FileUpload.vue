<template>
  <div id="root" v-if="files">
    <div class="list" style="height: 125px">
      <button
        draggable
        @dragstart="drag($event, i)"
        :key="i"
        v-for="(file, i) in files"
      >{{file.name}}</button>
    </div>
    <div id="drop" @click="$refs.input.click()" @drop="drop" @dragover="$event.preventDefault()">
      <p id="empty">click or drag your local files here to upload them</p>
      <br />
      <p id="empty">or drag an uploaded file to delete it</p>
      <input
        ref="input"
        hidden
        multiple
        type="file"
        :accept="extensions.join()"
        @change="upload(Array.from($event.target.files))"
      />
    </div>
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
      models: [".glb", ".gltf", ".bin"]
    };
  },
  computed: {
    types: function() {
      return [this.images, this.audios, this.videos, this.models];
    },
    extensions: function() {
      return this.types.flat();
    },
    names: function() {
      return this.files.map(f => f.name);
    }
  },
  methods: {
    async upload(files) {
      this.$emit(
        "upload",
        this.files.concat(
          await Promise.all(
            files.filter(f => !this.names.includes(f.name)).map(this.readFile)
          )
        )
      );
    },
    readFile(file) {
      let url = window.URL.createObjectURL(file);
      let type = this.getType;

      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            name: file.name,
            type: type(file.name),
            content: reader.result,
            url: url
          });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    async deserealizeFile(file) {
      let base64 = await file.async("base64");
      let blob = await file.async("blob");
      let name = file.name.replace("media/", "");

      return {
        name: name,
        type: this.getType(name),
        content: base64,
        url: window.URL.createObjectURL(blob)
      };
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
        window.URL.revokeObjectURL(file.url);
        this.$emit(
          "upload",
          this.files.filter(f => f.name !== file.name)
        );
      }
    },
    drag(event, index) {
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify(this.files[index])
      );
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
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 5px;
}
#drop {
  display: flex;
  flex-wrap: wrap;
  border: 2px dashed var(--select);
  place-content: center;
  cursor: pointer;
}
#drop:hover {
  border-color: var(--text);
}
#drop > * {
  width: 100%;
}
#empty {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
}
</style>
