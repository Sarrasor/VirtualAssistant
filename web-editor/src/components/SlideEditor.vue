<template>
  <div v-if="slide">
    <div class="card">
      <p class="label bold">slides</p>
      <Toolbar :actions="{add: 'add', delete: 'delete', duplicate: 'library_add'}" />
      <div class="list" style="height: 125px">
        <button
          class="flat"
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(item, i) in ['slide 1', 'slide 2', 'slide 3', 'slide 4', 'slide 5', 'slide 6']"
        >{{item}}</button>
      </div>
      <p class="label">name</p>
      <input type="text" v-model="slide.name" />
      <p class="label">description</p>
      <textarea v-model="slide.description" />
      <p class="label">preview</p>
      <FileDrop />
    </div>
  </div>
</template>

<script>
import FileDrop from "./FileDrop";
import Toolbar from "./Toolbar";

export default {
  name: "SlideEditor",
  props: ["inSlide"],
  components: {
    FileDrop,
    Toolbar
  },
  data() {
    return {
      slide: undefined,
      selected: 0
    };
  },
  watch: {
    inSlide: {
      handler: function(value) {
        this.slide = value || {
          name: "Slide title",
          description: "Lorem impsum dolor sit amet",
          preview_url: undefined,
          objects: [null]
        };
      },
      immediate: true
    },
    slide: {
      handler: function(value) {
        this.$emit("slide", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
</style>
