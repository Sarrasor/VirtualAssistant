<template>
  <div id="root">
    <input
      type="number"
      step="0.1"
      :style="{width: width}"
      :key="i"
      :ref="k"
      @input="validate(k)"
      @blur="blur(k)"
      v-for="(k, i) of keys"
    />
  </div>
</template>

<script>
export default {
  name: "Vector",
  props: ["vector", "min"],
  computed: {
    keys: function() {
      return Object.keys(this.vector);
    },
    width: function() {
      return 100 / this.keys.length + "%";
    }
  },
  watch: {
    vector: {
      handler() {
        this.blurAll();
      },
      deep: true
    }
  },
  mounted() {
    this.blurAll();
  },
  methods: {
    blurAll() {
      for (let k in this.vector) this.blur(k);
    },
    blur(k) {
      this.$refs[k][0].value = this.vector[k];
      console.log("blur", k);
    },
    validate(k) {
      let value = this.$toFloat(this.$refs[k][0].value);
      this.vector[k] = this.min ? Math.max(this.min, value) : value;
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
