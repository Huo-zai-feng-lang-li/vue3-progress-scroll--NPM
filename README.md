# progress-scroll 滚动进度可视化插件

> 🤖🎉🎉 进度监控可视化插件是一个基于 原生 `Css + Vue3 钩子` 封装的实用 hooks 工具，用于在 Vue.js 应用程序中展示进度。它提供了一种简单、高效的操作体验、深深感受开发的乐趣 ~

## 📦 体验

[一键速看](https://huozaifenlangli.github.io/Vue3-template/#/scroll)

## 🌍 安装

你可以使用 npm 或 pnpm 安装插件：

```javascript
npm i vue3-progress-scroll
```

## 🛹 注入

在你的主应用程序入口文件（例如 main.js）中，导入并使用 ：
**_`main.js`_**

```javascript
/* Step 1
------------------------------------------------------------------ */
import { useScroll } from "vue3-progress-scroll";
const app = createApp(App);
app.use(useScroll);
```

### 🎉 配置

```javascript
/* Step 2
------------------------------------------------------------------ */
// 注册插件并提供自定义的进度条属性（可选）例如：
app.use(useScroll, {
	progress: "green", // 进度条颜色
	progressRollback: "#fff", // 进度条回滚颜色
	progressTop: "3px", // 进度条距离顶部的距离
	progressLeft: "0px", // 进度条距离左边的距离
	UIViewBackground: "#fff", // 页面背景色
});
```

## 🤖 使用方法

一旦你设置了插件，你就可以在组件中使用 $openScroll 和 $closeScroll() 方法：

> 第一种 inject

```javascript
/* Step 3
------------------------------------------------------------------ */
// 💡 在父容器绑定类名
<div class="ProgressTopBar">
    <p v-for="(item, index) in 1000" :key="index">{{ index + 1 }}</p>
</div>

import { ref, inject } from "vue";
import { scrollKey } from "vue3-progress-scroll";
inject<typeof scrollKey>(scrollKey).$openScroll();
inject<typeof scrollKey>(scrollKey).$closeScroll();
```

> 第二种 getCurrentInstance()

```javascript
import { getCurrentInstance } from "vue";
const { proxy }: any = getCurrentInstance();
proxy.$openScroll();
proxy.$closeScroll();
```

### 📝 使用示例 Demo.vue

```javascript

<template>
	<div class="ProgressTopBar">
		<p v-for="(item, index) in items" :key="index">{{ item }}</p>
	</div>
</template>

<script setup lang="ts">
	// vue3.2.0+ 之后支持的新特性
	defineOptions({
		name: "scrollBar", // 组件名
		inheritAttrs: false, // 是否继承父组件的属性
	});
	import { ref, inject } from "vue";
	const items = ref<string[]>([]);
	for (let i = 0; i < 200; i++) items.value.push(`Item ${i + 1}`);

   import { scrollKey } from "vue3-progress-scroll";
   inject<typeof scrollKey>(scrollKey).$openScroll();
   inject<typeof scrollKey>(scrollKey).$closeScroll();
</script>

```

## 💌 原理

[一键快阅源码（约 20 行）9-28](https://zhang-kun8888.gitee.io/vue3-tools-docs/vue3-progress-scroll.html#%F0%9F%92%8C-%E5%8E%9F%E7%90%86)
