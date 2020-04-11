<template>
  <div>
    <div class="card">
      <p class="label bold">assets</p>
      <div class="toolbar">
        <button @click="createAsset" :tooltip="'create new'">
          <i class="material-icons-outlined">add</i>
        </button>
        <button @click="duplicateAsset" :tooltip="'duplicate'">
          <i class="material-icons-outlined">library_add</i>
        </button>
        <button @click="deleteAsset" :tooltip="'delete'">
          <i class="material-icons-outlined">delete</i>
        </button>
      </div>
      <div class="list" style="height: 125px">
        <button
          :class="{selected: i===selected}"
          :key="i"
          @click="selected=i"
          v-for="(ast, i) in assets"
        >{{ast.name}}</button>
      </div>
      <template v-if="asset">
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
        <input type="checkbox" id="visible" v-model="asset.hidden" />
        <label for="visible">Hidden</label>
      </template>
    </div>
  </div>
</template>

<script>
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
      return this.assets?.length > 0 ? this.assets[this.selected] : null;
    }
  },
  watch: {
    selected: {
      handler: function(value) {
        this.$emit("select", value);
      },
      immediate: true
    },
    asset: {
      handler() {
        console.log("asset update");
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    createAsset() {
      console.log(this.assets);
      if (!this.assets) return;

      this.assets.push({
        name: "Asset " + (this.assets.length + 1),
        media: {
          type: 0,
          url: undefined,
          description: "Lorem impsum dolor sit amet"
        },
        transform: {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 0
        },
        hidden: false
      });
      this.selected = this.assets.length - 1;
    },
    duplicateAsset() {
      if (!this.assets) return;

      let duplicate = JSON.parse(JSON.stringify(this.assets[this.selected]));
      duplicate.name += "(copy)";
      this.assets.push(duplicate);
      this.selected = this.assets.length - 1;
    },
    deleteAsset() {
      if (!this.assets) return;

      this.assets.splice(this.selected, 1);
      if (this.selected >= this.assets.length)
        this.selected = this.assets.length - 1;
    }
  }
};
</script>

<style scoped>
</style>
