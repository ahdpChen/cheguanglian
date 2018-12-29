<template>
  <div class="search-page">
    <div class="search-wrap">
      <div class="search-type" @click="searchKeyClick">
        <span>{{ defaultType.typeText }}</span>
        <div class="arrow"></div>
      </div>
      <div class="input-wrap">
        <input type="text" placeholder="请输入完整车牌或广告名" v-model="searchText" @input="beforeSearch">
      </div>
      <div class="clear-btn" @click.stop="clearInput" v-if="isSearching"></div>
    </div>
    <scroll-view
      class="scroll-container"
      scroll-y
      enable-back-to-top
      @scrolltolower="pullUploadMore"
    >
      <div class="scroll-wrap">
        <div v-if="searchResult.length">
          <ul>
            <li
              v-for="(advert, index) in searchResult"
              :key="index"
              v-if="defaultType.typeId === 1 || (defaultType.typeId === 2 && !advert.isFromOtherShop)"
              @click="jumpPage('advertItem', advert)"
            >
              <div class="advert-content">
                <div class="advert-name">
                  <span>{{ advert.name }}</span>
                  <span>{{ advert.workTime }}</span>
                </div>
                <p class="advert-time">
                  <span :class="{ red: advert.isRed }">{{ advert.desc }}</span>
                  <span>{{ advert.time }}</span>
                </p>
              </div>
              <div class="arrow" v-if="!advert.isFromOtherShop"></div>
            </li>
          </ul>
          <div class="loadMore">{{loadMore? '加载更多': '没有更多了'}}</div>
        </div>
        <div class="empty" v-if="isSearching && !searchResult.length">未搜索到相关车辆/广告</div>
      </div>
    </scroll-view>
    <base-modal
      customClass="search-modal"
      position="top"
      v-if="isSearchTypeClick"
      @showModal="searchKeyClick"
    >
      <div class="search-container">
        <search-type-list-modal :typeList="typeList" @searchKeyType="searchKeyType"/>
      </div>
      <div class="arrow">
        <span></span>
      </div>
    </base-modal>
  </div>
