<template>
  <div id="root">
    <input
      type="number"
      step="0.1"
      :style="{width: width}"
      :key="k"
      :ref="k"
      @input="validate(k)"
      @blur="blur(k)"
      v-for="k in skeys"
    />
  </div>
</template>

<script>
export default {
  name: "Vector",
  props: ["vector", "min", "keys"],
  computed: {
    skeys: function() {
      return this.keys ?? Object.keys(this.vector);
    },
    width: function() {
      return 100 / this.skeys.length + "%";
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
      for (let k of this.skeys) this.blur(k);
    },
    blur(k) {
      this.$refs[k][0].value = this.vector[k];
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
