<template>
  <div class="home-page">首页
    <base-modal
      customClass="myModal"
      position="top"
      @showModal="showModal"
      v-if='isShow'>
     <div>弹框组件</div>
    </base-modal>
    <button @click="showModal">弹框</button>
    <mptoast/>
  </div>
</template>
<script>
import mptoast from 'mptoast'
import baseModal from '@/components/baseModal'
export default {
  name: 'home',
  components: {
    mptoast,
    baseModal
  },
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
    redirect () {
      console.log('redirect')
      const url = '../login/main'
      wx.redirectTo({ url })
    },
    showModal () {
      this.isShow = !this.isShow
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  },
  mounted () {
    this.$mptoast('请先登陆', 2000, this.redirect)
  }
}
</script>
<style lang="scss" scoped>
.home-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
</style>

