<template>
  <div class="addBankCard-page">
    <div class="bankCard-info" @click="selectIsClick">
      <div class="bank-icon">
        <img :src="bankInfo[0].formateIcon" alt>
      </div>
      <div class="bank-name">{{ bankInfo[0].name }}</div>
      <div class="arrow"></div>
    </div>
    <div class="bankCard-id">
      <label for="cardId">卡号</label>
      <input
        id="cardId"
        type="number"
        v-model="cardInfo.id"
        placeholder="请输入银行卡卡号"
        placeholder-style="font-size: 14px;color: #AEB3C0;"
      >
    </div>
    <button class="submit">下一步</button>

    <base-modal
      customClass="bankCard-modal"
      position="top"
      v-if="isClick"
      @showModal="selectIsClick"
    >
      <div class="select-container">
        <bank-card-list-modal :bankInfo="bankInfo" @selectOption="selectOption"/>
      </div>
      <div class="arrow">
        <span></span>
      </div>
    </base-modal>
  </div>
</template>
<script>
import bankCarList from "../../../static/bankCar.json";
import baseModal from "@/components/baseModal";
import bankCardListModal from "./components/bankCardList";
export default {
  name: "addBankCard",
  components: {
    baseModal,
    bankCardListModal
  },
  data() {
    return {
      bankCarList: bankCarList.bankCar,
      cardInfo: {
        id: ""
      },
      isCreate: false,
      isClick: false
    };
  },
  computed: {
    bankInfo() {
      return this.bankCarList.map(bank => {
        return Object.assign(bank, {
          formateIcon: require(`~Image/images/bankCar/${bank.icon}`)
        });
      });
    }
  },
  methods: {
    selectIsClick() {
      this.isClick = !this.isClick;
    },
    selectOption(bank) {
      console.log(bank);
    }
  },
  mounted() {
    const { isCreate } = this.$root.$mp.query;
    this.isCreate = isCreate;
    wx.setNavigationBarTitle({
      title: isCreate ? "添加银行卡" : "修改银行卡"
    });
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
    background: #fd687d;
    box-shadow: 0px 5px 15px rgba(253, 104, 125, 0.298092);
    border-radius: 6px;
    outline: none;
    border: none;
    &::after {
      border: none;
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
              color: #1B1B4E;
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
              color: #545DFF;
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
