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
      <p class="label">position</p>
      <Vector :fields="['x','y','z']" @vector="object.transform.position=$event" />
      <p class="label">rotation</p>
      <Vector :fields="['x','y','z']" @vector="object.transform.rotation=$event" />
      <p class="label">scale</p>
      <Vector :fields="['x']" @vector="object.transform.scale=$event.x" />
    </div>
  </div>
</template>

<script>
import FileDrop from "./FileDrop";
import Vector from "./Vector";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    FileDrop,
    Vector
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
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
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
