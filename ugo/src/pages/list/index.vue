<template>
  <div>
    <!-- 筛选 -->
    <div class="filter">
      <span class="active">综合</span>
      <span>销量</span>
      <span>价格</span>
    </div>
    <!-- 商品列表 -->
    <scroll-view @scrolltolower="getMore" class="goods" scroll-y>
      <div class="item" @click="goDetail(goods.goods_id)" :key="goods.goods_id" v-for="goods in goodsList">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <div class="meta">
          <p class="name">{{goods.goods_name}}</p>
          <p class="price"><span>￥</span>{{goods.goods_price}}<span>.00</span></p>
        </div>
      </div>
      <div class="tips" v-if="!goodsList.length">找不到相关的商品~</div>
    </scroll-view>
  </div>
</template>

<script>

  // 引入 wx.request 的 Promise 封装版本
  import request from '@/utils/request';

  export default {

    data () {
      return {
        // 商品列表
        goodsList: [],
        query: null,
        pagenum: 1,
        pagesize: 5,
        total: 0
      }
    },

    methods: {

      // 跳转到商品详情
      goDetail (id) {
        mpvue.navigateTo({
          url: '/pages/goods/main?id=' + id
        })
      },

      // 获取更多的数据
      async getMore () {

        // 检测还有没有更多数据
        if(this.goodsList.length >= this.total) return;

        // 将页码加1
        this.query.pagenum = ++this.pagenum;
        this.query.pagesize = this.pagesize;

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/goods/search',
          data: this.query
        })

        // console.log(message.goods);
        // var arr = [1, 2, 3];
        // var arr1 = [4, 5, 6];
        // arr.push(arr1); // [1, 2, 3, [4, 5, 6]]

        // 更新数据
        this.goodsList = this.goodsList.concat(message.goods);

        // 总计多少条数据
        this.total = message.total;
      }
    },

    async onLoad(query) {
      // console.log(query);

      // 将地址参数设置为内部数据
      this.query = query;

      // 设置分页参数
      query.pagenum = this.pagenum; // 第几页
      query.pagesize = this.pagesize; // 每页几条数据

      const {message} = await request({
        url: '/api/public/v1/goods/search',
        data: query
      })

      // console.log(message);
      // 更新数据
      this.goodsList = message.goods;
      // 总计多少数据
      this.total = message.total;
    },

    // 当页面滚动到底部时触发
    onReachBottom () {
      console.log('我到底了...');
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    span {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      span {
        font-size: 22rpx;
      }
    }
  }

  .tips {
    margin-top: 120rpx;
    text-align: center;
    font-size: 36rpx;
    color: #666;
  }
</style>