<template>
  <div class="deposit-page">
    <div class="deposit-bank" @click="navigationToPage('addBankCard')">
      <div class="bank-empty" v-if="!bankInfo">+添加银行卡</div>
      <div class="bank-icon" v-if="bankInfo">
        <img :src="bankIcon" alt />
      </div>
      <div class="bank-name" v-if="bankInfo">{{ bankInfo.bankName }}</div>
      <div class="arrow"></div>
    </div>
    <div class="deposit-amount">
      <label for="money">提现金额</label>
      <input
        id="money"
        type="number"
        v-model="acountInfo.reaMoney"
        :placeholder="'可用余额￥'+acountInfo.avalidMoney"
        placeholder-style="font-size: 14px;color: #AEB3C0;"
      >
      <div class="deposit-all">全部</div>
    </div>
    <button class="submit" :class="{'isEnabled': acountInfo.isEnabled}">{{ submitText }}</button>
    <div v-if="acountInfo.isEnabled" class="tips">提现后将于一个工作日后到账</div>
  </div>
</template>
<script>
import bankCarList from '../../../static/bankCar.json';
export default {
  name: "deposit",
  data() {
    return {
      bankCarList: bankCarList.bankCar,
      bankInfo: {
          bankIcon: 'bank_icon.png',
          bankName: "中国银行1"
      },
      acountInfo: {
        avalidMoney: "10,000",
        reaMoney: "",
        isEnabled: false
      }
    };
  },
  computed: {
    bankIcon() {
      const bank = this.bankCarList.filter((bank)=> {
        return this.bankInfo.bankName === bank.name;
      })[0]
      const bankIcon = bank ? bank.icon : 'bank_icon.png'
      return require(`~Image/images/bankCar/${bankIcon}`);
    },
    submitText() {
      return this.acountInfo.isEnabled
        ? "提现"
        : "每周三为固定提现日，其他时间暂不支持";
    }
  },
  methods: {
    formatNumberWithComma(input) {
      var type = typeof input;
      var numStr = 0;
      if (type == "number") {
        numStr = parseInt(input).toString();
      } else if (type == "string") {
        numStr = input;
      } else {
        return;
      }
      return numStr.replace(/(?=(?!(\b))(\d{3})+$)/g, ",");
    },
    navigationToPage(path) {
      let url = `../${path}/main`;
      if(!this.bankInfo) {
        url = `${url}?isCreate=true`
      }
      wx.navigateTo({ url });
    }
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
      padding-left: 20px;
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
