<template>
  <div class="addBankCard-page">
    <div class="bankCard-info" @click="selectIsClick">
      <div class="bank-icon">
        <img :src="bankInfo.iconUrl" alt>
      </div>
      <div class="bank-name">{{ bankInfo.bankName }}</div>
      <div class="arrow"></div>
    </div>
    <div class="bankCard-id">
      <label for="cardId">卡号</label>
      <input
        id="cardId"
        type="number"
        v-model="bankInfo.bankNumber"
        placeholder="请输入银行卡卡号"
        placeholder-style="font-size: 14px;color: #AEB3C0;"
      >
    </div>
    <button class="submit" :class="{ 'active': isActive }" @click="beforeSubmit">下一步</button>

    <base-modal
      customClass="bankCard-modal"
      position="top"
      v-if="isClick"
      @showModal="selectIsClick"
    >
      <div class="select-container">
        <bank-card-list-modal :bankInfo="formateBankInfo" @selectOption="selectOption"/>
      </div>
      <div class="arrow">
        <span></span>
      </div>
    </base-modal>
  </div>
</template>
<script>
import baseModal from "@/components/baseModal";
import bankCardListModal from "./components/bankCardList";

import api from "@/utils/ajax";

export default {
  name: "addBankCard",
  components: {
    baseModal,
    bankCardListModal
  },
  data() {
    return {
      bankInfo: {
        id: "",
        icon: "",
        bankName: "",
        bankNumber: "",
        iconUrl: ""
      },
      originData: {
        id: "",
        icon: "",
        bankName: "",
        bankNumber: "",
        iconUrl: ""
      },
      isClick: false,
      isLoading: false
    };
  },
  computed: {
    bankCarList() {
      return this.$store.state.bankCard;
    },
    formateBankInfo() {
      return this.bankCarList.map(bank => {
        return Object.assign(bank, {
          iconUrl: require(`~Image/images/bankCar/${bank.icon}`)
        });
      });
    },
    isActive() {
      const { bankName, bankNumber } = this.bankInfo;
      const {
        bankName: originBankName,
        bankNumber: originBankNumber
      } = this.originData;
      return (
        bankName &&
        bankNumber &&
        !(bankName === originBankName && bankNumber === originBankNumber)
      );
    }
  },
  methods: {
    selectOption(bank) {
      let bankInfo = {};
      if (bank.id) {
        bankInfo = this.formateBankInfo.filter(item => {
          return item.id === bank.id;
        })[0];
      } else {
        bankInfo = {
          id: "-1",
          icon: "bank_icon.png",
          bankName: bank,
          iconUrl: require("~Image/images/bankCar/bank_icon.png")
        };
      }
      this.bankInfo = Object.assign(this.bankInfo, bankInfo);
      this.isClick = false;
    },
    modalPromise() {
      return new Promise((resolve, reject) => {
        const { bankName, bankNumber } = this.bankInfo;
        wx.showModal({
          title: "温馨提示",
          content: `是否修改为以下银行卡：[${bankName}]${bankNumber}`,
          confirmText: "确定修改",
          confirmColor: "#FD687D",
          success(res) {
            resolve(res.confirm);
          },
          fail(err) {
            reject(err);
          }
        });
      });
    },
    async beforeSubmit() {
      if (!this.isActive) {
        wx.showToast({
          title: "请先完善银行卡信息",
          icon: "none",
          duration: 2000
        });
        return;
      }
      const res = await this.modalPromise();
      if (res) {
        this.submit();
      }
    },
    async submit() {
      const { bankName, bankNumber } = this.bankInfo;
      const res = await api.addBankInfo(bankName, bankNumber);
      if (res && res.code === 200) {
        wx.showToast({
          title: "成功修改银行卡信息",
          icon: "success",
          duration: 2000
        });
        wx.navigateBack({
          delta: 1
        });
      }
    },
    selectIsClick() {
      this.isClick = !this.isClick;
    },
    initData() {
      const { id } = this.$root.$mp.query;
      wx.setNavigationBarTitle({
        title: id ? "修改银行卡" : "添加银行卡"
      });
      let bankInfo = {};
      if (id) {
        bankInfo = this.$store.state.deposit.bankInfo;
        this.originData = Object.assign(this.originData, bankInfo);
      } else {
        bankInfo = this.formateBankInfo[0];
      }
      this.bankInfo = Object.assign(this.bankInfo, bankInfo);
    }
  },
  onShow() {
    this.initData();
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
<style lang="scss">
.addBankCard-page {
  padding: 0 30px;
  box-sizing: border-box;
  .bankCard-info,
  .bankCard-id {
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
  .bankCard-info {
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
      width: 12px;
      height: 8px;
      margin-left: 10px;
      background: url("./images/arrow.png") center/100% no-repeat;
    }
  }

  .bankCard-id {
    margin-bottom: 40px;
    label {
      color: #1b1b4e;
      line-height: 24px;
      font-size: 14px;
    }
    input {
      flex: 1;
      padding-left: 20px;
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
    outline: none;
    border: none;
    &::after {
      border: none;
    }
    &.active {
      background: #fd687d;
      box-shadow: 0px 5px 15px rgba(253, 104, 125, 0.298092);
      border-radius: 6px;
    }
  }

  .bankCard-modal {
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
        padding-bottom: 30px;
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          line-height: 60px;
          padding: 0 20px;
          text-align: center;
          font-size: 14px;
          color: #1b1b4e;
          img {
            width: 40px;
            height: 40px;
          }
          span {
            flex: 1;
            padding-left: 20px;
            text-align: left;
          }
          .input-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60px;
            padding: 0 20px;
            background: #fff;
            box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
            border-radius: 10px;
            box-sizing: border-box;
            label {
              line-height: 24px;
              font-size: 14px;
              color: #1b1b4e;
            }
            input {
              flex: 1;
              height: 100%;
              padding-left: 20px;
              text-align: left;
            }
            .bank-car-submit {
              line-height: 24px;
              font-size: 14px;
              color: #545dff;
              background: none;
              outline: none;
              border: none;
              &::after {
                border: none;
              }
            }
          }
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
