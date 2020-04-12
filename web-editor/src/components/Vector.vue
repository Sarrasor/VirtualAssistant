<template>
  <div>
    <input
      type="number"
      step="0.1"
      :style="{width: width}"
      :key="i"
      :value="vector[k]"
      @input="update(k, $event.target.value)"
      v-for="(k, i) of keys"
    />
  </div>
</template>

<script>
export default {
  name: "Vector",
  props: ["vector"],
  computed: {
    keys: function() {
      return Object.keys(this.vector);
    },
    width: function() {
      return 100 / this.keys.length + "%";
    }
  },
  methods: {
    update(k, v) {
      v = parseFloat(v);
      this.vector[k] = isNaN(v) ? 0 : v;
    }
  }
};
</script>

<style scoped>
input {
  -moz-appearance: textfield;
  -webkit-appearance: none;
  border-radius: 0;
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
</style>
