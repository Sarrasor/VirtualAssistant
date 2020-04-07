<template>
  <div id="root" v-if="object">
    <div class="card" id="list">
      <List :label="'objects'" :items="['object 1', 'object 2', 'object 3', 'object 4']" />
    </div>
    <div class="card" id="main">
      <TextArea :label="'name'" @text="object.name=$event" />
      <TextArea :label="'description'" :multiline="true" @text="object.description=$event" />
      <FileDrop :label="'media'" />
      <Transform @transform="object.transform=$event" />
    </div>
  </div>
</template>

<script>
import Transform from "./Transform";
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";
import List from "./List";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    FileDrop,
    TextArea,
    List
  },
  data() {
    return {
      object: undefined
    };
  },
  watch: {
    inObject: {
      handler: function(value) {
        this.object = value || {
          name: "object",
          media: {
            url: "",
            type: 0
          },
          description: "",
          transform: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1
          }
        };
      },
      immediate: true
    },
    object: {
      handler: function(value) {
        this.$emit("object", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
</style>
