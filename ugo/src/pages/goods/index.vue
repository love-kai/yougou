<template>
  <div class="wrapper" v-if="goods">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="index" v-for="(pic, index) in goods.pics">
        <image :src="pic.pics_big"></image>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <div class="meta">
      <p class="price">￥{{goods.goods_price}}</p>
      <p class="name">{{goods.goods_name}}</p>
      <p class="shipment">快递: 免运费</p>
      <span class="collect">收藏</span>
    </div>
    <!-- 商品详情 -->
    <div class="detail">
      <!-- rich-text 具备解析 html 的能力 -->
      <!-- <rich-text :nodes="goods.goods_introduce"></rich-text> -->
      <!-- img => image  a => navaigator v-html => rich-text -->
      <div v-html="goods.goods_introduce"></div>
    </div>
    <!-- 操作 -->
    <div class="action">
      <button open-type="contact">联系客服</button>
      <span @click="goCart" class="cart">购物车</span>
      <span class="add" @click="addCart">加入购物车</span>
      <span class="buy">立即购买</span>
    </div>
  </div>
</template>

<script>
  //  
  import request from '@/utils/request';
  import sleep from '@/utils/sleep';

  export default {

    data () {
      return {
        goods: null,
        // 初始购物车
        carts: mpvue.getStorageSync('carts') || []
      }
    },

    methods: {

      // 添加购的车
      async addCart () {
        // 如果正常开发，获取商品id、商品数量
        // 如果用户登录 获取用户 id
        // 如果用户没有登录 存在本地

        // 本次课简化处理了，将购物车信息只记录在本地

        // 取出当前商品的相关信息
        const {goods_id, goods_name, goods_price, goods_small_logo} = this.goods;

        let flag = false;

        this.carts.forEach((val) => {
          if(val.goods_id == goods_id) {
            // 表明购物车已经存在某商品
            flag = true;
            // 商品数量加1
            val.goods_number += 1;
            return;
          }
        })

        if(!flag) {
          // 追加购物车
          this.carts.push({
            goods_id,
            goods_name,
            goods_price,
            goods_small_logo,
            goods_number: 1
          });
        }

        // 存入本地
        mpvue.setStorageSync('carts', this.carts);

        // 提示信息
        mpvue.showToast({title: '添加成功!'});

        // 非常规操作，添加成功能，跳转到购物车页面
        // 目的是讲解延时操作的处理

        // 设置一个延时
        await sleep(2000);

        // 跳转到购物车
        mpvue.switchTab({url: '/pages/cart/main'});
      },

      // 跳转到购物车
      goCart () {
        // 如果要跳转的页面是 tabBar 配置中的页面
        // 只能通过 switchTab 实现
        mpvue.switchTab({
          url: '/pages/cart/main'
        })
      },

      // 商品详情接口
      async getGoodsDetail (id) {
        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/goods/detail',
          data: {goods_id: id}
        })

        // console.log(message);
        // 更新数据
        this.goods = message;
      }
    },

    // 获取地址参数
    onLoad (query) {
      // console.log(query);

      // 调用商品详情接口
      this.getGoodsDetail(query.id);
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 720rpx;
  }
  
  .meta {
    height: 270rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 30rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      overflow: hidden;
      text-overflow: ellipsis;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      padding-top: 50rpx;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 22rpx;
      color: #999;

      position: absolute;
      right: 20rpx;
      top: 91rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;

    span {
      display: block;
    }

    .add, .buy {
      width: 210rpx;
      text-align: center;
      line-height: 98rpx;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      line-height: 1;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
      padding-top: 56rpx;                         
    }
  }
</style>

