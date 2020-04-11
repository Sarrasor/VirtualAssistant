<template>
  <div v-if="asset">
    <div class="card">
      <p class="label bold">assets</p>
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
          v-for="(item, i) in ['asset 1', 'asset 2', 'asset 3', 'asset 4', 'asset 5', 'asset 6']"
        >{{item}}</button>
      </div>
      <p class="label">name</p>
      <input type="text" v-model="asset.name" />
      <p class="label">description</p>
      <textarea v-model="asset.media.description" />
      <p class="label">media</p>
      <FileDrop />
      <p class="label">position</p>
      <Vector :fields="['x','y','z']" @vector="$set(asset.transform, 'position', $event)" />
      <p class="label">rotation</p>
      <Vector :fields="['x','y','z']" @vector="asset.transform.rotation=$event" />
      <p class="label">scale</p>
      <Vector :fields="['x']" @vector="asset.transform.scale=$event.x" />
    </div>
  </div>
</template>

<script>
import FileDrop from "./FileDrop";
import Vector from "./Vector";

export default {
  name: "AssetEditor",
  props: ["assets"],
  components: {
    FileDrop,
    Vector
  },
  data() {
    return {
      asset: undefined,
      selected: 0
    };
  },
  watch: {
    inAsset: {
      handler: function(value) {
        this.asset = value || {
          name: "asset",
          media: {
            type: 0,
            url: "",
            description: ""
          },
          transform: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: 1
          },
          hidden: false
        };
      },
      immediate: true
    },
    asset: {
      handler: function(value) {
        console.log("asset", value);
        this.$emit("asset", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
