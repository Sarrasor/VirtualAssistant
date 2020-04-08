<template>
  <div v-if="slide">
    <div class="card">
      <p class="label bold">slides</p>
      <div class="toolbar">
        <button class="flat icon" @click="$emit('add')" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button class="flat icon" @click="$emit('duplicate')" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button class="flat icon" @click="$emit('delete')" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
      </div>
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

export default {
  name: "SlideEditor",
  props: ["inSlide"],
  components: {
    FileDrop
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
