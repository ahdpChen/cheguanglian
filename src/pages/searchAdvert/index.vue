<template>
  <div class="search-page">
    <div class="input-wrap">
      <input type="text" placeholder="搜索车牌号/广告名" v-model="searchText">
    </div>
    <scroll-view class="scroll-container" scroll-y enable-back-to-top @scroll="scroll">
      <div class="scroll-wrap">
        <ul>
          <li
            v-for="(advert, index) in searchResult"
            :key="index"
            @click="jumpPage('advertItem', advert.advertId)"
          >
            <div class="advert-content">
              <div class="advert-name">
                <span>{{ advert.name }}</span>
                <span>{{ advert.workTime }}</span>
              </div>
              <p class="advert-time">
                <span>{{ advert.time }}</span>
                <span>{{ advert.desc }}</span>
              </p>
            </div>
            <div class="arrow"></div>
          </li>
        </ul>
      </div>
    </scroll-view>
  </div>
</template>
<script>
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "search",
  data() {
    return {
      searchText: "",
      searchResult: [
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '2',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '3',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '4',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '5',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '6',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '7',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '8',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        },
        {
          advertId: '9',
          name: '沪GY2715|雪花',
          workTime: '已贴20天|最少30天',
          time: '2018-12-12 :12:30:20',
          desc: '差2天可领取补贴'
        }
      ]
    };
  },
  methods: {
    jumpPage(path, advertId) {
      console.log(advertId);
      const url = `../${path}/main?advertId=${advertId}`;
      wx.navigateTo({ url });
    }
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  .input-wrap {
    width: 100%;
    height: 47px;
    padding: 0 30px;
    margin-bottom: 10px;
    box-sizing: border-box;
    input {
      width: 100%;
      height: 100%;
      padding-left: 20px;
      font-size: 14px;
      background: #ebebeb;
      border-radius: 10px;
      box-sizing: border-box;
    }
  }
  .scroll-container {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 0 30px;
      ul {
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          margin-bottom: 10px;
          .advert-content {
            flex: 1;
            .advert-name,
            .advert-time {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              line-height: 24px;
            }
            .advert-name {
              color: #1b1b4e;
            }
            .advert-time {
              color: #aeb3c0;
            }
          }
          .arrow {
            width: 8px;
            height: 22px;
            margin-left: 24px;
            background: url("./images/arrow.png") center/100% no-repeat;
          }
        }
      }
    }
  }
}
</style>


