<template>
  <div class="advertItem-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <div class="advertItem-list gray" v-for="(item,index) in advertItem" :key="index" @click="jumpPage(index)">
          <div class="flex">
            <div>广告牌</div>
            <div>{{ item.advertBrand }}</div>
          </div>
          <div class="flex">
            <div>首次拍照</div>
            <div>
              {{ item.firstTime }}
              <div class="arrow"></div>
            </div>
          </div>
          <div class="flex">
            <div>
              返厂拍照
              <span>({{ item.state }})</span>
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

    <!-- <button @click="jumpPage">广告item</button> -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "advertItem",
  data() {
    return {
      advertItem: [
        {
          advertBrand: "雪花1",
          state: "审核中",
          desc: "",
          photos: [
            "https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg",
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg"
          ],
          photoMan: "尼古拉斯·赵四",
          phone: "13512341234",
          firstTime: "2018-12-13",
          secondTime: "2018-12-14",
          endTime: "2018-12-15"
        },
        {
          advertBrand: "雪花2",
          state: "未通过",
          desc: "xxxxxx，若图片作弊将受处罚，敬请配合",
          photos: [
            "https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg",
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg"
          ],
          photoMan: "尼古拉斯·赵四",
          phone: "13512341234",
          firstTime: "2018-12-13",
          secondTime: "2018-12-14",
          endTime: "2018-12-15"
        },
        {
          advertBrand: "雪花3",
          state: "审核中",
          desc: "",
          photos: [
            "https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg",
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg"
          ],
          photoMan: "尼古拉斯·赵四",
          phone: "13512341234",
          firstTime: "2018-12-13",
          secondTime: "2018-12-14",
          endTime: "2018-12-15"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setAdvertItem"]),
    jumpPage(advertIndex) {
      const url = `../advertDetail/main?advertIndex=${advertIndex}`;
      wx.navigateTo({ url });
    }
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: `沪GY2715/${this.advertItem.length}次广告`
    });
    this.setAdvertItem(this.advertItem);
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
      padding: 0 30px;
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
          padding: 0 20px;
          > div {
            line-height: 24px;
            font-size: 14px;
            color: #1b1b4e;
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
            span {
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