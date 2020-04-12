<template>
  <div class="card">
    <renderer :size="size">
      <scene>
        <camera :position="{ z: 15 }"></camera>
        <mesh
          :position="asset.transform.position"
          :rotation="asset.transform.rotation"
          :scale="asset.transform.scale"
          :key="i"
          v-for="(asset, i) in assets"
        >
          <geometry type="Box" :args="[1, 1, 1]"></geometry>
          <material type="MeshBasic"></material>
        </mesh>
      </scene>
    </renderer>
  </div>
</template>

<script>
export default {
  name: "Render",
  props: ["assets"],
  data() {
    return {
      size: { w: 500, h: 500 }
    };
  },
  mounted() {
    window.addEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.size = { w: this.$el.offsetWidth, h: this.$el.offsetHeight };
      this.$forceUpdate();
      console.log(this.size.w, this.size.h);
      // resizing doesn't work in this library, probably
    }
  }
};
</script>

<style scoped>
.card {
  padding: 0;
}
</style>
