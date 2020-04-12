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
        <Vector :vector="asset.transform.position" />
        <p class="label">rotation</p>
        <Vector :vector="asset.transform.rotation" />
        <p class="label">scale</p>
        <input
          type="number"
          step="0.1"
          :value="asset.transform.scale"
          @input="asset.transform.scale=$toFloat($event.target.value)"
        />
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
      this.$emit("select", this.selected);
      return this.assets?.length > 0 ? this.assets[this.selected] : null;
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
      this.selectLast();
    },
    duplicateAsset() {
      if (!(this.assets && this.asset)) return;

      let duplicate = JSON.parse(JSON.stringify(this.assets[this.selected]));
      duplicate.name += " (copy)";
      this.assets.push(duplicate);
      this.selectLast();
    },
    deleteAsset() {
      if (!this.assets) return;

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
