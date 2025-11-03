"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unselectAll = unselectAll;
exports.getPrimaryPaneWidth = getPrimaryPaneWidth;
function unselectAll() {
    var _a;
    try {
        (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
    }
    catch (e) {
        console.warn(e);
    }
}
function getPrimaryPaneWidth(position, lastX, lastY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth) {
    var primaryPanePosition;
    switch (position) {
        case 'horizontal': {
            if (lastY > maxMousePosition) {
                primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
            }
            else if ((lastY - handleBarOffsetFromParent) <= primaryPaneMinHeight) {
                primaryPanePosition = primaryPaneMinHeight + 0.001;
            }
            else {
                primaryPanePosition = lastY - handleBarOffsetFromParent;
            }
            break;
        }
        case 'vertical':
        default: {
            if (lastX >= maxMousePosition) {
                primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
            }
            else if ((lastX - handleBarOffsetFromParent) <= primaryPaneMinWidth) {
                primaryPanePosition = primaryPaneMinWidth + 0.001;
            }
            else {
                primaryPanePosition = lastX - handleBarOffsetFromParent;
            }
            break;
        }
    }
    return primaryPanePosition;
}
