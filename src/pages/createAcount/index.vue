<template>
  <div class="create-page">
    <div class="del-acount" v-if="employData.id" @click="handleDelete">删除该员工</div>
    <div class="input-wrap">
      <label for="name">
        <span>姓名</span>
      </label>
      <input
        id="name"
        type="text"
        v-model="employData.name"
        placeholder="请输入员工姓名"
        placeholder-style="color: #3B4664;opacity: 0.2;"
      >
    </div>
    <div class="input-wrap">
      <label for="phone">
        <span>手机号</span>
      </label>
      <input
        id="phone"
        :class="{ disabled }"
        type="number"
        v-model="employData.account"
        maxlength="11"
        placeholder="请输入手机号码"
        placeholder-style="color: #3B4664;opacity: 0.2;"
        :disabled="disabled"
      >
    </div>
    <button class="submit" :class="{'active': isActive}" @click="submit">{{ submitText }}</button>
  </div>
</template>
<script>
import api from "@/utils/ajax";

export default {
  name: "create",
  data() {
    return {
      employData: {
        id: "",
        name: "",
        account: ""
      },
      originData: {
        id: "",
        name: "",
        account: ""
      },
      isLoading: false
    };
  },
  computed: {
    disabled() {
      // 保证手机号不可修改
      return !!this.originData.id;
    },
    submitText() {
      return this.originData.id ? "确认修改" : "确认添加";
    },
    isActive() {
      const { name, account } = this.employData;
      const { name: originName, account: originPhone } = this.originData;
      return (
        name.length &&
        account.length === 11 &&
        !(name === originName && account === originPhone)
      );
    }
  },
  methods: {
    handleDelete() {
      const _this = this;
      wx.showModal({
        title: "温馨提示",
        content: "删除员工账号后该员工将无法登录系统，是否继续删除？",
        confirmText: "继续",
        success(res) {
          if (res.confirm) {
            _this.deleteEmployee();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    async deleteEmployee() {
      const res = await api.deleteEmployee(this.employData.id);
      if (res && res.code === 200) {
        this.showToast("用户已被删除", "success", true);
      }
    },
    async submit() {
      if (!this.isActive || this.isLoading) {
        return;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      const { name, account } = this.employData;
      if (phoneReg.test(account)) {
        this.isLoading = true;
        let params = { name, account };
        // if(this.originData.id) {
        //   params.id = this.originData.id;
        // }
        const res = await api.editEmployee(params);
        this.isLoading = false;
        if (res && res.code === 200) {
          const title = this.originData.id ? "用户修改成功" : "用户新增成功";
          this.showToast(title, "success", true);
        }
      } else {
        this.showToast("请输入正确的手机号", "none", false);
      }
    },
    jumpPage(path, jumpMethod) {
      const url = `../${path}/main`;
      wx[jumpMethod]({ url });
    },
    showToast(title, icon, callback) {
      const _this = this;
      wx.showToast({
        title,
        icon: icon || "success",
        duration: 2000,
        success() {
          callback && _this.jumpPage({ delta: 1 }, "navigateBack");
        }
      });
    }
  },
  onShow() {
    const { id } = this.$root.$mp.query;
    if (id) {
      this.employData =
        this.$store.state.setUp.employees.filter(employ => {
          return employ.id === parseInt(id);
        })[0] || this.employData;
      this.originData = JSON.parse(JSON.stringify(this.employData));
    }
  },
  mounted() {
    console.log("mounted");
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>
<style lang="scss" scoped>
.create-page {
  padding: 0 20px;
  .del-acount {
    height: 44px;
    text-align: right;
    line-height: 46px;
    font-size: 14px;
    color: #fd687d;
  }
  .input-wrap {
    height: 100px;
    label {
      line-height: 22px;
      font-size: 14px;
      color: #aeb3c0;
    }
    input {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #3b4664;
      margin-top: 10px;
      border-bottom: 1px solid #ebebeb;
      &.disabled {
        color: #3b4664;
        opacity: 0.2;
      }
    }
    & + .input-wrap {
      margin-bottom: 20px;
    }
  }
  .submit {
    height: 60px;
    background: #ebebeb;
    border-radius: 6px;
    line-height: 60px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    outline: none;
    border: none;
    &::after {
      border: none;
    }
    &.active {
      background: #545dff;
      box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
      border-radius: 6px;
    }
  }
}
</style>

