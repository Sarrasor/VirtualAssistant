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
  methods: {
    render() {
      this.$refs.canvas.innerHTML = "";
      this.$refs.canvas.height = "500px";
      scene.init(this.$refs.canvas, this.assets, this.files);
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
