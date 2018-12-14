<template>
  <div class="setup-page">
    <button @click="showModal">账号设置</button>
    <button @click="showToast">toast</button>
  </div>
</template>
<script>
export default {
  name: 'setup',
  methods: {
    showModal () {
      wx.showModal({
        title: '提示',
        content: '这是一个模态弹窗',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    showToast () {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.setup-page {}
</style>
