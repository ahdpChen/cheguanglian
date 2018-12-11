<template>
  <div class="modal" :class="positionClass">
    <div
      class="modal-mask"
      @click="maskClick">
    </div>
    <div
      class="modal-wrap"
      :class="animateClass"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal',
  props: {
    customClass: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'center'
    }
  },
  data () {
    return {
      status: ''
    }
  },
  computed: {
    positionClass () {
      return `position-${this.position} ${this.customClass}`
    },
    animateClass () {
      var rtStr = ''
      switch (this.position) {
        case 'top':
          rtStr = 'slide-down'
          break
        case 'right':
          rtStr = 'slide-left'
          break
        case 'bottom':
          rtStr = 'slide-up'
          break
        case 'left':
          rtStr = 'slide-right'
          break
        default:
          rtStr = 'fade-in'
      }
      if (this.status === 'close') {
        rtStr += '-reverse'
      }
      return rtStr
    }
  },
  methods: {
    maskClick () {
      this.closeModal()
    },
    closeModal () {
      this.status = 'close'
      setTimeout(() => {
        this.$emit('showModal')
      }, 300)
    }
  }
}
</script>

<style lang="scss">
.modal {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  .modal-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  .modal-wrap {
    position: relative;
    background: #fff;
  }
  
  &.position-center {
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }

  &.position-center .modal-wrap {
    min-width: 70%;
    max-height: 90%;
    border-radius: 8px;
  }

  &.position-top .modal-wrap {
    width: 100%;
  }

  &.position-right {
    justify-content: flex-end;
    align-items: flex-start;
  }

  &.position-right .modal-wrap {
    height: 100%;
  }

  &.position-left .modal-wrap {
    height: 100%;
  }

  &.position-bottom {
    align-items: flex-end;
  }

  &.position-bottom .modal-wrap {
    width: 100%;
  }

  .modal-wrap {
    position: relative;
    background-color: #fff;
  }

  /*animation  */

  .fade-in {
    animation: 0.3s ease-in fadeIn forwards;
  }

  .fade-in-reverse {
    animation: 0.3s ease-out fadeInReverse forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeInReverse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  .slide-right {
    transform: translateX(-150%);
    animation: 0.3s ease-in 0.3s slideRight forwards;
  }

  .slide-right-reverse {
    animation: 0.3s ease-out slideRightReverse forwards;
  }

  @keyframes slideRight {
    from {
      transform: translateX(-100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes slideRightReverse {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-100%);
    }
  }

  .slide-left {
    transform: translateX(150%);
    animation: 0.3s ease-in 0.3s slideLeft forwards;
  }

  .slide-left-reverse {
    animation: 0.3s ease-out slideLeftReverse forwards;
  }

  @keyframes slideLeft {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes slideLeftReverse {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(100%);
    }
  }

  .slide-down {
    transform: translateY(-150%);
    animation: 0.3s ease-in 0.3s slideDown forwards;
  }

  .slide-down-reverse {
    animation: 0.3s ease-out slideDownReverse forwards;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDownReverse {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(-100%);
    }
  }

  .slide-up {
    transform: translateY(150%);
    animation: 0.3s ease-in 0.3s slideUp forwards;
  }

  .slide-up-reverse {
    animation: 0.3s ease-out slideUpReverse forwards;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes slideUpReverse {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(100%);
    }
  }
}
</style>
