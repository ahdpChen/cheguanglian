<template>
  <div class="my-page">
    <div class="account-wrap" v-if="isTopLevel">
      <div class="account">
        <span>账户余额</span>
        <span class="money">￥{{ userBaseInfo.formateTotalAmount }}</span>
      </div>
      <div class="total">
        <span>总收入（{{ userBaseInfo.day }}）</span>
        <span class="money">￥{{ userBaseInfo.formateTotalBalance }}</span>
      </div>
    </div>
    <div class="operate-btn" v-if="isTopLevel">
      <button class="transactions-btn" @click="navigationToPage('transactions')">明细</button>
      <button class="deposit-btn" @click="navigationToPage('deposit')">提现</button>
    </div>
    <div class="setup-wrap">
      <ul>
        <li class="advert" @click="navigationToPage('advert')">
          <div class="icon"></div>
          <div class="middle">
            <span>广告情况</span>
          </div>
          <div class="arrow"></div>
        </li>
        <li class="setup" @click="navigationToPage('setup')" v-if="isTopLevel">
          <div class="icon"></div>
          <div class="middle">
            <span>账号设置</span>
            <span>{{ userBaseInfo.peopleNum }}个员工账号</span>
          </div>
          <div class="arrow"></div>
        </li>
      </ul>
    </div>
    <mptoast/>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import mptoast from "mptoast";

import api from "@/utils/ajax";
import utils from '@/utils';

export default {
  name: "my",
  conponents: {
    mptoast
  },
  data() {
    return {
      userBaseInfo: {}
    };
  },
  computed: {
    isTopLevel() {
      return this.$store.state.loginInfo.level === "1";
    }
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    navigationToPage(path) {
      const url = `../${path}/main`;
      wx.navigateTo({ url });
    }
  },
  async onShow() {
    if (this.isTopLevel) {
      const res = await api.getUserBaseInfo();
      if(res && res.code === 200) {
        this.userBaseInfo = Object.assign(res.data, {
          formateTotalAmount: utils.formatNumberWithComma(res.data.totailAmount),
          formateTotalBalance: utils.formatNumberWithComma(res.data.totalBalance)
        })
        this.setUserInfo(this.userBaseInfo)
      } else if(res && res.message === '非法操作') {
        this.$mptoast(res.message);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.my-page {
  padding: 20px 30px 0;
  box-sizing: border-box;
  .account-wrap {
    width: 100%;
    .account,
    .total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-family: Noto Sans S Chinese;
        color: #1b1b4e;
        &:first-child {
          line-height: 24px;
          font-size: 14px;
        }
      }
    }
    .account {
      span {
        &.money {
          line-height: 46px;
          font-size: 30px;
        }
      }
    }
    .total {
      margin: 13px 0 43px;
      span {
        line-height: 24px;
        font-size: 14px;
      }
    }
  }
  .operate-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 40px;
    button {
      width: 46%;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #fff;
      font-size: 16px;
      margin: 0;
      background: #545dff;
      box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
      border-radius: 6px;
      outline: none;
      border: none;
      &.deposit-btn {
        background: #fd687d;
      }
    }
  }
  .setup-wrap {
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 60px;
        border-bottom: 2px solid #ebebeb;
        .icon {
          width: 22px;
          height: 22px;
          margin-right: 8px;
        }
        &.advert {
          .icon {
            background: url("./images/advert.png") center/100% no-repeat;
          }
        }
        &.setup {
          .icon {
            background: url("./images/setup.png") center/100% no-repeat;
          }
        }
        .middle {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          span {
            color: #1b1b4e;
            & + span {
              color: #aeb3c0;
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
  }
}
</style>

