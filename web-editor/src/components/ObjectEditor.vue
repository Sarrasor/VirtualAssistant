<template>
  <div v-if="object">
    <div class="card">
      <p class="label bold">objects</p>
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

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Transform,
    FileDrop
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
