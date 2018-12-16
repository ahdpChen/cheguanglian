<template>
  <div class="transactions-page">
    <div class="transaction-tabcard">
      <ul>
        <li
          :class="{ selected: tabIndex === index }"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
        >{{ tab.name }}</li>
      </ul>
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <div class="transaction-list">
          <ul>
            <li
              v-for="(item, index) in transactionsData"
              :key="index"
              @click="navigationToPage('transactionDetail')"
            >
              <div class="flex transaction-info">
                <p>{{ item.title }}</p>
                <p>{{ item.transactionDate }}</p>
              </div>
              <div class="flex transaction-status">
                <p>-￥{{ item.money }}</p>
                <p v-if="item.status">{{ item.status }}</p>
              </div>
              <div class="arrow"></div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
export default {
  name: "transactions",
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: "全部"
        },
        {
          id: 2,
          name: "收入"
        },
        {
          id: 3,
          name: "支出"
        }
      ],
      tabIndex: 0,
      transactionsData: [
        {
          title: "提现",
          money: 5,
          transactionDate: "2018-12-30 12:30:20",
          status: "处理中..."
        },
        {
          title: "提现",
          money: 5,
          transactionDate: "2018-12-30 12:30:20",
          status: "处理中..."
        },
        {
          title: "提现",
          money: 5,
          transactionDate: "2018-12-30 12:30:20",
          status: ""
        },
        {
          title: "提现",
          money: 5,
          transactionDate: "2018-12-30 12:30:20",
          status: "处理中..."
        }
      ]
    };
  },
  methods: {
    navigationToPage(path) {
      const url = `../${path}/main`;
      wx.navigateTo({ url });
    },
    changeTab(index) {
      this.tabIndex = index;
    }
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "明细"
    });
  }
};
</script>
<style lang="scss" scoped>
.transactions-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .transaction-tabcard {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    padding: 0 20px;
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      li {
        width: 30%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #1b1b4e;
        &.selected {
          font-size: 16px;
          color: #fff;
          background: #545dff;
          box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
          border-radius: 6px;
        }
      }
    }
  }
  .scroll-container {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      .transaction-list {
        ul {
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            padding: 0 20px;
            .flex {
              &:first-child {
                flex: 1;
              }
              p {
                font-size: 14px;
                line-height: 14px;
                color: #1b1b4e;
                & + p {
                  color: #aeb3c0;
                  margin-top: 10px;
                }
              }
              &.transaction-status {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                width: 60px;
                height: 100%;
              }
            }
            .arrow {
              width: 8px;
              height: 22px;
              background: url("./images/arrow.png") center/100% no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
