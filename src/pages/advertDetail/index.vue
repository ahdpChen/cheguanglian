<template>
  <div class="advertDetail-page">广告详情</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'advertDetail',
  data () {
    return {}
  },
  methods: {},
  mounted () {
    console.log(this.$root.$mp.query)
    console.log(this.$store.state.advertItem)
  }
}
</script>
<style lang="scss" scoped>
.advertDetail-page {}
</style>
