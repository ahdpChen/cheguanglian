<template>
  <div class="transactionDetail-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <ul>
          <li>
            <span>交易金额</span>
            <span
              class="amount"
            >{{ selectedTransaction.type === '提现'? '-': '+' }}￥{{ selectedTransaction.formateAmount }}</span>
          </li>
          <li>
            <span>交易类型</span>
            <span>{{ selectedTransaction.type }}</span>
          </li>
          <li>
            <span>交易时间</span>
            <span>{{ selectedTransaction.createTime }}</span>
          </li>
          <li>
            <span>流水单号</span>
            <span>{{ selectedTransaction.flowCode }}</span>
          </li>
          <li>
            <span>银行卡</span>
            <span>{{ selectedTransaction.rmark }}</span>
          </li>
          <li>
            <span>状态</span>
            <span>{{ selectedTransaction.status }}</span>
          </li>
        </ul>
      </div>
    </scroll-view>
  </div>
</template>
<script>
export default {
  name: "transactionDetail",
  data() {
    return {
      selectedTransaction: {}
    };
  },
  onShow() {
    const { id } = this.$root.$mp.query;
    this.selectedTransaction = this.$store.state.transactions.transactionsData.filter(
      transaction => {
        return transaction.id === parseInt(id);
      }
    )[0];
  }
};
</script>
<style lang="scss" scoped>
.transactionDetail-page {
  .scroll-container {
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 0 20px;
      ul {
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 44px;
          span {
            font-size: 14px;
            color: #1b1b4e;
            &.amount {
              font-size: 30px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
