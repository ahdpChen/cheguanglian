<template>
  <div class="deposit-page">
    <div class="deposit-bank" @click="navigationToPage('addBankCard')">
      <div class="bank-empty" v-if="!currBankInfo.bankName">+添加银行卡</div>
      <div class="bank-icon" v-if="currBankInfo.iconUrl">
        <img :src="currBankInfo.iconUrl" alt>
      </div>
      <div class="bank-name" v-if="currBankInfo.bankName">{{ currBankInfo.bankName }}</div>
      <div class="arrow"></div>
    </div>
    <div class="deposit-amount">
      <label for="money">提现金额 ￥</label>
      <input
        id="money"
        type="number"
        v-model="acountInfo.reaMoney"
        :placeholder="'可用余额￥'+acountInfo.formateAvalidMoney"
        placeholder-style="font-size: 14px;color: #AEB3C0;"
      >
      <div class="deposit-all" @click="fiilReaEqualAvalid">全部</div>
    </div>
    <button
      class="submit"
      :class="{ isEnabled: isEnabled && isSubmit }"
      @click="beforeSubmit"
    >{{ submitText }}</button>
    <div v-if="isEnabled" class="tips">提现后将于一个工作日后到账</div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

import api from "@/utils/ajax";
import utils from "@/utils";

export default {
  name: "deposit",
  data() {
    return {
      bankInfo: {
        bankName: "",
        bankNumber: ""
      },
      acountInfo: {
        reaMoney: "",
        avalidMoney: 0,
        formateAvalidMoney: "",
        nowDate: ""
      },
      isLoading: false
    };
  },
  computed: {
    bankCarList() {
      return this.$store.state.bankCard;
    },
    currBankInfo() {
      let { bankName, bankNumber } = this.bankInfo;
      if (!bankName || !bankNumber) {
        return {};
      }
      const bank = this.bankCarList.filter(bank => {
        return bank.bankName.indexOf(bankName) > -1;
      })[0];

      if (bank) {
        return Object.assign(bank, {
          bankNumber,
          iconUrl: require(`~Image/images/bankCar/${bank.icon}`)
        });
      } else {
        return {
          id: "-1",
          icon: "bank_icon.png",
          bankName,
          bankNumber,
          iconUrl: require("~Image/images/bankCar/bank_icon.png")
        };
      }
    },
    isEnabled() {
      const weekDay = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      if (process.env.NODE_ENV === "development") {
        return true;
      }
      return weekDay[this.acountInfo.nowDate] === "星期三";
    },
    isSubmit() {
      let { avalidMoney, reaMoney } = this.acountInfo;
      reaMoney = reaMoney || 0;
      return parseFloat(reaMoney) > 0 && parseFloat(reaMoney) <= avalidMoney;
    },
    submitText() {
      return this.isEnabled ? "提现" : "每周三为固定提现日，其他时间暂不支持";
    }
  },
  methods: {
    ...mapActions(["setBankIfo"]),
    fiilReaEqualAvalid() {
      const { avalidMoney } = this.acountInfo;
      if (!avalidMoney) {
        wx.showToast({
          title: "没有可用的余额",
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.acountInfo.reaMoney = avalidMoney;
    },
    beforeSubmit() {
      const { bankName, bankNumber } = this.bankInfo;
      if (!this.isEnabled || !this.isSubmit) {
        return;
      }
      if (!bankName || !bankNumber) {
        wx.showToast({
          title: "银行卡信息不完整",
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.handleSubmit(
        "温馨提示",
        "点击确定按钮后将立即申请提现，请注意查收。",
        "确定提现",
        "取消",
        this.submit
      );
    },
    handleSubmit(title, content, confirmText, cancelText, callback) {
      wx.showModal({
        title,
        content,
        confirmText,
        confirmColor: "#FD687D",
        cancelText,
        showCancel: !!cancelText,
        success(res) {
          if (res.confirm) {
            callback && callback();
          }
        }
      });
    },
    async submit() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      const res = await api.doDepositSubmit(this.acountInfo.reaMoney);
      this.isLoading = false;
      if (res && res.code === 200) {
        this.handleSubmit(
          "申请提现成功，敬请等待处理",
          `提现金额 ¥${utils.formatNumberWithComma(
            parseFloat(this.acountInfo.reaMoney || 0)
          )}，预计1个工作日后到账${this.bankInfo.bankName}`,
          "知道了",
          "",
          this.getAmountAndBankCarInfo
        );
      } else if (res && res.message) {
        this.handleSubmit("温馨提示", res.message, "知道了", "", null);
      }
    },
    navigationToPage(path) {
      let url = `../${path}/main`;
      if (this.currBankInfo && this.currBankInfo.id) {
        this.setBankIfo(this.currBankInfo);
        url = `${url}?id=${this.currBankInfo.id}`;
      }
      wx.navigateTo({ url });
    },
    async getAmountAndBankCarInfo() {
      const res = await api.getAmountAndBankCarInfo();
      if (res && res.code === 200) {
        const { bankName, bankNumber, totalBalance, nowDate } = res.data;
        this.bankInfo = { bankName, bankNumber };
        this.acountInfo = {
          reaMoney: "",
          avalidMoney: parseFloat(totalBalance || 0),
          formateAvalidMoney: utils.formatNumberWithComma(
            parseFloat(totalBalance || 0)
          ),
          nowDate: new Date(nowDate.replace(/-/g, "/")).getDay()
        };
      }
    }
  },
  onShow() {
    this.getAmountAndBankCarInfo();
  },
  onShareAppMessage(res) {
    let { share } = this.$store.state;
    return share;
  }
};
</script>
<style lang="scss" scoped>
.deposit-page {
  padding: 0 30px;
  box-sizing: border-box;
  .deposit-bank,
  .deposit-amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    margin-bottom: 20px;
    font-size: 14px;
    background: #fff;
    box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
  }
  .deposit-bank {
    .bank-empty {
      line-height: 24px;
      font-size: 14px;
      color: #fd687d;
    }
    .bank-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bank-name {
      flex: 1;
      padding-left: 10px;
    }
    .arrow {
      width: 8px;
      height: 22px;
      margin-left: 10px;
      background: url("./images/arrow.png") center/100% no-repeat;
    }
  }

  .deposit-amount {
    margin-bottom: 40px;
    label,
    .deposit-all {
      line-height: 24px;
      font-size: 14px;
    }
    label {
      color: #1b1b4e;
    }
    input {
      flex: 1;
      padding-left: 10px;
    }
    .deposit-all {
      color: #fd687d;
    }
  }

  .submit {
    width: 100%;
    height: 60px;
    line-height: 60px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;
    background: #ebebeb;
    border-radius: 6px;
    outline: none;
    border: none;
    &::after {
      border: none;
    }
    &.isEnabled {
      background: #fd687d;
      box-shadow: 0px 5px 15px rgba(253, 104, 125, 0.298092);
    }
  }

  .tips {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    text-align: center;
    color: #aeb3c0;
  }
}
</style>
