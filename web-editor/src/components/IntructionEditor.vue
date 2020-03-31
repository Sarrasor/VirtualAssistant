<template>
  <div>
    <vs-input label="ID" placeholder="Placeholder" v-model="id" />
  </div>
</template>

<script>
export default {
  name: "InstructionEditor",
  data() {
    return {
      id: 0,
      name: "",
      description: "",
      image: null
    };
  }
};
</script>
