<template>
  <div id="vector">
    <p id="label" v-if="label">{{label}}</p>
    <input
      type="number"
      step="0.01"
      :style="{width: 100/length + '%'}"
      :key="i"
      :value="vector[i-1]"
      @input="update(i-1, $event.target.value)"
      v-for="i in length"
    />
  </div>
</template>

<script>
export default {
  name: "Vector",
  props: ["length", "label"],
  data() {
    return {
      vector: undefined
    };
  },
  watch: {
    length: {
      handler: function(length) {
        this.vector = Array(length).fill(0);
      },
      immediate: true
    }
  },
  methods: {
    update(i, v) {
      v = parseFloat(v);
      this.vector[i] = isNaN(v) ? 0 : v;
      this.$emit("vector", this.vector);
    }
  }
};
</script>

<style scoped>
#label {
  margin: 5px 0;
  font-style: italic;
  font-size: 12px;
  width: 100%;
}
#vector {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
input:first-of-type {
  border-radius: 4px 0 0 4px;
}
input:last-of-type {
  border-radius: 0 4px 4px 0;
}
input:only-of-type {
  border-radius: 4px;
}
input {
  -moz-appearance: textfield;
  -webkit-appearance: none;
  border-radius: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
