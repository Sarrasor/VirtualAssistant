<template>
  <renderer :size="{ w: 600, h: 400 }">
    <scene>
      <camera :position="{ z: 15 }"></camera>
      <mesh :position="asset.transform.position" :key="i" v-for="(asset, i) in assets">
        <geometry type="Box" :args="[1, 1, 1]"></geometry>
        <material type="MeshBasic"></material>
      </mesh>
    </scene>
  </renderer>
</template>

<script>
export default {
  name: "Render",
  props: ["assets"]
};
</script>

<style scoped>
.card {
  padding: 0;
}
</style>
