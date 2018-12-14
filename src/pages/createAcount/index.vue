<template>
  <div class="create-page">创建</div>
</template>
<script>
export default {
  name: 'create',
  mounted () {
    console.log(this.$root.$mp.query)
  }
}
</script>
<style lang="scss" scoped>
.create-page {}
</style>

