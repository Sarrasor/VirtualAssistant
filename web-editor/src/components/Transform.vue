<template>
  <div id="transform">
    <div id="labels">
      <p
        :key="i"
        :class="{active: active===i}"
        @click="active=i"
        v-for="(s, i) in ['move','rotate','scale']"
      >{{s}}</p>
    </div>
    <Vector v-show="active===0" :length="3" @vector="transform.position=[...$event]" />
    <Vector v-show="active===1" :length="3" @vector="transform.rotation=[...$event]" />
    <Vector v-show="active===2" :length="1" @vector="transform.scale=$event[0]" />
  </div>
</template>

<script>
import Vector from "./Vector";

export default {
  data() {
    return {
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1
      },
      active: 0
    };
  },
  watch: {
    transform: {
      handler: function(transform) {
        this.$emit("transform", transform);
      },
      deep: true
    }
  },
  components: {
    Vector
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
#labels {
  display: flex;
  align-items: center;
  height: 30px;
}
#labels > * {
  padding: 5px;
  width: 33%;
  text-align: center;
  user-select: none;
  cursor: pointer;
}
#labels > *:hover {
  font-size: 16px;
}
#labels > .active {
  font-weight: bolder;
  font-size: 16px;
}
</style>
