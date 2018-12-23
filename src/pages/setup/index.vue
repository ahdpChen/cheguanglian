<template>
  <div class="setup-page">
    <div class="my-info">
      <img class="my-pic" src="./images/head_pic.png" alt>
      <div class="my-info-detail">
        <div class="my-base-info">{{ userInfo.name }} {{ userInfo.account }}</div>
        <p class="my-shop">{{ userInfo.carWashName }}</p>
      </div>
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap">
        <ul v-if="employees.length">
          <li v-for="(employ, index) in employees" :key="index" @click="jumpPage(employ.id)">
            <div class="employ-info">
              <div class="employ-name">{{ employ.name }}</div>
              <p class="employ-phone">{{ employ.formatePhone }}</p>
            </div>
            <div class="arrow"></div>
          </li>
        </ul>
        <div v-else class="empty">
          <p class="tip">暂无员工账号</p>
          <img src="./images/empty.png" alt>
        </div>
      </div>
    </scroll-view>
    <button class="set-btn" @click="jumpPage(null)">新增员工账号</button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/utils/ajax";

export default {
  name: "setup",
  data() {
    return {
      employees: []
    };
  },
  computed: {
    userInfo() {
      let { userInfo } = this.$store.state;
      return Object.assign(userInfo, {
        account: this.phoneFilter(userInfo.account)
      });
    }
  },
  methods: {
    ...mapActions(["setemployees"]),
    phoneFilter(phoneStr) {
      return phoneStr.substr(0, 3) + "****" + phoneStr.substr(7);
    },
    jumpPage(id) {
      const url = `../createAcount/main?id=${id}`;
      wx.navigateTo({ url });
    },
    async getEmployees() {
      const res = await api.getEmployees();
      if (res && res.code === 200) {
        this.employees = res.data.map(employ => {
          employ.formatePhone = this.phoneFilter(employ.account);
          return employ;
        });
        this.setemployees(this.employees);
      }
    }
  },
  onShow() {
    this.getEmployees();
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
.setup-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 20px;
  box-sizing: border-box;
  .my-info {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 90px;
    padding: 0 30px;
    box-sizing: border-box;
    .my-pic {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .my-info-detail {
      flex: 1;
      padding-left: 20px;
      .my-base-info {
        line-height: 24px;
        font-size: 17px;
        color: #1b1b4e;
      }
      .my-shop {
        line-height: 24px;
        font-size: 14px;
        color: #1b1b4e;
      }
    }
  }
  .scroll-container {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 0 30px;
      ul {
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 60px;
          margin-bottom: 10px;
          .employ-info {
            flex: 1;
            .employ-name,
            .employ-phone {
              line-height: 24px;
              font-size: 14px;
            }
            .employ-name {
              color: #1b1b4e;
            }
            .employ-phone {
              color: #aeb3c0;
            }
          }
          .arrow {
            width: 8px;
            height: 22px;
            background: url("./images/arrow.png") center/100% no-repeat;
            transition: transform 0.3s;
          }
        }
      }
      .empty {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: calc(100vh - 170px);
        padding-bottom: 60px;
        box-sizing: border-box;
        .tip {
          height: 60px;
          line-height: 60px;
          margin-bottom: 40px;
          font-size: 14px;
          text-align: center;
          color: #aeb3c0;
        }
        img {
          display: block;
          width: 300px;
        }
      }
    }
  }
  .set-btn {
    position: relative;
    width: calc(100% - 30px);
    height: 60px;
    line-height: 60px;
    margin: 0 auto;
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
}
</style>
