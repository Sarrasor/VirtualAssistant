<template>
  <div v-if="object">
    <div class="card">
      <p class="label bold">objects</p>
      <Toolbar :actions="{add: 'add', delete: 'delete', duplicate: 'library_add'}" />
      <div class="list" style="height: 125px">
        <button
          class="flat"
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(item, i) in ['object 1', 'object 2', 'object 3', 'object 4', 'object 5', 'object 6']"
        >{{item}}</button>
      </div>
      <p class="label">name</p>
      <input type="text" v-model="object.name" />
      <p class="label">description</p>
      <textarea v-model="object.description" />
      <p class="label">media</p>
      <FileDrop />
      <Transform @transform="object.transform=$event" />
    </div>
  </div>
</template>

<script>
import Transform from "./Transform";
import FileDrop from "./FileDrop";
import Toolbar from "./Toolbar";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    FileDrop,
    Toolbar
  },
  data() {
    return {
      object: undefined,
      selected: 0
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
