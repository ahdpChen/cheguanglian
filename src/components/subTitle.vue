<template>
  <div class="sub-title">{{ subTitle }}</div>
</template>
<script>
export default {
  name: 'subTitle',
  props: ['subTitle']
}
</script>
<style lang="scss" scoped>
.sub-title {
  font-size: 30px;
}
</style>

