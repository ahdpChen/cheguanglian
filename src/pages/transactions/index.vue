<template>
  <div class="transactions-page">
    <button @click="navigateToPage('transactionDetail')">明细list</button>
  </div>
</template>
<script>
export default {
  name: "transactions",
  methods: {
    navigationToPage(path) {
      const url = `../${path}/main`;
      wx.navigateTo({ url });
    }
  }
};
</script>
<style lang="scss" scoped>
.transactions-page {
}
</style>
