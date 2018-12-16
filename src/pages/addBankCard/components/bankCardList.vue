<template>
  <ul>
    <li v-for="(bank, index) in bankInfo" :data-bank="bank" :key="index" @click="select">
      <img :src="bank.bankIcon" alt="">
      <span>{{ bank.bankName }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'bankCardList',
  props: ['bankInfo'],
  methods: {
    select (e) {
      const { bank } = e.target.dataset
      this.$emit('selectOption', bank)
    }
  }
}
</script>
