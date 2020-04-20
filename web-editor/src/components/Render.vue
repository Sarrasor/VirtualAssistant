<template>
  <div class="card"></div>
</template>

<script>
import * as scene from "../scene_script";

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
      this.$el.innerHTML = "";
      scene.init(this.$el, this.assets, this.files);
    }
  }
};
</script>

<style scoped>
.card {
  padding: 0;
}
</style>
