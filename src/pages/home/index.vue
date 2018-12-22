<template>
  <div class="home-page">
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap" :class="{ paddingBottom: chooseImages.length }">
        <subTitle subTitle="上传作业图片"/>
        <div class="home-tip">
          <ul>
            <li>1. 已贴广告的车辆需贴满最小广告时长后才可换新广告，否则该车辆贴新广告的照片无法提交，敬请知悉</li>
            <li>
              2. 在
              <span @click="jumpPage('advert', 'navigateTo')" class="navigation">“广告情况”</span>中可搜索查看各车辆广告张贴时长
            </li>
          </ul>
        </div>
        <div class="select-tip">选择已贴车贴</div>
        <div :class="{ fixed: isScroll }">
          <div class="select-wrap" :class="{ selected: isClick }" @click="selectIsClick">
            <div>{{ defaultAdvert.brand }} ({{defaultAdvert.formateMinTimeLen}}起，{{defaultAdvert.endTime}}结束)</div>
            <div class="arrow"></div>
          </div>
          <div class="car-license" v-if="chooseImages.length && !disabled">
            <div class="license-left" @click="licenseIsClick">
              <span>{{ preLicense }}</span>
              <div class="arrow"></div>
            </div>
            <div class="license-right">
              <input type="text" :value="license" placeholder="车牌号" @input="setLicense">
            </div>
          </div>
        </div>
        <div class="camera-wrap" @click="camera" v-if="!chooseImages.length && !disabled">
          <div>
            <p class="title">点此广告拍照</p>
            <p>照片中需清晰可见广告与车牌</p>
            <p>拍照时需打开一侧车门</p>
          </div>
          <div class="camera-icon"></div>
        </div>
        <div class="choose-imgs" v-if="chooseImages.length && !disabled">
          <div class="choose-img-wrap" v-for="(item, index) in chooseImages" :key="index">
            <img :src="item.src" alt>
            <img
              class="cancel-btn"
              src="./images/cancel.png"
              :data-chooseImgIndex="index"
              @click.stop="delImg"
            >
          </div>
        </div>
        <div class="camera-extra" @click="camera" v-if="isGoOnTakePhoto && !disabled">+ 继续拍照</div>
        <div class="operate-err" v-if="disabled">
          <p>该广告的贴纸您已全部用完</p>
          <p>请尽快联系我们</p>
        </div>
      </div>
    </scroll-view>
    <button
      class="submit"
      v-if="chooseImages.length && !disabled"
      @click="addConstruction(true)"
    >确认提交</button>

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

