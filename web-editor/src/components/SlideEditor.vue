<template>
  <div id="root" v-if="slide">
    <div class="card">
      <List :label="'slides'" :items="['slide 1', 'slide 2', 'slide 3', 'slide 4', 'slide 5']" />
    </div>
    <div class="card" v-if="slide">
      <TextArea :label="'name'" @text="slide.name=$event" />
      <TextArea :label="'description'" :multiline="true" @text="slide.description=$event" />
      <FileDrop :label="'preview'" />
    </div>
    <Toolbar
      :actions="{add: 'note_add', delete: 'delete', duplicate: 'file_copy', moveUp: 'arrow_upward', moveDown: 'arrow_downward'}"
    />
  </div>
</template>

<script>
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";
import List from "./List";
import Toolbar from "./Toolbar";

export default {
  name: "SlideEditor",
  props: ["inSlide"],
  components: {
    TextArea,
    FileDrop,
    List,
    Toolbar
  },
  data() {
    return {
      slide: undefined
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
