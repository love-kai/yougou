
export default function (obj) {

  // 处理请求所需要的参数
  let url = obj.url || '';
  let data = obj.data || {};
  let method = obj.method || 'get';

  // 配置基础路径
  url = 'https://www.zhengzhicheng.cn' + url;

  // 进行Promise的封装
  // new Date();

  // var xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {

    // 开启加载状态
    mpvue.showLoading({title: '正在加载...'});

    // 对 wx.request 进行 Promise 的封装
    mpvue.request({
      url,
      method,
      data,
      success (info) {
        resolve(info.data);

        // 关闭加载状态
        mpvue.hideLoading();
      }
    });

  });

}