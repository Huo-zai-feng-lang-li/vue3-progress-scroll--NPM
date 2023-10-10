import { App, onActivated, onDeactivated, onMounted, onUnmounted } from "vue";
import type { InjectionKey } from "vue";

interface ScrollBarType {
	progress: string;
	progressRollback: string;
	progressTop: string;
	progressLeft: string;
	UIViewBackground: string;
}

let timer: number | null | undefined = null;
// 声明provide的key用于inject接受类型注解
const scrollKey: InjectionKey<{
	// 参数可选、因为只需要在main.ts中传入一次参数即可，其余地方调用不需要传参
	$openScroll: (option?: ScrollBarType) => void;
	$closeScroll: () => void;
}> = Symbol();

function onUnSetProgressProp(): void {
	const el = document.querySelector<HTMLElement>(".ProgressTopBar");

	el?.style?.removeProperty("background-image");
	el?.style?.removeProperty("background-size");
	el?.style?.removeProperty("background-repeat");
}

function onSetProgressProp(
	option: ScrollBarType = {
		progress: "red",
		progressRollback: "#fff",
		progressTop: "3px",
		progressLeft: "0px",
		UIViewBackground: "#fff",
	}
): void {
	timer = setTimeout(() => {
		const el = document.querySelector(".ProgressTopBar");
		if (el && el instanceof HTMLElement) {
			el.style.setProperty("position", "relative");
			el.style.setProperty("z-index", "1");
			el.style.setProperty(
				"background-image",
				`linear-gradient(to right top,  ${option.progress} 50%, ${option.progressRollback} 50%)`
			);
			el.style.setProperty(
				"background-size",
				`100% calc(100% - 100vh + ${option.progressTop} )`
			);
			el.style.setProperty("background-repeat", "no-repeat");
			//  无法设置CSS StyleDeclaration 的背景颜色属性：这些样式是计算出来的，因此背景颜色属性是只读的
			// console.log((getComputedStyle(el, '::after').backgroundColor = 'yellow'));
			const styleEl = document.createElement("style");
			styleEl.innerHTML = `
				.ProgressTopBar::after {
					content: '';
					position: fixed;
					top: ${option.progressTop};
					left: ${option.progressLeft};
					bottom: 0;
					right: 0;
					background: ${option.UIViewBackground};
					z-index: -1;
				}
			`;
			document.head.appendChild(styleEl);
		}
	}, 500);
}

// 命名函数openScroll  参数可选、因为只需要在main.ts中传入一次参数即可，其余地方调用不需要传参
function openScroll(option?: ScrollBarType): void {
	onActivated(() => onSetProgressProp(option));
	onMounted(() => onSetProgressProp(option));
}

const closeScroll = (): void => {
	onDeactivated(() => onClear());
	onUnmounted(() => onClear());
};

const onClear = (): void => {
	if (timer) clearTimeout(timer);
	onUnSetProgressProp();
};

// 注册插件接受参数并挂载到全局
const useScroll = {
	install: (app: App, option?: ScrollBarType) => {
		app.provide(scrollKey, {
			$openScroll: () => (option ? openScroll(option) : openScroll()),
			$closeScroll: () => closeScroll(),
		});

		app.config.globalProperties.$openScroll = () => openScroll(option); // 注意命名函数赋值需要使用函数表达式赋值，不能直接赋值
		app.config.globalProperties.$closeScroll = closeScroll; //匿名函数可以直接赋值，使用的地方在小括号调用
	},
};

export { useScroll, scrollKey };
