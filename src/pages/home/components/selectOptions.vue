<template>
  <ul>
    <li v-for="(option, index) in selectOptions" :data-option="option" :key="index" @click="select">{{ option.name }}</li>
  </ul>
</template>
<script>
export default {
  name: 'selectOptions',
  props: ['selectOptions'],
  methods: {
    select (e) {
      const { option } = e.target.dataset
      this.$emit('selectOption', option)
    }
  }
}
</script>
