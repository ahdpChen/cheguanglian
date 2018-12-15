<template>
  <div class="home-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap" :class="{ paddingBottom: chooseImages.length }">
        <subTitle subTitle="上传作业图片"/>
        <div class="home-tip">
          <ul>
            <li>1. 已贴广告的车辆需贴满最小广告时长后才可换新广告，否则该车辆贴新广告的照片无法提交，敬请知悉</li>
            <li>2. 在
              <span @click="navigationToPage" class="navigation">“广告情况”</span>中可搜索查看各车辆广告张贴时长
            </li>
          </ul>
        </div>
        <div class="select-tip">选择已贴车贴</div>
        <div :class="{ fixed: isScroll }">
          <div class="select-wrap" :class="{ selected: isClick }" @click="selectIsClick">
            <div>雪花（1个月起，2019-01-30结束）</div>
            <div class="arrow"></div>
          </div>
          <div class="car-license" v-if="chooseImages.length">
            <div class="license-left" @click="licenseIsClick">
              <span>沪</span>
              <div class="arrow"></div>
            </div>
            <div class="license-right">
              <input type="text" :value="license" placeholder="车牌号" @input="setLicense">
            </div>
          </div>
        </div>
        <div class="camera-wrap" @click="camera" v-if="!chooseImages.length">
          <div>
            <p class="title">点此广告拍照</p>
            <p>照片中需清晰可见广告与车牌</p>
            <p>拍照时需打开一侧车门</p>
          </div>
          <div class="camera-icon"></div>
        </div>
        <div class="choose-imgs" v-if="chooseImages.length">
          <div class="choose-img-wrap" v-for="(src, index) in chooseImages" :key="index">
            <img :src="src" alt>
            <img
              class="cancel-btn"
              src="./images/cancel.png"
              :data-chooseImgIndex="index"
              @click.stop="delImg"
            >
          </div>
        </div>
        <div
          class="camera-extra"
          @click="camera"
          v-if="chooseImages.length && chooseImages.length < 3"
        >+ 继续拍照</div>
      </div>
    </scroll-view>
    <button class="submit" v-if="chooseImages.length">确认提交</button>
    <base-modal customClass="select-modal" position="top" v-if="isClick" @showModal="selectIsClick">
      <div class="select-container">
        <select-options-modal :selectOptions="selectOptions" @selectOption="selectOption"/>
      </div>
      <div class="arrow">
        <span></span>
      </div>
    </base-modal>
    <base-modal
      customClass="license-modal"
      position="top"
      v-if="isLicenseClick"
      @showModal="licenseIsClick"
    >
      <div class="license-container">
        <license-options-modal :licenseOptions="licenseOptions" @licenseOption="licenseOption"/>
      </div>
      <div class="arrow">
        <span></span>
      </div>
    </base-modal>
  </div>
</template>
<script>
import carJson from "./json/carLicense.json";
import subTitle from "@/components/subTitle";
import baseModal from "@/components/baseModal";
import selectOptionsModal from "./components/selectOptions";
import licenseOptionsModal from "./components/licenseOptions";

