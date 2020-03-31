<template>
  <div id="app">
  </div>
</template>

<script>
import Vue from "vue";
import Vuesax from "vuesax";

import "vuesax/dist/vuesax.css";
Vue.use(Vuesax);

export default {
  name: "App",
  components: {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
