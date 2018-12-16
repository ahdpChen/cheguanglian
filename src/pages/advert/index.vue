<template>
  <div class="advert-page">
    <scroll-view
      class="scroll-container"
      scroll-y
      enable-back-to-top
      @scroll="scroll"
      >
      <div class="scroll-wrap">
        <div class="input-wrap">
          <input type="text" placeholder="搜索车牌号/广告名" @click="jumpPage('searchAdvert')" />
        </div>
        <div class="advert-tab" :class="{ fixed: isScroll }">
          <ul>
            <li
            :class="{ selected: advertTab.tabIndex === index }"
            v-for="(tab, index) in advertTab.advertTabs"
            :key="index"
            @click="changeTab(index)"
            >
              {{ tab.name + tab.count }}
            </li>
          </ul>
        </div>
        <div class="advert-list">
          <ul>
            <li v-for="(advert, index) in advertList" :key="index" @click="jumpPage('advertItem', advert.advertId)">
              <div class="advert-content">
                <div class="advert-name">{{ advert.name }}</div>
                <p class="advert-time">{{ advert.time }}</p>
              </div>
              <div class="arrow"></div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
export default {
  name: 'advert',
  data () {
    return {
      advertTab: {
        advertTabs: [
          {
            id: 1,
            name: '全部',
            count: 2000
          },
          {
            id: 2,
            name: '广告中',
            count: 1280
          },
          {
            id: 3,
            name: '空闲',
            count: 720
          }
        ],
        tabIndex: 0
      },
      advertList: [
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        },
        {
          advertId: '1',
          name: '沪GY2715|雪花',
          time: '2018-12-12 :12:30:20(已贴20天|最少30天)'
        }
      ],
      isScroll: false
    }
  },
  methods: {
    scroll (e) {
      const { scrollTop } = e.mp.detail
      this.isScroll = scrollTop > 60
    },
    changeTab (index) {
      this.advertTab.tabIndex = index
    },
    jumpPage (path, advertId) {
      const url = `../${path}/main?advertId=${advertId}`
      wx.navigateTo({ url })
    }
  }
}
</script>
<style lang="scss" scoped>
.advert-page {
  box-sizing: border-box;
  .scroll-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    overflow-y: scroll; 
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .scroll-wrap {
      padding: 10px 30px 0;
    }
  }
  .input-wrap {
    width: 100%;
    height: 47px;
    margin-bottom: 10px;
    background: #EBEBEB;
    border-radius: 10px;
    input {
      width: 100%;
      height: 100%;
      padding-left: 20px;
      font-size: 14px;
    }
  }
  .advert-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      li {
        width: 30%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #1B1B4E;
        &.selected {
          font-size: 16px;
          color: #fff;
          background: #545DFF;
          box-shadow: 0px 5px 15px rgba(84, 93, 255, 0.3);
          border-radius: 6px;
        }
      }
    }

  }
  .fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 30px;
    z-index: 2;
    background: #fff;
    box-sizing: border-box;
    & + .advert-list {
      padding-top: 60px;
    }
  }
  .advert-list {
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        margin-bottom: 10px;
        .advert-content {
          flex: 1;
          div,
          p {
            font-size: 14px;
            line-height: 24px;
          }
          div {
            color: #1B1B4E;
          }
          p {
            color: #AEB3C0;
          }
        }
        .arrow {
          width: 8px;
          height: 22px;
          margin-left: 24px;
          background: url('./images/arrow.png') center/100% no-repeat;
        }
      }
    }
  }
}
</style>
