<template>
  <div id="display" v-if="display">
    <hr />
    <div id="actions">
      <select id="type" v-model="display.type">
        <option value="0">Text</option>
        <option value="1">Image</option>
        <option value="2">Audio</option>
        <option value="3">Video</option>
        <option value="4">3D Model</option>
      </select>
      <button id="delete" @click="$emit('delete', index)">X</button>
    </div>
    <textarea class="body" v-if="display.type==0" v-model="display.content" />
    <div v-else id="url">
      <p>URL</p>
      <input type="text" v-model="display.content" />
    </div>
    <Vector :length="3" :label="'position [X, Y, Z]'" @vector="updatePos($event)" />
    <Vector :length="4" :label="'quaternion [X, Y, Z, W]'" @vector="updateRot($event)" />
  </div>
</template>

<script>
import Vector from "./Vector";

export default {
  name: "DisplayEditor",
  props: ["index", "inDisplay"],
  components: {
    Vector
  },
  data() {
    return {
      display: undefined
    };
  },
  watch: {
    inDisplay: {
      handler: function(value) {
        this.display = value || {
          type: 0,
          content: "Lorem ipsum aray-uray",
          transform: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        };
      },
      immediate: true
    },
    display: {
      handler: function(value) {
        this.$emit("display", value);
      },
      deep: true
    }
  },
  methods: {
    updatePos(v3) {
      this.display.transform = this.display.transform.splice(0, 3, ...v3);
    },
    updateRot(v4) {
      this.display.transform = this.display.transform.splice(0, 3, ...v4);
    }
  }
};
</script>

<style scoped>
#display {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
#display > * {
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
#delete {
  width: 30px;
  color: var(--nord11);
}
#url {
  display: flex;
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
