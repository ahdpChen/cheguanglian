<template>
  <div class="search-page">
    <div class="input-wrap">
      <input type="text" placeholder="搜索车牌号/广告名" v-model="searchText" @input="beforeSearch">
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap">
        <ul v-if="searchResult.length">
          <li
            v-for="(advert, index) in searchResult"
            :key="index"
            @click="jumpPage('advertItem', advert.carNumber)"
          >
            <div class="advert-content">
              <div class="advert-name">
                <span>{{ advert.name }}</span>
                <span>{{ advert.workTime }}</span>
              </div>
              <p class="advert-time">
                <span>{{ advert.time }}</span>
                <span>{{ advert.desc }}</span>
              </p>
            </div>
            <div class="arrow"></div>
          </li>
        </ul>
        <div class="empty" v-if="isSearching && !searchResult.length">未搜索到相关车辆/广告</div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import api from "@/utils/ajax";
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "search",
  data() {
    return {
      searchText: "",
      searchResult: [],
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
      return this.searchResult.length < this.pageParams.total;
    },
    isSearching() {
      return !!this.searchText.replace(/^\s+|\s+$/g, "");
    }
  },
  methods: {
    beforeSearch() {
      delay(this.search, 500);
    },
    async search() {
      this.pageParams.page = 1;
      const {
        searchText,
        pageParams: { limit },
        offset,
        isSearching
      } = this;
      if (!isSearching) {
        this.searchResult = [];
        this.pageParams.total = 0;
        return;
      }
      const res = await api.getAdvertList({
        offset,
        limit,
        search: searchText
      });
      if (res && res.code === 200) {
        const { rows, total } = res.data;
        this.searchResult = rows.map(row => {
          return this.formateRows(row);
        });
        this.pageParams.total = total;
      } else {
        this.searchResult = [];
        this.pageParams.total = 0;
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
        name: `${carNumber}|${brand}`,
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
    jumpPage(path, carNumber) {
      const url = `../${path}/main?carNumber=${carNumber}`;
      wx.navigateTo({ url });
    }
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
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  .input-wrap {
    width: 100%;
    height: 47px;
    padding: 0 30px;
    margin-bottom: 10px;
    box-sizing: border-box;
    input {
      width: 100%;
      height: 100%;
      padding-left: 20px;
      font-size: 14px;
      background: #ebebeb;
      border-radius: 10px;
      box-sizing: border-box;
    }
  }
  .scroll-container {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 0 30px;
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
      .empty {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        text-align: center;
        color: #aeb3c0;
      }
    }
  }
}
</style>


