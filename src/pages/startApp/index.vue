<template>
  <div class="start-page">
    <div class="logo"></div>
    <div class="copy-right">
      <p>覆盖用车生活全场景</p>
      <p>打造联动创意新传媒</p>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "start",
  data() {
    return {
      loginInfo: null,
      time: 2500 //设置过渡页时间
    };
  },
  methods: {
    ...mapActions(["setLoginInfo", "setLoginStatus"]),
    jumpPage(path, jumpMethod) {
      const url = `../${path}/main`;
      wx[jumpMethod]({ url });
    }
  },
  show() {},
  mounted() {
    try {
      const loginInfoStr = wx.getStorageSync("LOGIN_INFO");
      this.loginInfo = loginInfoStr ? JSON.parse(loginInfoStr) : null;
      setTimeout(() => {
        if (this.loginInfo) {
          this.setLoginStatus(true);
          this.setLoginInfo(this.loginInfo)
          this.jumpPage("home", "switchTab");
        } else {
          this.jumpPage("login", "redirectTo");
        }
      }, this.time);
    } catch (e) {
      console.log(e);
    }
  }
};
</script>
<style lang="scss" scoped>
.start-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  padding: 30% 0;
  box-sizing: border-box;
  background: #545dff;
  .logo {
    width: 180px;
    height: 47px;
    background: url("./images/Union.png") center/100% no-repeat;
  }
  .copy-right {
    font-size: 16px;
    color: #fff;
  }
}
</style>

