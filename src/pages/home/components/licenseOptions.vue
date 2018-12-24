<template>
  <ul>
    <li
      v-for="(option, index) in licenseOptions"
      :data-option="option"
      :key="index"
      @click="select"
    >{{ option.name }}</li>
  </ul>
</template>
<script>
export default {
  name: "licenseOptions",
  props: ["licenseOptions"],
  methods: {
    select(e) {
      const { option } = e.target.dataset;
      this.$emit("licenseOption", option);
    }
  },
  mounted() {
    // console.log(this.licenseOptions)
  }
};
</script>
