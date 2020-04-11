<template>
  <div>
    <input
      type="number"
      step="0.1"
      :style="{width: 100/fields.length+'%'}"
      :key="k"
      :value="vector[k]"
      @input="update(k, $event.target.value)"
      v-for="k in fields"
    />
  </div>
</template>

<script>
export default {
  name: "Vector",
  props: ["fields"],
  data() {
    return {
      vector: {}
    };
  },
  created() {
    this.fields.forEach(f => (this.vector[f] = 0));
  },
  methods: {
    update(k, v) {
      v = parseFloat(v);
      this.vector[k] = isNaN(v) ? 0 : v;
      this.$emit("vector", this.vector);
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
/* input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
} */
</style>
