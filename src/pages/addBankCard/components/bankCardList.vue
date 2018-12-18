<template>
  <ul>
    <li v-for="(bank, index) in bankInfo" :data-bank="bank" :key="index" @click="select">
      <img :src="bank.formateIcon" alt="">
      <span>{{ bank.name }}</span>
    </li>
    <li>
      <div class="input-wrap">
        <label for="other">银行名称</label>
        <input id="other" type="text" v-model="bankName" placeholder="例:深圳发展银行" />
        <button v-if="bankName" class="bank-car-submit" @click.stop="bankCarSubmit">确定</button>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'bankCardList',
  props: ['bankInfo'],
  data() {
    return {
      bankName: ''
    }
  },
  methods: {
    select (e) {
      const { bank } = e.mp.currentTarget.dataset
      this.$emit('selectOption', bank.name)
    },
    bankCarSubmit() {
      this.$emit('selectOption', this.bankName)
    }
  }
}
</script>
