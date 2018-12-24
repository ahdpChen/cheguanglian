<template>
  <ul>
    <li
      v-for="(searchType, index) in typeList"
      :data-searchType="searchType"
      :key="index"
      @click="select"
    >{{ searchType.typeText }}</li>
  </ul>
</template>
<script>
export default {
  name: "searchTypeList",
  props: ["typeList"],
  methods: {
    select(e) {
      const { searchtype } = e.target.dataset;
      this.$emit("searchKeyType", searchtype);
    }
  },
  mounted() {
    // console.log(this.typeList);
  }
};
</script>
