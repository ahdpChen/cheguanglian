<template>
  <div class="login-page">
    <subTitle subTitle="登录"/>
    <div class="login-tip">请输入登记在车广联的手机号码，用于验证身份</div>
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
        @input="clearVcErr"
      >
      <button
        class="verifyCodeBtn"
        :class="{gray: isVerifyCodeClick}"
        @click.stop="getVerifyCode"
      >{{verifyCodeText}}</button>
    </div>
    <button class="login-btn" @click="login">验证码</button>
    <base-toast toastType="info" toast="验证码已发送，请注意查收" @showToast="showToast" v-if="isToast"/>
  </div>
</template>
<script>
import subTitle from "@/components/subTitle";
import baseToast from "@/components/baseToast";

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
    verifyPhone() {
      if (this.phone.length === 11) {
        this.checkPhone();
        return;
      }
      this.phoneErr = "";
    },
    checkPhone() {
      console.log(this.phone);
      this.phoneErr = "手机号未在系统登记";
    },
    getVerifyCode() {
      if (this.isVerifyCodeClick) {
        return;
      }
      this.showToast();
      this.isVerifyCodeClick = true;
      this.setTimeCut();
      this.verifyCodeTimer = setInterval(() => {
        this.setTimeCut();
      }, 1000);
    },
    setTimeCut() {
      this.verifyCodeTime--;
      this.verifyCodeText = `${this.verifyCodeTime}s`;
      if (this.verifyCodeTime <= 0) {
        this.isVerifyCodeClick = false;
        this.verifyCodeTime = 0;
        this.verifyCodeText = "重新获取";
        clearInterval(this.verifyCodeTimer);
        this.verifyCodeTimer = null;
      }
    },
    clearVcErr() {
      this.vcErr = "";
    },
    jumpPage(path, jumpMethod) {
      console.log(`path:${path}, jumpMethod:${jumpMethod}`);
      const url = `../${path}/main`;
      wx[jumpMethod]({ url });
    },
    login() {
      if (this.isSubmitClick) {
        return;
      }
      this.isSubmitClick = true;
      console.log("login", "手机号" + this.phone, "验证码" + this.verifyCode);
      this.vcErr = "验证码错误，请重新输入";
      setTimeout(() => {
        this.isSubmitClick = true;
        this.jumpPage("home", "switchTab");
      }, 3000);
    },
    showToast() {
      this.isToast = !this.isToast;
    },
    showModal() {
      this.isModal = !this.isModal;
    }
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


