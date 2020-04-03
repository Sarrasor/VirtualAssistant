<template>
  <div id="app">
    <InstructionEditor />
  </div>
</template>

<script>
import Vue from "vue";
import InstructionEditor from "./components/IntructionEditor";

import UUID from "vue-uuid";
Vue.use(UUID);

export default {
  name: "App",
  components: {
    InstructionEditor
  }
};
</script>
