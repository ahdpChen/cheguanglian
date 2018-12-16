<template>
  <div class="transactionDetail-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <ul>
          <li>
            <span>交易金额</span>
            <span class="amount">-￥5.00</span>
          </li>
          <li>
            <span>交易类型</span>
            <span>提现</span>
          </li>
          <li>
            <span>交易时间</span>
            <span>2018-12-16 20:26:20</span>
          </li>
          <li>
            <span>流水单号</span>
            <span>TXGY271520181230123020</span>
          </li>
          <li>
            <span>银行卡</span>
            <span>中国建设银行储蓄卡(1234)</span>
          </li>
          <li>
            <span>状态</span>
            <span>审核中...</span>
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
    return {};
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
