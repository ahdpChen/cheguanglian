<template>
  <div class="advertItem-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <div
          class="advertItem-list"
          :class="{ gray: item.status === 'UNPASS' || item.status === 'FINISHED' }"
          v-for="(item, index) in advertItem"
          :key="index"
          @click="jumpPage(item.id)"
        >
          <div class="flex">
            <div>广告品牌</div>
            <div>{{ item.advertBrand }}</div>
          </div>
          <div class="flex">
            <div>
              首次拍照
              <span
                :class="{ 'unpass': item.statusClass }"
                v-if="item.type === 'FIRST'"
              >({{ item.statusString }})</span>
              <span class="pass" v-else>(审核通过)</span>
            </div>
            <div>
              {{ item.firstTime }}
              <div class="arrow"></div>
            </div>
          </div>
          <div class="flex" v-if="item.type !== 'FIRST'">
            <div>
              返店拍照
              <span :class="{ 'unpass': item.statusClass }">({{ item.statusString }})</span>
            </div>
            <div>
              {{ item.secondTime }}
              <div class="arrow"></div>
            </div>
          </div>
          <div class="flex">
            <div>广告结束</div>
            <div>{{ item.endTime }}</div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import api from "@/utils/ajax";

export default {
  name: "advertItem",
  data() {
    return {
      advertItem: []
    };
  },
  methods: {
    async initData() {
      const { carNumber } = this.$root.$mp.query;
      const res = await api.getAdListByCarNumber(carNumber);
      if (res && res.code === 200) {
        //请求成功
        const { carNumber, adNum, list } = res.data;
        this.advertItem = list.map(item => {
          return this.formateData(item);
        });
        wx.setNavigationBarTitle({
          title: `${carNumber}/${adNum}次广告`
        });
      } else if (res && res.message) {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        });
      }
    },
    formateData(item) {
      const {
        id,
        brand,
        status,
        type,
        firstPostdTime,
        createTime,
        endTime
      } = item;
      let formateItem = {
        id,
        advertBrand: brand,
        status,
        statusString: this.getStatusString(status),
        statusClass: status === 'UNPASS' || status === 'FINISHED',
        type,
        firstTime: firstPostdTime,
        secondTime: createTime,
        endTime
      };
      console.log(formateItem)
      return formateItem;
    },
    getStatusString(status) {
      let statusStr = "";
      switch (status) {
        case "UNAUDITED":
          statusStr = "审核中";
          break;
        case "PASS":
          statusStr = "审核通过";
          break;
        case "UNPASS":
          statusStr = "审核未通过";
          break;
        case "FINISHED":
          statusStr = "已结束";
          break;
        default:
          statusStr = "";
      }
      return statusStr;
    },
    jumpPage(id) {
      const url = `../advertDetail/main?id=${id}`;
      wx.navigateTo({ url });
    }
  },
  onShow() {
    this.initData();
  },
  onShareAppMessage(res) {
    let { share } = this.$store.state;
    return share;
  },
  mounted() {
    // console.log("mounted");
  }
};
</script>
<style lang="scss" scoped>
.advertItem-page {
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
      padding: 0 20px;
      .advertItem-list {
        background: #ffffff;
        box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
        border-radius: 10px;
        margin-bottom: 46px;
        .flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 15px;
          > div {
            line-height: 24px;
            font-size: 14px;
            color: #1b1b4e;
            span {
              color: #545dff;

              &.unpass {
                color: #fd687d;
              }
            }
            &:last-child {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
            .arrow {
              width: 8px;
              height: 22px;
              margin-left: 14px;
              background: url("./images/arrow.png") center/100% no-repeat;
            }
          }
        }
        &.gray {
          .flex {
            div {
              color: #aeb3c0;
            }
          }
        }
      }
    }
  }
}
</style>