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

export default {
  name: 'start',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    reLaunchPage (path) {
      console.log('redirect', path)
      const url = `../${path}/main`
      wx.reLaunch({ url })
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  },
  mounted () {
    try {
      wx.setStorageSync('test', '123')
      setTimeout(() => {
        this.reLaunchPage('login')
      }, 3000)
    } catch (e) { console.log(e) }
  }
}
</script>
<style lang="scss" scoped>
.start-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 30% 0;
  box-sizing: border-box;
  background: #545DFF;
  .logo {
    width: 180px;
    height: 47px;
    background: url('./images/Union.png') center/100% no-repeat;
  }
  .copy-right {
    font-size: 16px;
    color: #fff;
  }
}
</style>

