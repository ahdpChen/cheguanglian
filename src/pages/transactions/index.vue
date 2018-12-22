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
    <scroll-view
      class="scroll-container"
      scroll-y
      enable-back-to-top
      @scrolltolower="pullUploadMore"
    >
      <div class="scroll-wrap">
        <div class="transaction-list">
          <ul>
            <li
              v-for="(item, index) in transactionsData"
              :key="index"
              @click="navigationToPage('transactionDetail', item.id)"
            >
              <div class="flex transaction-info">
                <p>{{ item.type }}</p>
                <p>{{ item.createTime }}</p>
              </div>
              <div class="flex transaction-status">
                <p>{{ item.type === '提现'? '-': '+' }}￥{{ item.formateAmount }}</p>
                <p v-if="item.status">{{ item.status }}</p>
              </div>
              <div class="arrow"></div>
            </li>
          </ul>
        </div>
        <div class="loadMore">{{loadMore? '加载更多': '没有更多了'}}</div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/utils/ajax";

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
      transactionsData: [],
      pageParams: {
        page: 1,
        limit: 10,
        total: 0
      }
    };
  },
  computed: {
    offset() {
      const { page, limit } = this.pageParams;
      return (page - 1) * limit;
    },
    loadMore() {
      return this.transactionsData.length < this.pageParams.total;
    }
  },
  methods: {
    ...mapActions(["settransactions"]),
    async getAccountDetail() {
      const {
        tabIndex,
        offset,
        pageParams: { page, limit }
      } = this;
      const res = await api.accountDetail(tabIndex, offset, limit);
      if (res && res.code === 200) {
        const currData = page === 1 ? [] : this.transactionsData;
        const { rows, total } = res.data;
        rows.forEach(row => {
          row.formateAmount = row.amount.toFixed(2);
        });
        this.transactionsData = currData.concat(rows);
        this.pageParams.total = total;
        this.settransactions(this.transactionsData);
      }
    },
    changeTab(index) {
      if (this.tabIndex === index) {
        return;
      }
      this.tabIndex = index;
      this.pageParams.page = 1;
      this.getAccountDetail();
    },
    pullUploadMore() {
      if (!this.loadMore) {
        return;
      }
      this.pageParams.page++;
      this.getAccountDetail();
    },
    navigationToPage(path, id) {
      let url = `../${path}/main`;
      if (id) {
        url += `?id=${id}`;
      }
      wx.navigateTo({ url });
    }
  },
  async onShow() {
    wx.setNavigationBarTitle({
      title: "明细"
    });
    this.getAccountDetail();
  },
  mounted() {}
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
                // width: 60px;
                height: 100%;
              }
            }
            .arrow {
              width: 8px;
              height: 22px;
              margin-left: 10px;
              background: url("./images/arrow.png") center/100% no-repeat;
            }
          }
        }
      }
      .loadMore {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 16px;
        color: #1b1b4e;
      }
    }
  }
}
</style>
