<template>
  <div id="root">
    <input
      type="number"
      step="0.1"
      :style="{width: width}"
      :key="i"
      :value="vector[k]"
      @input="vector[k] = $toFloat($event.target.value)"
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
