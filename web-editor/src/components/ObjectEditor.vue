<template>
  <div id="object" v-if="object">
    <button id="delete" @click="$emit('delete')">X</button>
    <TextArea :label="'media'" @text="object.media=$event" />
    <TextArea :label="'text'" :multiline="true" @text="object.text=$event" />
    <Transform @transform="object.transform=$event" />
  </div>
</template>

<script>
import Transform from "./Transform";
import TextArea from "./TextArea";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    TextArea
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
          type: 0,
          media: "",
          text: "",
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
#object {
  margin: 10px;
  box-shadow: 0px 0px 10px var(--nord4);
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#object > * {
  margin: 5px 0;
}
#delete {
  color: var(--nord11);
}
</style>