</template>
<script>
import api from "@/utils/ajax";
import baseModal from "@/components/baseModal";
import searchTypeListModal from "./components/searchTypeList";

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
  components: {
    baseModal,
    searchTypeListModal
  },
  data() {
    return {
      typeList: [
        {
          typeId: 1,
          typeText: "车牌号"
        },
        {
          typeId: 2,
          typeText: "广告名"
        }
      ],
      defaultType: {},
      searchText: "",
      searchResult: [],
      pageParams: {
        page: 1,
        limit: 10,
        total: 0
      },
      isSearchTypeClick: false
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
    },
    carWashId() {
      const {
        loginInfo: { carWashId }
      } = this.$store.state;
      return carWashId;
    },
    searchKey() {
      return this.defaultType.typeId === 2 ? "brand" : "carNumber";
    }
  },
  methods: {
    beforeSearch() {
      // 车牌号完整性校验
      if (this.defaultType.typeId === 1) {
        const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if (this.searchText.toLocaleUpperCase().search(reg) === -1) {
          return false;
        }
      }
      this.pageParams.page = 1;
      delay(this.search, 500);
    },
    searchKeyClick() {
      this.isSearchTypeClick = !this.isSearchTypeClick;
    },
    searchKeyType(type) {
      this.defaultType = type;
      this.isSearchTypeClick = false;
      this.pageParams.page = 1;
      this.search();
    },
    async search() {
      let {
        searchText,
        pageParams: { limit, page },
        offset,
        isSearching,
        searchKey
      } = this;
      if (!isSearching) {
        this.searchResult = [];
        this.pageParams.total = 0;
        return;
      }
      // 车牌号字母转大写
      if (this.defaultType.typeId === 1) {
        searchText = searchText.toLocaleUpperCase();
      }
      const res = await api.getAdvertList({
        offset,
        limit,
        [searchKey]: searchText
      });
      if (res && res.code === 200) {
        const { rows, total } = res.data;
        const currData = page === 1 ? [] : this.searchResult;
        this.searchResult = currData.concat(
          rows.map(row => {
            return this.formateRows(row);
          })
        );
        this.pageParams.total = total;
      } else {
        this.searchResult = [];
        this.pageParams.total = 0;
      }
    },
    fmtDate(time) {
      var date = new Date(time);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return (
        y +
        "-" +
        m.substring(m.length - 2, m.length) +
        "-" +
        d.substring(d.length - 2, d.length)
      );
    },
    formateRows(row) {
      const {
        brand,
        carNumber,
        carWashId,
        day,
        minTimeLen,
        exchangeMinLen,
        firstPostdTime,
        freeDay,
        exchangePeriod,
        isGetBT,
        status //UNAUDITED("UNAUDITED", "未审核"),UNPASS("UNPASS","审核未通过"), PASS("PASS", "审核通过"),FINISHED("FINISHED","已完成");
      } = row;

      const isFromOtherShop = this.carWashId !== carWashId; //是否来自本店

      let formateRow = {
        carNumber,
        name: `${carNumber} | ${brand}`,
        time: "",
        workTime: "",
        desc: "",
        isRed: false,
        isFromOtherShop
      };
      if (status === "FINISHED") {
        formateRow.name = `${carNumber}`;
        formateRow.workTime = parseFloat(freeDay)
          ? `已空闲${freeDay}天`
          : "开始空闲";
        if (!isGetBT) {
          formateRow.desc = `请于${this.fmtDate(
            new Date(exchangePeriod.replace(/-/g, "/")).getTime()
          )}(含)前领取补贴，逾期作废`;
          formateRow.isRed = true;
        }
        if (isFromOtherShop) {
          formateRow.desc = "该广告在其他店张贴，无权拍照或更换";
          formateRow.isRed = true;
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
          if (isFromOtherShop) {
            desc = "来自其他店";
          }
        } else {
          workTime = `已贴${day}天 | 距结束${minTimeLen}天`;
          if (isFromOtherShop) {
            formateRow.desc = "该广告在其他店张贴，无权拍照或更换";
            formateRow.isRed = true;
          }
        }
        formateRow.workTime = workTime;
        formateRow.desc = desc;
        formateRow.time = firstPostdTime;
      }
      return formateRow;
    },
    pullUploadMore() {
      if (!this.loadMore) {
        return;
      }
      this.pageParams.page++;
      this.search();
    },
    clearInput() {
      this.searchText = "";
      this.search();
    },
    jumpPage(path, advert) {
      const { isFromOtherShop, carNumber } = advert;
      if (isFromOtherShop) {
        wx.showToast({
          title: "只能查看本店广告详情",
          icon: "none",
          duration: 2000
        });
        return;
      }
      const url = `../${path}/main?carNumber=${carNumber}`;
      wx.navigateTo({ url });
    }
  },
  onShow() {
    this.defaultType = this.typeList[0];
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
<style lang="scss">
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  .search-wrap {
    width: calc(100% - 40px);
    margin: 0 auto 20px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ebebeb;
    border-radius: 10px;
    box-sizing: border-box;
    .search-type {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .arrow {
        width: 8px;
        height: 22px;
        margin-left: 10px;
        background: url("./images/arrow.png") center/100% no-repeat;
        transform: rotate(90deg);
      }
    }
    .input-wrap {
      flex: 1;
      height: 47px;
      box-sizing: border-box;
      input {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        font-size: 14px;
        box-sizing: border-box;
      }
    }
    .clear-btn {
      width: 23px;
      height: 23px;
      background: url("./images/clear.png") center/100% no-repeat;
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
              color: #aeb3c0;
              span {
                &:first-child {
                  color: #1b1b4e;
                }
                &.red {
                  color: #fd687d;
                }
              }
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
      .empty {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        text-align: center;
        color: #aeb3c0;
      }
    }
  }
  .search-modal {
    .modal-wrap {
      height: 45% !important;
      padding-bottom: 10px;
      overflow: hidden;
    }
    .search-container {
      position: relative;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul {
        li {
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 14px;
          color: #1b1b4e;
        }
      }
    }
    .arrow {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 8px;
        height: 18px;
        background: url("./images/arrow.png") center/100% no-repeat;
        transform: rotate(-90deg);
      }
    }
  }
}
</style>


