"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var Pane = (0, react_1.forwardRef)(function (_a, ref) {
    var hasDetailPane = _a.hasDetailPane, id = _a.id, style = _a.style, position = _a.position, className = _a.className, children = _a.children;
    var isDetailPane = hasDetailPane ? 'bottom-detail-pane' : '';
    return (React.createElement("div", { ref: ref, id: id, className: "pane ".concat(position, " ").concat(isDetailPane, " ").concat(className || ''), style: style }, children));
});
exports.default = Pane;
