<template>
  <div class="setup-page">
    <div class="my-info">
      <img class="my-pic" src="./images/head_pic.png" alt>
      <div class="my-info-detail">
        <div class="my-base-info">王大大 13512341234</div>
        <p class="my-shop">上海xxx汽车美容</p>
      </div>
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap">
        <ul>
          <li v-for="(employ, index) in employees" :key="index" @click="jumpPage(employ.id)">
            <div class="employ-info">
              <div class="employ-name">{{ employ.name }}</div>
              <p class="employ-phone">{{ employ.formatePhone }}</p>
            </div>
            <div class="arrow"></div>
          </li>
        </ul>
      </div>
    </scroll-view>
    <button class="set-btn" @click="jumpPage(null)">新增员工账号</button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "setup",
  data() {
    return {
      employees: [
        {
          id: "1",
          name: "小王",
          phone: "13512341235"
        },
        {
          id: "2",
          name: "大王",
          phone: "13512341236"
        },
        {
          id: "3",
          name: "张三",
          phone: "13512341237"
        },
        {
          id: "4",
          name: "赵四",
          phone: "13512341238"
        },
        {
          id: "5",
          name: "赵四",
          phone: "13512341238"
        }
      ]
    };
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
    showModal() {
      wx.showModal({
        title: "提示",
        content: "这是一个模态弹窗",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    showToast() {
      wx.showToast({
        title: "成功",
        icon: "success",
        duration: 2000
      });
    }
  },
  mounted() {
    console.log('mounted')
    this.employees = this.employees.map(employ => {
      employ.formatePhone = this.phoneFilter(employ.phone);
      return employ;
    });

    this.setemployees(this.employees);
  }
};
</script>
<style lang="scss" scoped>
.setup-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 20px;
  overflow: hidden;
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
