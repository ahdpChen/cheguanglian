<template>
  <div class="toast" :class="animateClass">{{toast}}</div>
</template>
<script>
export default {
  name: 'toast',
  props: ['toast', 'toastType'],
  data () {
    return {
      status: ''
    }
  },
  computed: {
    animateClass () {
      var rtStr = ''
      switch (this.toastType) {
        case 'info':
          rtStr = 'slide-down'
          break
      }
      if (this.status === 'close') {
        rtStr += '-reverse'
      }
      return `${this.toastType} ${rtStr}`
    }
  },
  methods: {
    closeToast () {
      this.status = 'close'
      setTimeout(() => {
        this.$emit('showToast')
      }, 500)
    }
  },
  mounted () {
    setTimeout(() => {
      this.closeToast()
    }, 3000)
  }
}
</script>
<style lang="scss" scoped>
  .toast {
    position: absolute;
    top: -100%;
    left: 3%;
    width: 94%;
    margin: 0 auto;
    text-align: center;
    padding: 10px 0;
    font-family: Noto Sans S Chinese;
    line-height: 24px;
    font-size: 14px;
    color: #1B1B4E;
    background: #fff;
    border-radius: 8px;
    z-index: 9;
    &.info {
      box-shadow: 0px 5px 15px rgba(27, 27, 78, 0.1);
      &.slide-down {
        top: -100%;
        animation: 0.6s ease-in slideDown forwards;
      }
      &.slide-down-reverse {
        top: 15px;
        animation: 0.6s ease-out slideDownReverse forwards;
      }
    }

    @keyframes slideDown {
      from {
        top: -100%;
      }

      to {
        top: 15px;
      }
    }

    @keyframes slideDownReverse {
      from {
        top: 15px;
      }

      to {
        top: -100%;
      }
    }
  }
</style>

