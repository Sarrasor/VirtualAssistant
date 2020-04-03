<template>
  <div id="object" v-if="object">
    <div id="actions">
      <select id="type" v-model="object.type">
        <option value="0">Text</option>
        <option value="1">Image</option>
        <option value="2">Audio</option>
        <option value="3">Video</option>
        <option value="4">3D Model</option>
      </select>
      <button id="delete" @click="$emit('delete')">X</button>
    </div>
    <textarea id="content" v-if="object.type==0" v-model="object.content" />
    <input id="content" v-else type="text" v-model="object.content" />
    <Vector :length="3" :label="'position [X, Y, Z]'" @vector="object.position=[...$event]" />
    <Vector :length="4" :label="'quaternion [X, Y, Z, W]'" @vector="object.rotation=[...$event]" />
  </div>
</template>

<script>
import Vector from "./Vector";

export default {
  name: "ObjectEditor",
  props: ["inObject"],
  components: {
    Vector
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
          content: "Lorem ipsum aray-uray",
          position: [0, 0, 0],
          rotation: [0, 0, 0, 0]
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
#actions {
  display: flex;
  margin-right: -5px;
  margin-left: -5px;
}
#actions > * {
  margin: 0 5px;
}
#type {
  flex: 1;
}
textarea#content {
  height: 100px;
}
#delete {
  width: 30px;
  color: var(--nord11);
}
.vector {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  place-content: center;
}

.vector > p:nth-child(1) {
  width: 100%;
  text-align: left;
}

.vector > p {
  margin: 0;
  width: 30px;
  text-align: center;
}
.vector > input {
  width: calc(33% - 30px);
}

.vector.quaternion > input {
  width: calc(25% - 30px);
}
</style>
