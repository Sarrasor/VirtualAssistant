<template>
  <div id="object" v-if="object">
    <button id="delete" @click="$emit('delete')">delete object</button>
    <hr />
    <FileDrop :label="'drop here a media file'" />
    <textarea placeholder="description" @input="object.description=$event.target.value" />
    <Transform @transform="object.transform=$event" />
  </div>
</template>

<script>
import Transform from "./Transform";
import FileDrop from "./FileDrop";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    FileDrop
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
#object {
  margin: 10px;
  box-shadow: 0px 0px 10px var(--shadow);
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#object > * {
  margin: 5px 0;
}
#delete {
  color: var(--danger);
}
textarea {
  height: 100px;
}
</style>
