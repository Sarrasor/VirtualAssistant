<template>
  <div class="card"></div>
</template>

<script>
// import * as scene from "../render/scene_script";

export default {
  name: "Render",
  props: ["assets", "files"],
  watch: {
    assets() {
      this.render();
    },
    files() {
      this.render();
    }
  },
  methods: {
    render() {
      // console.log("changed");
      // this.$el.innerHTML = "";
      // scene.init(this.$el, this.assets, this.files);
    }
  }
};
</script>

<style scoped>
.card {
  padding: 0;
}
</style>
