<template>
  <div class="advertItem-page">
    <button @click="jumpPage">广告item</button>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'advertItem',
  data () {
    return {
      advertItem: [
        {
          advertBrand: '雪花1',
          state: '审核中',
          desc: '',
          photos: [
            'https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480',
            'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg',
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg'
          ],
          photoMan: '尼古拉斯·赵四',
          phone: '13512341234',
          firstTime: '2018-12-13',
          secondTime: '2018-12-14',
          endTime: '2018-12-15'
        },
        {
          advertBrand: '雪花2',
          state: '未通过',
          desc: 'xxxxxx，若图片作弊将受处罚，敬请配合',
          photos: [
            'https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480',
            'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg',
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg'
          ],
          photoMan: '尼古拉斯·赵四',
          phone: '13512341234',
          firstTime: '2018-12-13',
          secondTime: '2018-12-14',
          endTime: '2018-12-15'
        },
        {
          advertBrand: '雪花3',
          state: '审核中',
          desc: '',
          photos: [
            'https://image.guazistatic.com/gz01180628/15/47/d500e47b172c6ca758994346b7360279.jpg@base@tag=imgScale&w=280&h=180&q=55&q=100&w=750&h=480',
            'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1558500903,1181850262&fm=26&gp=0.jpg',
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1827303848,2651994092&fm=26&gp=0.jpg'
          ],
          photoMan: '尼古拉斯·赵四',
          phone: '13512341234',
          firstTime: '2018-12-13',
          secondTime: '2018-12-14',
          endTime: '2018-12-15'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'setAdvertItem'
    ]),
    jumpPage () {
      const advertIndex = 1
      const url = `../advertDetail/main?advertIndex=${advertIndex}`
      wx.navigateTo({ url })
    }
  },
  mounted () {
    console.log(this.$root.$mp.query)
    this.setAdvertItem(this.advertItem)
  }
}
</script>
<style lang="scss" scoped>
.advertDetail-page {}
</style>