<template>
  <div class="advertDetail-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top>
      <div class="scroll-wrap">
        <div class="advertDetail-list">
          <div class="flex">
            <div>广告品牌</div>
            <div>{{ advertDetail.advertBrand }}</div>
          </div>
          <div class="flex">
            <div>首次拍照</div>
            <div>{{ advertDetail.firstTime }}</div>
          </div>
          <div class="flex">
            <div>拍照人员</div>
            <div>{{ advertDetail.photoMan + '/' + advertDetail.phone }}</div>
          </div>
        </div>
        <div class="advertDetail-msg" v-if="advertDetail.desc">{{ advertDetail.desc }}</div>
        <div class="detail-imgs" v-if="advertDetail.photos.length">
          <div class="detail-imgs-wrap" v-for="(src,index) in advertDetail.photos" :key="index">
            <img :src="src" alt srcset>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import api from "@/utils/ajax";

export default {
  name: "advertDetail",
  data() {
    return {
      advertDetail: {
        advertBrand: "",
        firstTime: "",
        photoMan: "",
        phone: "",
        desc: "",
        photos: []
      }
    };
  },
  methods: {
    async getAdvertDetail() {
      const { id } = this.$root.$mp.query;
      const res = await api.getAdDetail(id);
      if (res && res.code === 200) {
        const {
          detail: {
            carNumber,
            brand,
            firstPostdTime,
            consUserName,
            consUserPhone,
            remark
          },
          picList
        } = res.data;
        this.advertDetail = Object.assign(this.advertDetail, {
          advertBrand: brand,
          firstTime: firstPostdTime,
          photoMan: consUserName,
          phone: consUserPhone,
          desc: remark,
          photos: picList.map(item => {
            return item.picUrl;
          })
        });
        wx.setNavigationBarTitle({
          title: carNumber
        });
      }
    }
  },
  onShow() {
    this.getAdvertDetail();
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
.advertDetail-page {
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
      .advertDetail-list {
        background: #ffffff;
        box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
        border-radius: 10px;
        margin-bottom: 20px;
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
          }
        }
      }
      .advertDetail-msg {
        height: 60px;
        line-height: 24px;
        font-size: 14px;
        text-align: center;
        color: #545dff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .detail-imgs {
        padding: 20px 0;
        .detail-imgs-wrap {
          width: 100%;
          height: 224px;
          padding: 2px;
          margin-bottom: 15px;
          background: #fff;
          border: 4px solid #fff;
          box-sizing: border-box;
          box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
          border-radius: 10px;
          box-sizing: border-box;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
        }
      }
    }
  }
}
</style>
