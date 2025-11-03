"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var HandleBar = React.forwardRef(function (_a, ref) {
    var position = _a.position, handleMouseDown = _a.handleMouseDown, _b = _a.allowResize, allowResize = _b === void 0 ? true : _b;
    var allowResizeClass = allowResize ? '' : 'resize-not-allowed';
    return (React.createElement("div", { ref: ref, className: "handle-bar ".concat(position, " ").concat(allowResizeClass), onMouseDown: function (e) { return handleMouseDown && handleMouseDown(e); }, onTouchStart: function (e) { return handleMouseDown && handleMouseDown(e); } },
        React.createElement("span", { className: "handle-bar_drag" })));
});
exports.default = HandleBar;
