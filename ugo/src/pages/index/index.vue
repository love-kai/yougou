<template>
  <div :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll"></search>
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="banner.goods_id" v-for="banner in bannerList">
        <a :href="'/pages/goods/main?id=' + banner.goods_id">
          <img :src="banner.image_src" />
        </a>
      </swiper-item>
    </swiper>
    <!-- 导航条 -->
    <div class="navs">
      <!-- navigator 跳转的页面如果在 tabBar 配置中出现 -->
      <!-- 必须指定打开方式 open-type -->
      <a :open-type="nav.open_type || 'navigate'" :href="nav.navigator_url || '/pages/list/main?query=' + nav.name" :key="nav.name" v-for="nav in navList">
        <img :src="nav.image_src" />
      </a>
    </div>
    <!-- 楼层 -->
    <div class="floors">
      <div class="floor" :key="index" v-for="(floor, index) in floorList">
        <div class="title">
          <img :src="floor.floor_title.image_src" />
        </div>
        <div class="items">
          <a :href="'/pages/list/main?query=' + product.name" :key="key" v-for="(product, key) in floor.product_list">
            <img :src="product.image_src" />
          </a>
        </div>
      </div>
    </div>
    <!-- 回到顶部 -->
    <div class="goTop" @click="goTop" v-show="scrollTop > 200"></div>
  </div>
</template>

<script>

  import search from '@/components/search';

  // 导入 wx.request API 的 Promise 封装
  import request from '@/utils/request';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        // 轮播图数据
        bannerList: [],
        // 主导航数据
        navList: [],
        // 楼层数据
        floorList: [],
        scrollTop: 0
      }
    },

    components: {
      search
    },
    
    methods: {

      // 设置页面的滚动高度
      goTop () {
        // 通过 api 可以完成设置
        mpvue.pageScrollTo({scrollTop: 0});
      },

      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },

      // 轮播图接口
      async getBannerList () {

        // request().then(function (a) {
        //   console.log(a);
        // });

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/swiperdata',
          method: 'get'
        });

        // console.log(message);

        // 更新数据
        this.bannerList = message;

        // var _this = this;
        // mpvue.request({
        //   url: 'https://www.zhengzhicheng.cn/api/public/v1/home/swiperdata',
        //   success: function (info) {
        //     // console.log(info.data.message);
        //     _this.bannerList = info.data.message;
        //   }
        // });
      },

      // 主导航接口
      async getNavList () {

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/catitems'
        });

        console.log(message);
        // 更新数据
        this.navList = message;
      },

      // 楼层数据
      async getFloorList () {

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/floordata'
        })

        // console.log(message);

        // 更新数据
        this.floorList = message;
      }
    },

    // mpvue 中的 created 转换成了 onLaunch
    created () {
      // console.log('首页加载了...');
    },

    // mounted 被转换成了 onLoad
    mounted () {
      // console.log('我是首页面...');

      // 使作 mpvue 开发小程序时，建议将 wx 这个命名空间
      // 切成 mpvue 即 wx.request => mpvue.request
      // wx.showLoading => mpvue.showLoading ...
      // wx.request({});

      // 调用轮播图接口
      this.getBannerList();
      // 调用主导航接口
      this.getNavList();
      // 调用楼层接口
      this.getFloorList();
    },

    // 监听页面的下拉操作
    async onPullDownRefresh () {
      // console.log('有人下拉了...');
      await this.getBannerList();
      await this.getNavList();
      await this.getFloorList();

      // 终止下拉状态
      mpvue.stopPullDownRefresh();
    },

    // 监听用户的滚动操作
    onPageScroll (ev) {
      // console.log(ev.scrollTop);
      this.scrollTop = ev.scrollTop;
    },

    // 一旦监听页的转发事件，转发功能即生效
    onShareAppMessage () {
      // 将定制的转发内容
      // 通过一个对象返回即可
      return {
        title: '快来和我一起开发小程序吧!',
        path: '/page/index/main',
        imageUrl: 'http://homesitetask.zbjimg.com/homesite/task/0-2.jpg/origine/0a9c78c9-b02d-4afc-8cf2-ee78e12fa255'
      }
    },

    // 当页面滚动到底部时触发
    onReachBottom () {
      console.log('我到底了...');
    }
  }
</script>

<style scoped lang="less">

  .banner {
    width: 100%;
    height: 340rpx;

    img {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floors {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding-top: 20rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      a {
        width: 232rpx;
        height: 188rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      a:nth-child(2n+1) {
        margin-right: 0;
      }

      a:first-child {
        height: 386rpx;
        margin-right: 10rpx;
      }
    }
  }

  // 回到顶部
  .goTop {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
  }

</style>
