<template>
  <div class="card">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as scene from "../DobroyeBabylon";

export default {
  name: "Render",
  props: ["assets", "files"],
  data() {
    return {
      slide: null,
      ids: []
    };
  },
  watch: {
    assets: {
      handler() {
        this.render();
      },
      deep: true
    },
    files: {
      handler() {
        this.render();
      },
      deep: true
    }
  },
  mounted() {
    this.slide = new scene.Slide(this.$refs.canvas);
  },
  methods: {
    render() {
      scene.init(this.slide, this.assets, this.files);
      let ids = (this.assets ?? []).map(a => a.id);
      this.ids
        .filter(i => !ids.includes(i))
        .forEach(i => this.slide.deleteAsset(i));
      this.ids = ids;
    }
  }
};
</script>

<style scoped>
.card {
  padding: 0;
}
canvas {
  width: 100%;
  height: 100%;
}
</style>
