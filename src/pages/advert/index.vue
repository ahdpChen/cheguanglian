<template>
  <div class="advert-page">
    <scroll-view
      class="scroll-container"
      scroll-y
      enable-back-to-top
      @scroll="scroll"
      @scrolltolower="pullUploadMore"
    >
      <div class="scroll-wrap">
        <div class="input-wrap">
          <input type="text" placeholder="搜索车牌号/广告名" disabled @click="jumpPage('searchAdvert')">
        </div>
        <div class="advert-tab" :class="{ fixed: isScroll }">
          <ul>
            <li
              :class="{ selected: tabIndex === index }"
              v-for="(tab, index) in advertTabs"
              :key="index"
              @click="changeTab(index)"
            >{{ tab.name + tab.count }}</li>
          </ul>
        </div>
        <div class="advert-list" v-if="advertList.length">
          <ul>
            <li
              v-for="(advert, index) in advertList"
              :key="index"
              @click="jumpPage('advertItem', advert.carNumber)"
            >
              <div class="advert-content">
                <div class="advert-name">
                  <span>{{ advert.name }}</span>
                  <span>{{ advert.workTime }}</span>
                </div>
                <p class="advert-time">
                  <span :class="{ re }">{{ advert.desc }}</span>
                  <span>{{ advert.time }}</span>
                </p>
              </div>
              <div class="arrow"></div>
            </li>
          </ul>
          <div class="loadMore">{{loadMore? '加载更多': '没有更多了'}}</div>
        </div>
        <div v-else class="empty">
          <p class="tip">暂无广告，继续加油！</p>
          <img src="./images/empty.png" alt>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import api from "@/utils/ajax";

export default {
  name: "advert",
  data() {
    return {
      advertTabs: [
        {
          id: 1,
          name: "全部",
          count: ""
        },
        {
          id: 2,
          name: "广告中",
          count: ""
        },
        {
          id: 3,
          name: "空闲",
          count: ""
        }
      ],
      tabIndex: 0,
      advertList: [],
      pageParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      isScroll: false
    };
  },
  computed: {
    offset() {
      const { page, limit } = this.pageParams;
      return (page - 1) * limit;
    },
    status() {
      let status;
      switch (this.tabIndex) {
        case 0:
          status = "";
          break;
        case 1:
          status = "PASS";
          break;
        case 2:
          status = "FINISHED";
          break;
        default:
          status = "";
      }
      return status;
    },
    loadMore() {
      return this.advertList.length < this.pageParams.total;
    }
  },
  methods: {
    async getAdvertList() {
      const {
        pageParams: { page, limit },
        offset,
        status,
        tabIndex
      } = this;
      const res = await api.getAdvertList({ offset, limit, status });
      if (res && res.code === 200) {
        const { rows, total } = res.data;
        this.advertList = rows.map(row => {
          return this.formateRows(row);
        });
        this.pageParams.total = total;
        this.advertTabs[tabIndex].count = total;
      }
    },
    formateRows(row) {
      const {
        brand,
        carNumber,
        day,
        minTimeLen,
        exchangeMinLen,
        firstPostdTime,
        freeDay,
        exchangePeriod,
        isGetBT
      } = row;
      let formateRow = {
        carNumber,
        name: `${carNumber} | ${brand}`,
        time: "",
        workTime: "",
        desc: ""
      };
      if (this.status === "FINISHED") {
        formateRow.workTime = `已空闲${freeDay}天`;
        if (!isGetBT) {
          formateRow.desc = `请于${exchangePeriod}前领取补贴，逾期作废`;
        }
      } else {
        let workTime = "";
        let desc = "";
        if (day < minTimeLen) {
          workTime = `已贴${day}天 | 最少${minTimeLen}天`;
          if (day < exchangeMinLen) {
            desc = `差${exchangeMinLen - day}天可领取补贴`;
          } else {
            desc = `差${minTimeLen - day}天可更换广告`;
          }
        } else {
          workTime = `已贴${day}|距结束${minTimeLen}`;
        }
        formateRow.workTime = workTime;
        formateRow.desc = desc;
        formateRow.time = firstPostdTime;
      }
      return formateRow;
    },
    scroll(e) {
      const { scrollTop } = e.mp.detail;
      this.isScroll = scrollTop > 60;
    },
    pullUploadMore() {
      if (!this.loadMore) {
        return;
      }
      this.pageParams.page++;
      this.getAccountDetail();
    },
    changeTab(index) {
      if (this.tabIndex === index) {
        return;
      }
      this.tabIndex = index;
      this.pageParams.page = 1;
      this.getAdvertList();
    },
    jumpPage(path, carNumber) {
      const url = `../${path}/main?carNumber=${carNumber}`;
      wx.navigateTo({ url });
    }
  },
  onShow() {
    this.getAdvertList();
  },
  onShareAppMessage(res) {
    let { share } = this.$store.state;
    return share;
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>
<style lang="scss" scoped>
.advert-page {
  box-sizing: border-box;
  .scroll-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 10px 30px 0;
    }
  }
  .input-wrap {
    width: 100%;
    height: 47px;
    margin-bottom: 10px;
    background: #ebebeb;
    border-radius: 10px;
    input {
      width: 100%;
      height: 100%;
      padding-left: 20px;
      font-size: 14px;
    }
  }
  .advert-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
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
  .fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 30px;
    z-index: 2;
    background: #fff;
    box-sizing: border-box;
    & + .advert-list {
      padding-top: 60px;
    }
  }
  .advert-list {
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        margin-bottom: 10px;
        .advert-content {
          flex: 1;
          .advert-name,
          .advert-time {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 24px;
          }
          .advert-name {
            color: #1b1b4e;
          }
          .advert-time {
            color: #aeb3c0;
          }
        }
        .arrow {
          width: 8px;
          height: 22px;
          margin-left: 24px;
          background: url("./images/arrow.png") center/100% no-repeat;
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
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100vh - 170px);
    padding-bottom: 60px;
    box-sizing: border-box;
    .tip {
      height: 60px;
      line-height: 60px;
      margin-bottom: 40px;
      font-size: 14px;
      text-align: center;
      color: #aeb3c0;
    }
    img {
      display: block;
      width: 300px;
    }
  }
}
</style>
