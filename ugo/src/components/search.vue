<template>
  <!-- 搜索 -->
  <div class="search" :class="{focused: focused}">
    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <input @confirm="goList" type="text" v-model="keywords" @input="query" :placeholder="placeholder">
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>
    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史<span class="clear" @click="clearHistory"></span></div>
      <div class="history">
        <navigator :url="'/pages/list/main?query=' + item" :key="key" v-for="(item, key) in history">{{item}}</navigator>
      </div>
      <!-- 结果 -->
      <scroll-view scroll-y class="result" v-if="list.length">
        <navigator :url="'/pages/goods/main?id=' + item.goods_id" :key="item.goods_id" v-for="item in list">{{item.goods_name}}</navigator>
      </scroll-view>
    </div>
  </div>
</template>
<script>
  
  // 引入 wx.request 的 Promise 封装版本
  import request from '@/utils/request';

  export default {

    data () {
      return {
        // 搜索状态
        focused: false,
        // 占位符
        placeholder: '',
        // 搜索关键字
        keywords: '',
        // 搜索建议列表
        list: [],
        // 搜索历史，从本地存储中初始数据
        history: mpvue.getStorageSync('history') || [],
        // 请求状态
        locked: false
      }
    },

    methods: {
      // 当用户输入时，发送请求
      async query () {
        // 检测查询是否有意义
        if(this.keywords == '') return this.list = [];

        if(this.locked) return;

        // 一旦新的请求发出，即将 locked 设置为 true
        this.locked = true;

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/goods/qsearch',
          data: {query: this.keywords}
        })

        // console.log(message);
        // 更新数据
        this.list = message;

        // 一旦新的请求完成，即将 locked 设置为 false
        this.locked = false;
      },

      // 跳转到商品列表
      goList () {
        // 必须输入查询关键字
        if(this.keywords == '') return;

        // 将用户的搜索记录，存储在本地

        // 追加新的历史
        this.history.push(this.keywords);

        this.history = [...new Set(this.history)];

        // 对历史存储
        mpvue.setStorageSync('history', this.history);

        // 跳转
        mpvue.navigateTo({
          url: '/pages/list/main?query=' + this.keywords
        })
      },

      // 清空搜索历史
      clearHistory () {
        // 将本地数据清空
        mpvue.removeStorageSync('history');
        this.history = [];
      },

      goSearch (ev) {
        this.focused = true;
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: mpvue.getSystemInfoSync().windowHeight
        })

        // 隐藏tabTab
        mpvue.hideTabBar();
      },

      cancleSearch () {
        this.focused = false;
        this.placeholder = '';

        this.keywords = '';
        this.list = [];

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        })

        // 显示tabBar
        mpvue.showTabBar();
      }
    },

    // mpvue 目前尚不支持 pageLifetimes
    pageLifetimes: {
      show: function() {
        // 当父组件的 show 被触发时
        // 该组件内部的 show 也会被触发
        // console.log(1);
      },

      hide: function() {
        // 当父组件的 hide 被触发时
        // 该组件内部的 hide 也会被触发
        // console.log(2);
      }
    }
  }

</script>
<style lang="less" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>