import api from "@/utils/ajax";
import config from "../../config/config";

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
      selectOptions: [],
      defaultAdvert: {},
      licenseOptions: carJson.carLicense,
      chooseImages: [],
      preLicense: "沪",
      license: "",
      scanLicense: "",
      progress: 0,
      isUpLoading: false,
      isScroll: false,
      isClick: false,
      isLicenseClick: false,
      isLoading: false,
      isTakingPhoto: false
    };
  },
  computed: {
    isModalOpen() {
      return !!this.isClick;
    },
    isGoOnTakePhoto() {
      return (
        !this.isUpLoading &&
        this.chooseImages.length &&
        this.chooseImages.length < 3
      );
    },
    disabled() {
      return !!this.defaultAdvert.used;
    }
  },
  methods: {
    scroll(e) {
      const { scrollTop } = e.mp.detail;
      this.isScroll = scrollTop > 249;
    },
    takePhotoPromise() {
      return new Promise((res, rej) => {
        wx.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["camera"],
          success(data) {
            res(data);
          },
          fail(err) {
            res(err);
          },
          complete() {}
        });
      });
    },
    uploadFile(params) {
      const _this = this;
      const loginInfoStr = wx.getStorageSync("LOGIN_INFO");
      const loginInfo = loginInfoStr ? JSON.parse(loginInfoStr) : null;
      this.isUpLoading = true;
      const uploadTask = wx.uploadFile({
        url: `${config.host}/testApi/file/upload`,
        filePath: params.picture,
        name: "file",
        header: {
          "Content-type": "multipart/form-data",
          Host: "www.cheguanglian.com:8080",
          Authorization: `Bearer ${loginInfo.token}`
        },
        formData: {
          type: params.type
        },
        success(res) {
          const data = JSON.parse(res.data).data;
          _this.chooseImages[params.index].serverSrc = data.picUrl;
          if (data.number) {
            _this.scanLicense = data.number;
          }
        },
        complete() {
          wx.hideLoading();
          _this.progress = 0;
          _this.isUpLoading = false;
        }
      });
      uploadTask.onProgressUpdate(res => {
        this.progress = res.progress;
        wx.showLoading({
          title: `已上传${this.progress}%`
        });
      });
    },
    async camera() {
      if (this.isUpLoading) {
        return;
      }
      this.isTakingPhoto = true;
      let res = await this.takePhotoPromise();
      this.isTakingPhoto = false;
      if (res && res.tempFilePaths.length) {
        const tempFilePaths = res.tempFilePaths;
        this.chooseImages = this.chooseImages.concat([
          { src: tempFilePaths[0] }
        ]);

        const params = {
          type: 1,
          picture: tempFilePaths[0],
          index: this.chooseImages.length - 1
        };
        this.uploadFile(params);
      }
    },
    delImg(e) {
      const { chooseimgindex } = e.target.dataset;
      this.chooseImages.splice(chooseimgindex, 1);
    },
    jumpPage(path, jumpMethod) {
      const url = `../${path}/main`;
      wx[jumpMethod]({ url });
    },
    selectIsClick() {
      this.isClick = !this.isClick;
    },
    selectOption(option) {
      this.defaultAdvert = option;
      this.isClick = false;
      // if(this.license) {
      //   this.addConstruction(false);
      // }
    },
    licenseIsClick() {
      this.isLicenseClick = !this.isLicenseClick;
    },
    licenseOption(option) {
      this.preLicense = option.name;
      this.isLicenseClick = false;
    },
    setLicense(e) {
      let { value } = e.target;
      this.license = value.toUpperCase();
      const { adOrderId, brand } = this.defaultAdvert;
      // if(adOrderId && brand) {
      //   this.addConstruction(false);
      // }
    },
    handleSubmit(content) {
      wx.showModal({
        title: "温馨提示",
        content,
        confirmText: "知道了",
        confirmColor: "#545DFF",
        showCancel: false,
        success(res) {
          console.log(res);
        }
      });
    },
    checkSubmitParams(adOrderId, brand, license, disabled) {
      if (!(adOrderId && brand)) {
        wx.showToast({
          title: "请选择广告",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (!license) {
        wx.showToast({
          title: "请输入车牌号",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      if (disabled) {
        wx.showToast({
          title: "该广告的贴纸已用完",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      return true;
    },
    async addConstruction(isSubmit) {
      const {
        defaultAdvert: { adOrderId, brand },
        license,
        disabled,
        preLicense,
        scanLicense,
        chooseImages
      } = this;
      if (
        this.isLoading ||
        !this.checkSubmitParams(adOrderId, brand, license, disabled)
      ) {
        return;
      }
      let params = {
        detail: {
          adOrderId,
          brand,
          region: preLicense,
          carNumber: license,
          carNumberOld: scanLicense
        }
      };
      this.isLoading = true;
      try {
        if (isSubmit) {
          params.picList = chooseImages.map(img => {
            return { picUrl: img.serverSrc };
          });
          const res = await api.addConstruction(params);
          console.log(res);
          if (res && res.code === 200) {
            this.handleSubmit(
              "系统将在1个工作日内审核，审核通过后将收到补贴。"
            );
          } else if (res && res.message) {
            this.handleSubmit(res.message);
          }
        } else {
          const res = await api.validConstr(params);
          console.log(res);
        }
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },
    // 获取广告下拉列表
    async getSelAd() {
      if (this.isTakingPhoto) {
        return;
      }
      const res = await api.getSelAd();
      if (res && res.code === 200) {
        res.data.forEach(d => {
          if (d.minTimeLen > 30) {
            d.formateMinTimeLen = `${parseInt(
              d.minTimeLen / 30
            )}个月${d.minTimeLen % 30}天`;
          } else {
            d.formateMinTimeLen = `${d.minTimeLen}天`;
          }
          d.endTime = d.endTime.split(" ")[0];
        });
        res.data = res.data.concat([
          {
            adOrderId: 3,
            adOrderNo: "GG201812211803x4ht",
            brand: "冰红茶",
            endTime: "2019-01-31 00:00:00",
            minTimeLen: 40,
            status: "2",
            used: 1
          }
        ]);
        this.defaultAdvert = res.data.filter(item => {
          return !item.used;
        })[0];
        this.selectOptions = [].concat(res.data);
      }
    }
  },
  onShow() {
    this.getSelAd();
  },
  onShareAppMessage(res) {
    console.log(res);
    return {
      title: "自定义转发标题",
      path: "/pages/startApp/main"
    };
  },
  mounted() {
    console.log("mounted");
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
  .operate-err {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100px;
    padding: 0 10px 0 20px;
    color: #ff3750;
    font-size: 14px;
    box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    p {
      & + p {
        margin-top: 10px;
      }
    }
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

