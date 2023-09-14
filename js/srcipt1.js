// import { noitaLib } from "/js/noitaLib.js";
document.body.addEventListener("articleChanged", /** @param {{article: HTMLElement}} e */e => {
  [...e.article.querySelectorAll("script")].forEach(e => e.remove());
});

// // 选取需要监听的节点
// const targetNode = document.body;

// // 创建一个 Observer 实例
// const observer = new MutationObserver((mutationsList, observer) => {
//   // 遍历所有发生变化的 MutationRecord 对象
//   for (let mutation of mutationsList) {
//     // 如果变化类型为 attributes 或者 characterData，则说明发生了重绘
//     if (mutation.type === 'attributes' || mutation.type === 'characterData') {
//       console.log('发生了重绘');
//     }
//   }
// });

// // 配置 Observer 监听的选项
// const config = { attributes: true, childList: true, subtree: true };

// // 开始监听
// observer.observe(targetNode, config);