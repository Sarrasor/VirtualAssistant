<template>
  <div id="root" v-if="object">
    <div class="card">
      <p class="label bold">objects</p>
      <Toolbar :actions="{add: 'note_add', delete: 'delete', duplicate: 'file_copy'}" />
      <List
        :items="['object 1', 'object 2', 'object 3', 'object 4', 'object 5', 'object 6']"
        :shown="5"
      />
    </div>
    <div class="card">
      <p class="label">name</p>
      <TextArea @text="object.name=$event" />
      <p class="label">description</p>
      <TextArea :multiline="true" @text="object.description=$event" />
      <p class="label">media</p>
      <FileDrop />
      <Transform @transform="object.transform=$event" />
    </div>
  </div>
</template>

<script>
import Transform from "./Transform";
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";
import List from "./List";
import Toolbar from "./Toolbar";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    FileDrop,
    TextArea,
    List,
    Toolbar
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
