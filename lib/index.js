"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollKey = exports.useScroll = void 0;
var vue_1 = require("vue");
var timer = null;
// 声明provide的key用于inject接受类型注解
var scrollKey = Symbol();
exports.scrollKey = scrollKey;
function onUnSetProgressProp() {
    var _a, _b, _c;
    var el = document.querySelector(".ProgressTopBar");
    (_a = el === null || el === void 0 ? void 0 : el.style) === null || _a === void 0 ? void 0 : _a.removeProperty("background-image");
    (_b = el === null || el === void 0 ? void 0 : el.style) === null || _b === void 0 ? void 0 : _b.removeProperty("background-size");
    (_c = el === null || el === void 0 ? void 0 : el.style) === null || _c === void 0 ? void 0 : _c.removeProperty("background-repeat");
}
function onSetProgressProp(option) {
    if (option === void 0) { option = {
        progress: "red",
        progressRollback: "#fff",
        progressTop: "3px",
        progressLeft: "0px",
        UIViewBackground: "#fff",
    }; }
    timer = setTimeout(function () {
        var el = document.querySelector(".ProgressTopBar");
        if (el && el instanceof HTMLElement) {
            el.style.setProperty("position", "relative");
            el.style.setProperty("z-index", "1");
            el.style.setProperty("background-image", "linear-gradient(to right top,  ".concat(option.progress, " 50%, ").concat(option.progressRollback, " 50%)"));
            el.style.setProperty("background-size", "100% calc(100% - 100vh + ".concat(option.progressTop, " )"));
            el.style.setProperty("background-repeat", "no-repeat");
            //  无法设置CSS StyleDeclaration 的背景颜色属性：这些样式是计算出来的，因此背景颜色属性是只读的
            // console.log((getComputedStyle(el, '::after').backgroundColor = 'yellow'));
            var styleEl = document.createElement("style");
            styleEl.innerHTML = "\n\t\t\t\t.ProgressTopBar::after {\n\t\t\t\t\tcontent: '';\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\ttop: ".concat(option.progressTop, ";\n\t\t\t\t\tleft: ").concat(option.progressLeft, ";\n\t\t\t\t\tbottom: 0;\n\t\t\t\t\tright: 0;\n\t\t\t\t\tbackground: ").concat(option.UIViewBackground, ";\n\t\t\t\t\tz-index: -1;\n\t\t\t\t}\n\t\t\t");
            document.head.appendChild(styleEl);
        }
    }, 500);
}
// 命名函数openScroll  参数可选、因为只需要在main.ts中传入一次参数即可，其余地方调用不需要传参
function openScroll(option) {
    var payload = function () {
        return option ? onSetProgressProp(option) : onSetProgressProp();
    };
    (0, vue_1.onActivated)(function () { return payload(); });
    (0, vue_1.onMounted)(function () { return payload(); });
}
var closeScroll = function () {
    (0, vue_1.onDeactivated)(function () { return onClear(); });
    (0, vue_1.onUnmounted)(function () { return onClear(); });
};
var onClear = function () {
    if (timer)
        clearTimeout(timer);
    onUnSetProgressProp();
};
// 注册插件接受参数并挂载到全局
var useScroll = {
    install: function (app, option) {
        var payload = function () { return (option ? openScroll(option) : openScroll()); };
        app.provide(scrollKey, {
            $openScroll: function () { return payload(); },
            $closeScroll: function () { return closeScroll; }, // 不能在非setup上下文调用
        });
        app.config.globalProperties.$openScroll = function () { return payload(); };
        app.config.globalProperties.$closeScroll = closeScroll;
    },
};
exports.useScroll = useScroll;
