<template>
  <ul>
    <li
      v-for="(option, index) in selectOptions"
      :data-option="option"
      :key="index"
      @click="selectOption"
    >{{ option.brand }} ({{option.formateMinTimeLen}}起，{{option.endTime}}结束)</li>
  </ul>
</template>
<script>
export default {
  name: "selectOptions",
  props: ["selectOptions"],
  methods: {
    selectOption(e) {
      const { option } = e.target.dataset;
      this.$emit("selectOption", option);
    }
  }
};
</script>
