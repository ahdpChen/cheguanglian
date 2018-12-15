<template>
  <div class="create-page">
    <div class="del-acount" v-if="employData.id">删除该员工</div>
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
        type="number"
        v-model="employData.phone"
        maxlength="11"
        placeholder="请输入手机号码"
        placeholder-style="color: #3B4664;opacity: 0.2;"
      >
    </div>
    <button class="submit" :class="{'active': isActive}" @click="submit">{{ submitText }}</button>
  </div>
</template>
<script>
export default {
  name: "create",
  data() {
    return {
      employData: {
        id: "",
        name: "",
        phone: ""
      },
      originData: {
        name: "",
        phone: ""
      }
    };
  },
  computed: {
    submitText() {
      return this.employData.id ? "确认修改" : "确认添加";
    },
    isActive() {
      const { name, phone } = this.employData;
      const { name: originName, phone: originPhone } = this.originData;
      console.log(phone.length === 11)
      return name.length && phone.length === 11 && !(name === originName && phone === originPhone);
    }
  },
  methods: {
    submit() {}
  },
  mounted() {
    const { id } = this.$root.$mp.query;
    if (id) {
      this.employData =
        this.$store.state.setUp.employees.filter(employ => {
          return employ.id === id;
        })[0] || this.employData;
      this.originData = JSON.parse(JSON.stringify(this.employData));
    }
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
      line-height: 22px;
      font-size: 14px;
      color: #aeb3c0;
      margin-top: 10px;
      border-bottom: 1px solid #ebebeb;
    }
    & + .input-wrap {
      margin-bottom: 10px;
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

