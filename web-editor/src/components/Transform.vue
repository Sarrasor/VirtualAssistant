<template>
  <div id="transform">
    <Vector
      :length="3"
      :label="'position'"
      @vector="transform.position=[...$event]"
    />
    <Vector
      :length="3"
      :label="'rotation'"
      @vector="transform.rotation=[...$event]"
    />
    <Vector :length="1" :label="'scale'" @vector="transform.scale=$event[0]" />
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
