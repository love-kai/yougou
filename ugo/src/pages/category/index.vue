<template>
  <div>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <!-- mpvue 处理 v-show 时有瑕疵！ -->
    <div class="category" v-if="topCategories.length">
      <!-- 顶级分类 -->
      <ul class="sup">
        <scroll-view scroll-y>
          <li :class="{active: currentIndex == topIndex}" @click="getChildCategories(topIndex)" :key="top.cat_id" v-for="(top, topIndex) in topCategories">{{top.cat_name}}</li>
        </scroll-view>
      </ul>
      <!-- 子级分类 -->
      <div class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="/static/uploads/category.png" class="thumb"></image>
          <div class="children" :key="childIndex" v-for="(child, childIndex) in childCategories">
            <div class="title">{{child.cat_name}}</div>
            <!-- 品牌 -->
            <div class="brands">
              <navigator url="" :key="brandIndex" v-for="(brand, brandIndex) in child.children">
                <image :src="brand.cat_icon"></image>
                <span>{{brand.cat_name}}</span>
              </navigator>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      li {
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        span {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>

<script>
  
  // 引入自定义搜索组件
  import search from '@/components/search';

  // 引入 wx.request 的 Promise 的封装版本
  import request from '@/utils/request';

  export default {

    data () {
      return {
        // 一级分类
        topCategories: [],
        // 当前一级分类的索引
        currentIndex: 0
      }
    },

    computed: {
      // 二级分类
      childCategories () {
        return this.topCategories.length && this.topCategories[this.currentIndex].children;
      }
    },
    
    components: {
      search
    },

    // mpvue 中的 created 转换成了 onLaunch
    // created () {
    //   console.log('分类加载了...');
    // },

    methods: {

      // 分类接口
      async getTopCategories () {
        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/categories'
        });

        // console.log(message);

        // 更新一级分类
        this.topCategories = message;
      },

      // 根据一级分类的 id 获取相应的二级分类
      getChildCategories (index) {
        this.currentIndex = index;
      }
    },

    mounted () {
      // console.log('我是分类页面...');
      // 调用分类接口
      this.getTopCategories();
    }
  }
</script>