export default {
  name: "home",
  components: {
    subTitle,
    baseModal,
    selectOptionsModal,
    licenseOptionsModal
  },
  data() {
    return {
      selectOptions: [
        {
          id: 1,
          name: "1雪花（1个月起，2019-01-30结束）"
        },
        {
          id: 2,
          name: "2雪花（1个月起，2019-01-30结束）"
        },
        {
          id: 3,
          name: "3雪花（1个月起，2019-01-30结束）"
        },
        {
          id: 4,
          name: "4雪花（1个月起，2019-01-30结束）"
        },
        {
          id: 5,
          name: "5雪花（1个月起，2019-01-30结束）"
        },
        {
          id: 6,
          name: "6雪花（1个月起，2019-01-30结束）"
        }
      ],
      licenseOptions: carJson.carLicense,
      chooseImages: [],
      license: "",
      isScroll: false,
      isClick: false,
      isLicenseClick: false
    };
  },
  computed: {
    isModalOpen() {
      return !!this.isClick;
    }
  },
  methods: {
    navigationToPage() {
      const url = "../advert/main";
      wx.navigateTo({ url });
    },
    scroll(e) {
      const { scrollTop } = e.mp.detail;
      this.isScroll = scrollTop > 249;
    },
    selectIsClick() {
      this.isClick = !this.isClick;
    },
    selectOption(option) {
      console.log(option);
      this.isClick = false;
    },
    licenseIsClick() {
      this.isLicenseClick = !this.isLicenseClick;
    },
    licenseOption() {
      this.isLicenseClick = false;
    },
    setLicense(e) {
      let { value } = e.target;
      this.license = value.toUpperCase();
    },
    camera() {
      let _this = this;
      wx.chooseImage({
        count: 3,
        sizeType: ["compressed"],
        sourceType: ["camera"],
        success(res) {
          if (res && res.tempFilePaths && res.tempFilePaths.length) {
            console.log(res);
            _this.chooseImages = _this.chooseImages.concat(res.tempFilePaths);
            wx.showToast({
              title: "" + res.tempFiles[0].size,
              icon: "success",
              duration: 2000
            });
          }
        },
        fail() {},
        complete() {}
      });
    },
    delImg(e) {
      const { chooseimgindex } = e.target.dataset;
      this.chooseImages.splice(chooseimgindex, 1);
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    },
    redirect() {
      const url = "../login/main";
      wx.redirectTo({ url });
    }
  },
  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
  mounted() {
    try {
      const value = wx.getStorageSync("test");
      if (value) {
        console.log(value);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>
<style lang="scss">
.home-page {
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
      padding: 0 30px;
      box-sizing: border-box;
      &.paddingBottom {
        padding-bottom: 100px;
      }
    }
  }
  .home-tip {
    padding: 15px 0 30px;
    ul {
      li {
        font-size: 14px;
        line-height: 24px;
        font-size: 14px;
        color: #1b1b4e;
        .navigation {
          color: #545dff;
        }
      }
    }
  }
  .fixed {
    position: fixed;
    left: 0;
    top: 10px;
    width: 100%;
    padding: 0 30px;
    z-index: 2;
    box-sizing: border-box;
    & + .choose-imgs {
      padding-top: 200px;
    }
  }
  .select-tip {
    margin-bottom: 15px;
    line-height: 22px;
    font-size: 14px;
    color: #aeb3c0;
  }
  .select-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    margin-bottom: 15px;
    font-size: 14px;
    background: #fff;
    box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    &.selected {
      div {
        &.arrow {
          transform: rotate(180deg);
          transition: transform 0.3s;
        }
      }
    }
    div {
      &:first-child {
        flex: 1;
      }
      &.arrow {
        width: 14px;
        height: 8px;
        background: url("./images/arrow.png") center/100% no-repeat;
        transition: transform 0.3s;
      }
    }
  }
  .car-license {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    div {
      font-size: 14px;
      color: #1b1b4e;
      &.license-left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        .arrow {
          width: 14px;
          height: 8px;
          margin-left: 10px;
          background: url("./images/arrow.png") center/100% no-repeat;
          box-sizing: border-box;
        }
      }
      &.license-right {
        flex: 1;
        padding-left: 15px;
      }
    }
  }
  .camera-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    padding: 0 10px 0 20px;
    color: #fff;
    background: #545dff;
    box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
    border-radius: 10px;
    box-sizing: border-box;
    div {
      &:first-child {
        flex: 1;
        p {
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          opacity: 0.7;
          &:first-child {
            line-height: 24px;
            font-size: 14px;
            opacity: 1;
          }
        }
      }
      &.camera-icon {
        width: 62px;
        height: 80px;
        background: #3b40a9 url("./images/camera.png") center/50% no-repeat;
        box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
        border-radius: 8px;
      }
    }
  }
  .choose-imgs {
    padding: 20px 0;
    .choose-img-wrap {
      position: relative;
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
    .cancel-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 46px !important;
      height: 46px !important;
    }
  }
  .camera-extra {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #545dff;
  }
  .submit {
    position: fixed;
    left: 5%;
    bottom: 20px;
    width: 90%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: #545dff;
    box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
    outline: none;
    border: none;
    border-radius: 6px;
    z-index: 1;
    &::after {
      border: none;
    }
  }
  .select-modal {
    .modal-wrap {
      height: 45% !important;
      padding-bottom: 10px;
      overflow: hidden;
    }
    .select-container {
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
        width: 14px;
        height: 8px;
        background: url("./images/arrow.png") center/100% no-repeat;
      }
    }
  }
  .license-modal {
    .modal-wrap {
      height: 85% !important;
      padding-bottom: 10px;
      overflow: hidden;
    }
    .license-container {
      position: relative;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        padding: 10px 20px 0;
        box-sizing: border-box;
        li {
          width: 21%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          color: #1b1b4e;
          margin-bottom: 20px;
          background: #fff;
          box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
          border-radius: 6px;
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
        width: 14px;
        height: 8px;
        background: url("./images/arrow.png") center/100% no-repeat;
        transform: rotate(180deg);
      }
    }
  }
}
</style>

