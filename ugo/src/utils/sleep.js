
export default function (ms) {

  return new Promise((resolve, reject) => {
    // 延时
    setTimeout(() => {
      resolve();
    }, ms)
  })
}