<template>
  <div class="pre-phone-modal">
    <ul>
      <li v-for="(pre, index) in prePhone" :key="index">{{ pre }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'prePhoneModal',
  data () {
    return {
      prePhone: ['+86', '+86', '+86', '+86']
    }
  }
}
</script>
