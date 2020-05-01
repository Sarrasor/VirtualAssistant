<template>
  <div>
    <div class="card">
      <p class="label bold">assets</p>
      <template v-if="assets">
        <div class="toolbar">
          <button @click="createAsset" :tooltip="'create new'">
            <i class="material-icons-outlined">add</i>
          </button>
          <template v-if="asset">
            <button @click="duplicateAsset" :tooltip="'duplicate'">
              <i class="material-icons-outlined">library_add</i>
            </button>
            <button @click="asset.billboard=!asset.billboard" :tooltip="'awlays face camera'">
              <i v-if="asset.billboard" class="material-icons-outlined">screen_rotation</i>
              <i v-else class="material-icons-outlined">screen_lock_rotation</i>
            </button>
            <button @click="asset.hidden=!asset.hidden" :tooltip="'toggle visibility'">
              <i v-if="asset.hidden" class="material-icons-outlined">visibility_off</i>
              <i v-else class="material-icons-outlined">visibility</i>
            </button>
            <button @click="deleteAsset" :tooltip="'delete'">
              <i class="material-icons-outlined">delete</i>
            </button>
          </template>
        </div>
        <div v-if="assets.length>0" class="list" style="height: 125px">
          <button
            :class="{selected: i===selected}"
            :key="i"
            @click="selected=i"
            v-for="(ast, i) in assets"
          >{{ast.name}}</button>
        </div>
      </template>
      <template v-if="asset">
        <p class="label">name</p>
        <input type="text" v-model="asset.name" />
        <p class="label">description</p>
        <textarea v-model="asset.media.description" />
        <p class="label">media</p>
        <FileDrop v-model="asset.media.url" />
        <p class="label">position</p>
        <Vector :vector="asset.transform.position" />
        <p class="label">orientation</p>
        <Vector :vector="asset.transform.orientation" />
        <p class="label">scale</p>
        <Vector :min="0.1" :vector="asset.transform" :keys="['scale']" />
      </template>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import FileDrop from "./FileDrop";
import Vector from "./Vector";

export default {
  name: "Asset",
  props: ["assets"],
  components: {
    FileDrop,
    Vector
  },
  data() {
    return {
      selected: undefined
    };
  },
  computed: {
    asset: function() {
      this.$emit("select", this.selected);
      return this.assets?.length > 0 ? this.assets[this.selected] : null;
    }
  },
  watch: {
    assets(value) {
      if (value) this.selectLast();
    }
  },
  methods: {
    createAsset() {
      this.assets.push({
        id: uuidv4(),
        name: "Asset " + (this.assets.length + 1),
        media: {
          type: 0,
          url: "",
          description: ""
        },
        transform: {
          position: { x: 0, y: 0, z: 0 },
          orientation: { x: 0, y: 0, z: 0 },
          scale: 1
        },
        hidden: false,
        billboard: false
      });
      this.selectLast();
    },
    duplicateAsset() {
      let duplicate = JSON.parse(JSON.stringify(this.asset));
      duplicate.id = uuidv4();
      duplicate.name += " (copy)";
      this.assets.push(duplicate);
      this.selectLast();
    },
    deleteAsset() {
      this.assets.splice(this.selected, 1);
      if (this.selected >= this.assets.length) this.selectLast();
    },
    selectLast() {
      this.selected = this.assets.length - 1;
    }
  }
};
</script>

<style scoped>
</style>
