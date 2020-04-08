<template>
  <div id="transform">
    <p class="label">position</p>
    <Vector :length="3" @vector="transform.position=[...$event]" />
    <p class="label">rotation</p>
    <Vector :length="3" @vector="transform.rotation=[...$event]" />
    <p class="label">scale</p>
    <Vector :length="1" @vector="transform.scale=$event[0]" />
  </div>
</template>

<script>
import Vector from "./Vector";

export default {
  name: "Transform",
  components: {
    Vector
  },
  data() {
    return {
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1
      }
    };
  },
  watch: {
    transform: {
      handler: function(transform) {
        this.$emit("transform", transform);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
#transform {
  display: flex;
  flex-wrap: wrap;
}
#transform > * {
  width: 100%;
}
</style>
