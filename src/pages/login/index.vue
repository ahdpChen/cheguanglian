<template>
  <div class="login-page">
    <subTitle subTitle="登录"/>
    <div class="login-tip">请输入登记在车广家的手机号码，用于验证身份</div>
    <div class="input-wrap">
      <label :class="{ err: phoneErr }" for="phone">
        <span>手机号</span>
        <span v-if="phoneErr" class="error">{{ phoneErr }}</span>
      </label>
      <input
        id="phone"
        type="number"
        v-model="phone"
        placeholder="请输入手机号码"
        placeholder-style="color:#3B4664; opacity: 0.2"
        maxlength="11"
        @input="verifyPhone"
      >
    </div>
    <div class="input-wrap">
      <label :class="{ err: vcErr }" for="verifyCode">
        <span>验证码</span>
        <span v-if="vcErr" class="error">{{ vcErr }}</span>
      </label>
      <input
        id="verifyCode"
        type="number"
        v-model="verifyCode"
        placeholder="请输入验证码"
        placeholder-style="color:#3B4664; opacity: 0.2"
        maxlength="6"
        @input="clearErr"
      >
      <button
        class="verifyCodeBtn"
        :class="{gray: isVerifyCodeClick}"
        @click.stop="getVerifyCode"
      >{{verifyCodeText}}</button>
    </div>
    <button class="login-btn" @click="login">验证</button>
    <base-toast toastType="info" toast="验证码已发送，请注意查收" @showToast="showToast" v-if="isToast"/>
  </div>
</template>
<script>
import { mapActions } from "vuex";

import subTitle from "@/components/subTitle";
import baseToast from "@/components/baseToast";
import api from "@/utils/ajax";

export default {
  name: "login",
  components: {
    baseToast,
    subTitle
  },
  data() {
    return {
      phone: "",
      verifyCode: "",
      isValid: false,
      isVerifyCodeClick: false,
      verifyCodeText: "验证码",
      verifyCodeTime: 60,
      verifyCodeTimer: null,
      isSubmitClick: false,
      phoneErr: "",
      vcErr: "",
      isToast: false,
      isModal: false
    };
  },
  methods: {
    ...mapActions(["setLoginInfo", "setLoginStatus"]),
    verifyPhone() {
      this.clearErr();
      if (this.phone.length === 11) {
        this.checkPhone();
      } else {
        this.isValid = false;
      }
    },
    checkPhone() {
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      this.isValid = phoneReg.test(this.phone);
    },
    async getVerifyCode() {
      if (!this.isValid) {
        wx.showToast({
          title: "请输入正确的手机号",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.isVerifyCodeClick) {
        return;
      }
      this.isVerifyCodeClick = true;
      const res = await api.getMsCode(this.phone);
      if (res && res.code === 200) {
        this.showToast();
        this.setTimeCut();
        this.verifyCodeTimer = setInterval(() => {
          this.setTimeCut();
        }, 1000);
      } else if (res && res.message) {
        if (res.message.indexOf("手机号不存在") > -1) {
          this.phoneErr = "手机号未在系统登记";
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          });
        }
        this.isVerifyCodeClick = false;
      } else {
        this.isVerifyCodeClick = false;
      }
    },
    setTimeCut() {
      this.verifyCodeTime--;
      this.verifyCodeText = `${this.verifyCodeTime}s`;
      if (this.verifyCodeTime <= 0) {
        this.verifyCodeText = "重新获取";
        this.verifyCodeTime = 60;
        this.isVerifyCodeClick = false;
        clearInterval(this.verifyCodeTimer);
        this.verifyCodeTimer = null;
      }
    },
    // 获取wx.login的code
    getCode() {
      return new Promise((resolve, rej) => {
        wx.login({
          success(res) {
            if (res.code) {
              resolve(res.code);
            } else {
              rej(res);
            }
          },
          fail(err) {
            rej(err);
          }
        });
      });
    },
    async login() {
      const { phone, verifyCode } = this;
      if (!this.isValid) {
        wx.showToast({
          title: "请输入正确的手机号",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!verifyCode) {
        wx.showToast({
          title: "请输入验证码",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.isSubmitClick) {
        return;
      }
      this.isSubmitClick = true;
      const code = await this.getCode();
      const res = await api.login(phone, verifyCode, code);
      if (res && res.code === 200) {
        this.setLoginStatus(true);
        this.setLoginInfo(res.data);
        wx.setStorageSync("LOGIN_INFO", JSON.stringify(res.data));
        this.jumpPage("home", "switchTab");
      } else if (res && res.message) {
        if (res.message.indexOf("验证码") > -1) {
          this.vcErr = res.message;
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          });
        }
      }
      this.isSubmitClick = false;
    },
    clearErr() {
      this.phoneErr = "";
      this.vcErr = "";
    },
    jumpPage(path, jumpMethod) {
      const url = `../${path}/main`;
      wx[jumpMethod]({ url });
    },
    showToast() {
      this.isToast = !this.isToast;
    },
    showModal() {
      this.isModal = !this.isModal;
    }
  },
  onShareAppMessage(res) {
    let { share } = this.$store.state;
    return share;
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  position: relative;
  padding: 0 30px;
  .login-tip {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }
  .input-wrap {
    position: relative;
    height: 100px;
    label {
      line-height: 22px;
      font-size: 14px;
      color: #aeb3c0;
      span {
        font-weight: normal;
      }
      &.err {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          color: #fd687d;
        }
      }
    }
    input {
      font-family: Noto Sans SC;
      font-style: normal;
      font-weight: 500;
      height: 43px;
      font-size: 14px;
      color: #3b4664;
      border-bottom: 1px solid #ebebeb;
      &#verifyCode {
        width: calc(100% - 100px);
      }
    }
    .verifyCodeBtn {
      position: absolute;
      right: 0;
      bottom: 35px;
      display: inline-block;
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
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
      &.gray {
        box-shadow: none;
        background: #ebebeb;
      }
    }
  }
  .login-btn {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #fff;
    background: #545dff;
    box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
    border-radius: 6px;
  }
}
</style>


