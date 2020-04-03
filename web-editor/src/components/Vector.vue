<template>
  <div>
    <p id="label">{{label}}</p>
    <div id="vector">
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
}
#vector {
  display: flex;
  width: 100%;
}
input:first-child {
  border-radius: 4px 0 0 4px;
}
input:last-child {
  border-radius: 0 4px 4px 0;
}
input {
  -moz-appearance: textfield;
  -webkit-appearance: none;

  border-radius: 0;
}
/*input:not(:first-child) {
  margin-left: -2px;
} */

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
