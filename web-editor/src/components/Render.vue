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
      slide: null
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
