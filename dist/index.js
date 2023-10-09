import { onActivated, onDeactivated, onMounted, onUnmounted } from "vue";
let timer = null;
const scrollKey = Symbol();
function onUnSetProgressProp() {
    const el = document.querySelector(".ProgressTopBar");
    el?.style?.removeProperty("background-image");
    el?.style?.removeProperty("background-size");
    el?.style?.removeProperty("background-repeat");
}
function onSetProgressProp(option = {
    progress: "red",
    progressRollback: "#fff",
    progressTop: "0px",
    progressLeft: "0px",
    UIViewBackground: "#fff",
}) {
    timer = setTimeout(() => {
        const el = document.querySelector(".ProgressTopBar");
        if (el && el instanceof HTMLElement) {
            el.style.setProperty("position", "relative");
            el.style.setProperty("z-index", "1");
            el.style.setProperty("background-image", `linear-gradient(to right top,  ${option.progress} 50%, ${option.progressRollback} 50%)`);
            el.style.setProperty("background-size", `100% calc(100% - 100vh + ${option.progressTop} )`);
            el.style.setProperty("background-repeat", "no-repeat");
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
function openScroll(option) {
    onActivated(() => onSetProgressProp(option));
    onMounted(() => onSetProgressProp(option));
}
const closeScroll = () => {
    onDeactivated(() => onClear());
    onUnmounted(() => onClear());
};
const onClear = () => {
    if (timer)
        clearTimeout(timer);
    onUnSetProgressProp();
};
const useScroll = {
    install: (app, option) => {
        app.provide(scrollKey, {
            $openScroll: () => (option ? openScroll(option) : openScroll()),
            $closeScroll: () => closeScroll(),
        });
        app.config.globalProperties.$openScroll = () => openScroll(option);
        app.config.globalProperties.$closeScroll = closeScroll;
    },
};
export { useScroll, scrollKey };
