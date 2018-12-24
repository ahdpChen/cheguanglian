<template>
  <div class="search-page">
    <div class="search-wrap">
      <div class="search-type" @click="searchKeyClick">
        <span>{{ defaultType.typeText }}</span>
        <div class="arrow"></div>
      </div>
      <div class="input-wrap">
        <input type="text" placeholder="搜索车牌号/广告名" v-model="searchText" @input="beforeSearch">
      </div>
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap">
        <ul v-if="searchResult.length">
          <li
            v-for="(advert, index) in searchResult"
            :key="index"
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
      delay(this.search, 500);
    },
    searchKeyClick() {
      this.isSearchTypeClick = !this.isSearchTypeClick;
    },
    searchKeyType(type) {
      this.defaultType = type;
      this.isSearchTypeClick = false;
      this.search();
    },
    async search() {
      this.pageParams.page = 1;
      const {
        searchText,
        pageParams: { limit },
        offset,
        isSearching,
        searchKey
      } = this;
      if (!isSearching) {
        this.searchResult = [];
        this.pageParams.total = 0;
        return;
      }
      const res = await api.getAdvertList({
        offset,
        limit,
        [searchKey]: searchText
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
        carWashId,
        day,
        minTimeLen,
        exchangeMinLen,
        firstPostdTime,
        freeDay,
        exchangePeriod,
        isGetBT
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
      if (this.status === "FINISHED") {
        formateRow.workTime = `已空闲${freeDay}天`;
        if (!isGetBT) {
          formateRow.desc = `请于${exchangePeriod}前领取补贴，逾期作废`;
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
          workTime = `已贴${day} | 距结束${minTimeLen}`;
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
      padding-left: 15px;
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


