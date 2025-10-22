"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splitter = void 0;
var React = require("react");
var react_1 = require("react");
/********************************
* import files needed for splitter to work
********************************/
var Pane_1 = require("./Pane");
var HandleBar_1 = require("./HandleBar");
var Helpers_1 = require("./Helpers");
require("./splitters.css");
exports.Splitter = React.forwardRef(function (_a, ref) {
    var _b;
    var _c = _a.position, position = _c === void 0 ? 'vertical' : _c, _d = _a.postPoned, postPoned = _d === void 0 ? false : _d, _e = _a.dispatchResize, dispatchResize = _e === void 0 ? false : _e, _f = _a.primaryPaneMaxWidth, primaryPaneMaxWidth = _f === void 0 ? '80%' : _f, _g = _a.primaryPaneMinWidth, primaryPaneMinWidth = _g === void 0 ? 300 : _g, _h = _a.primaryPaneWidth, primaryPaneWidth = _h === void 0 ? '50%' : _h, _j = _a.primaryPaneMaxHeight, primaryPaneMaxHeight = _j === void 0 ? '80%' : _j, _k = _a.primaryPaneMinHeight, primaryPaneMinHeight = _k === void 0 ? 300 : _k, _l = _a.primaryPaneHeight, primaryPaneHeight = _l === void 0 ? '50%' : _l, children = _a.children, className = _a.className, primaryPaneClassName = _a.primaryPaneClassName, secondaryPaneClassName = _a.secondaryPaneClassName, maximizedPrimaryPane = _a.maximizedPrimaryPane, minimalizedPrimaryPane = _a.minimalizedPrimaryPane, allowResize = _a.allowResize, onDragFinished = _a.onDragFinished, hasDetailPane = _a.hasDetailPane;
    var _m = (0, react_1.useState)({
        isDragging: false,
        handleMouseMove: function (e) { console.log(e); }
    }), state = _m[0], setState = _m[1];
    var paneWrapperRef = (0, react_1.useRef)(null);
    var panePrimaryRef = (0, react_1.useRef)(null);
    var handlebarRef = (0, react_1.useRef)(null);
    var paneNotPrimaryRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, function () {
        return {
            getState: function () { return state; },
            getRoot: function () { return paneWrapperRef.current; },
            resetState: function () {
                setState(function (prev) { return (__assign(__assign({}, prev), { handleBarOffsetFromParent: 0, isDragging: false, lastX: 0, lastY: 0, maxMousePosition: 0, primaryPane: 0 })); });
            }
        };
    }, [state, panePrimaryRef.current]);
    var getHandleMouseMove = (0, react_1.useCallback)(function (state, position, primaryPaneMinHeight, primaryPaneMinWidth, postPoned) {
        return function (e) {
            /********************************
            * check if the state is still isDragging, if not, stop the function
            * unselectAll - unselect all selected text
            * check position of mouse in the splitter and and set the width or height of primary pane
            * save last positions of X and Y coords (that is necessary for touch screen)
            ********************************/
            if (!state.isDragging) {
                return;
            }
            (0, Helpers_1.unselectAll)();
            var _a = state.handleBarOffsetFromParent, handleBarOffsetFromParent = _a === void 0 ? 0 : _a, _b = state.maxMousePosition, maxMousePosition = _b === void 0 ? 0 : _b;
            var clientX = 0;
            var clientY = 0;
            if (e.type === 'mousemove') {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            else if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            var primaryPanePosition = (0, Helpers_1.getPrimaryPaneWidth)(position, clientX, clientY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);
            if (postPoned) {
                setState(function (prev) { return (__assign(__assign({}, prev), { handleBarClonePosition: primaryPanePosition, lastX: clientX, lastY: clientY, isVisible: true })); });
            }
            else {
                setState(function (prev) { return (__assign(__assign({}, prev), { primaryPane: primaryPanePosition, lastX: clientX, lastY: clientY })); });
            }
        };
    }, []);
    var getSize = (0, react_1.useCallback)(function (event, cX, cY) {
        /********************************
        * This function calculates the max position of a mouse in the current splitter from given percentage.
        /********************************/
        var maxMousePosition;
        var nodeWrapperSize;
        var primaryPaneOffset;
        if (!paneWrapperRef.current || !panePrimaryRef.current) {
            return;
        }
        var wrapper = paneWrapperRef.current.getBoundingClientRect();
        var primaryPane = panePrimaryRef.current.getBoundingClientRect();
        var handleBarSize = handlebarRef.current ? handlebarRef.current.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
        var posInHandleBar = position === 'vertical'
            ? handleBarSize.left - (cX || 0)
            : handleBarSize.top - (cY || 0);
        // find only letters from string
        var regEx = new RegExp(/\D+/gi);
        if (position === 'vertical') {
            // split the maxWidth/maxHeight string to string and numbers
            var maxWidthStr = primaryPaneMaxWidth.match(regEx)[0].toLowerCase();
            var maxWidthNum = parseFloat(primaryPaneMaxWidth.split(regEx)[0]);
            nodeWrapperSize = wrapper.width;
            primaryPaneOffset = primaryPane.left;
            if (maxWidthStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxWidthNum / 100)) + primaryPaneOffset - (handleBarSize.width + posInHandleBar));
            }
            else if (maxWidthStr === 'px') {
                maxMousePosition =
                    Math.floor((maxWidthNum + primaryPaneOffset) - handleBarSize.width);
            }
        }
        else {
            var maxHeightStr = primaryPaneMaxHeight.match(regEx)[0].toLowerCase();
            var maxHeightNum = parseFloat(primaryPaneMaxHeight.split(regEx)[0]);
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;
            if (maxHeightStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxHeightNum / 100)) + primaryPaneOffset - (handleBarSize.height + posInHandleBar));
            }
            else if (maxHeightStr === 'px') {
                maxMousePosition =
                    Math.floor((maxHeightNum + primaryPaneOffset) - handleBarSize.height);
            }
        }
        var newPosistionState = {
            maxMousePosition: maxMousePosition
        };
        setState(function (prev) { return (__assign(__assign({}, prev), newPosistionState)); });
        return newPosistionState;
    }, [position, primaryPaneMaxWidth, primaryPaneMaxHeight]);
    var handleMouseUp = (0, react_1.useCallback)(function (e) {
        /********************************
        * Dispatch event is for components which resizes on window resize
        ********************************/
        if (!state.isDragging) {
            return;
        }
        var _a = state.handleBarOffsetFromParent, handleBarOffsetFromParent = _a === void 0 ? 0 : _a, _b = state.lastX, lastX = _b === void 0 ? 0 : _b, _c = state.lastY, lastY = _c === void 0 ? 0 : _c, _d = state.maxMousePosition, maxMousePosition = _d === void 0 ? 0 : _d;
        var primaryPanePosition = (0, Helpers_1.getPrimaryPaneWidth)(position, lastX, lastY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);
        if (postPoned) {
            setState(function (prev) { return (__assign(__assign({}, prev), { isDragging: false, isVisible: false, primaryPane: primaryPanePosition })); });
        }
        else {
            setState(function (prev) { return (__assign(__assign({}, prev), { isDragging: false, primaryPane: primaryPanePosition })); });
        }
        document.removeEventListener('mousemove', state.handleMouseMove);
        document.removeEventListener('touchmove', state.handleMouseMove);
        // call resize event to trigger method for updating of DataGrid width
        // TODO: add this event for IE11
        if (typeof dispatchResize === 'boolean') {
            window.dispatchEvent(new Event('resize'));
        }
        // callback function from parent component
        if (typeof onDragFinished === 'function') {
            onDragFinished();
        }
        if (React.Children.count(children) > 1) {
            getSize(e, lastX, lastY);
        }
    }, [state.isDragging, state.handleBarOffsetFromParent, state.lastX, state.lastY, state.maxMousePosition, state.handleMouseMove, position, primaryPaneMinHeight, primaryPaneMinWidth, postPoned, dispatchResize, onDragFinished, children]);
    // Effect to set up event listeners
    (0, react_1.useEffect)(function () {
        /********************************
        * Sets event listeners after component is mounted.
        * If there is only one pane, the resize event listener won't be added
        ********************************/
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        if (React.Children.count(children) > 1) {
            window.addEventListener('resize', getSize);
        }
        return function () {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
            if (React.Children.count(children) > 1) {
                window.removeEventListener('resize', getSize);
            }
        };
    }, [children, getSize, handleMouseUp]); // Added dependencies
    var handleMouseDown = (0, react_1.useCallback)(function (e) {
        /********************************
        * If the right button was clicked - stop the function
        * If there is more then one pane, we get the sizes of panes + max pos of mouse in splitter
        * add event listener for touch move and mouse move
        ********************************/
        if (e.button === 2 || allowResize === false) {
            return;
        }
        var handleBarOffsetFromParent;
        var clientX = 0;
        var clientY = 0;
        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        var sizeState;
        if (React.Children.count(children) > 1) {
            sizeState = getSize(e, clientX, clientY);
        }
        if (position === 'horizontal') {
            handleBarOffsetFromParent = clientY - e.target.offsetTop;
        }
        else if (position === 'vertical') {
            handleBarOffsetFromParent = clientX - e.target.offsetLeft;
        }
        var newState = __assign({ isDragging: true, handleBarOffsetFromParent: handleBarOffsetFromParent }, sizeState);
        var handleMouseMove = getHandleMouseMove(__assign(__assign({}, state), newState), position, primaryPaneMinHeight, primaryPaneMinWidth, postPoned);
        setState(function (prev) { return (__assign(__assign(__assign({}, prev), newState), { handleMouseMove: handleMouseMove })); });
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
    }, [allowResize, children, getSize, position]);
    /********************************
     * set width of primary pane according to props, or state
    ********************************/
    var handleBarClonePosition = state.handleBarClonePosition, primaryPane = state.primaryPane, isVisible = state.isVisible;
    var paneStyle;
    switch (position) {
        case 'vertical': {
            if (maximizedPrimaryPane) {
                paneStyle = {
                    width: '100%',
                    minWidth: primaryPaneMinWidth,
                    maxWidth: '100%'
                };
            }
            else if (minimalizedPrimaryPane) {
                paneStyle = {
                    width: '0px',
                    minWidth: 0,
                    maxWidth: primaryPaneMaxWidth
                };
            }
            else {
                paneStyle = {
                    width: primaryPane ? "".concat(primaryPane, "px") : primaryPaneWidth,
                    minWidth: primaryPaneMinWidth,
                    maxWidth: primaryPaneMaxWidth
                };
            }
            break;
        }
        case 'horizontal': {
            if (maximizedPrimaryPane) {
                paneStyle = {
                    height: '100%',
                    minHeight: 0,
                    maxHeight: '100%'
                };
            }
            else if (minimalizedPrimaryPane) {
                paneStyle = {
                    height: '0px',
                    minHeight: 0,
                    maxHeight: primaryPaneMaxHeight
                };
            }
            else {
                paneStyle = {
                    height: primaryPane ? "".concat(primaryPane, "px") : primaryPaneHeight,
                    minHeight: primaryPaneMinHeight,
                    maxHeight: primaryPaneMaxHeight
                };
            }
            break;
        }
        default:
    }
    var onePaneStyle = undefined;
    if (!children[1]) {
        onePaneStyle = {
            width: '100%',
            maxWidth: '100%',
            height: '100%'
        };
    }
    var handlebarClone;
    if (React.Children.count(children) > 1 && postPoned) {
        handlebarClone = (_b = {},
            _b[position === 'vertical' ? 'left' : 'top'] = handleBarClonePosition + 'px',
            _b);
    }
    return (React.createElement("div", { className: "splitter ".concat(position === 'vertical' ? 'vertical' : 'horizontal', " ").concat(className || ''), style: onePaneStyle || null, ref: paneWrapperRef },
        React.createElement(Pane_1.default, { className: "primary ".concat(primaryPaneClassName || ''), position: position, style: paneStyle, ref: panePrimaryRef }, !children[1] ? children : children[0]),
        children[1]
            ? React.createElement(HandleBar_1.default, { position: position, handleMouseDown: handleMouseDown, ref: handlebarRef, allowResize: allowResize })
            : null,
        postPoned && isVisible
            ? React.createElement("div", { className: "handle-bar handle-bar_clone ".concat(position === 'vertical' ? 'vertical' : 'horizontal', " "), style: handlebarClone })
            : null,
        children[1]
            ? React.createElement(Pane_1.default, { className: secondaryPaneClassName || '', position: position, hasDetailPane: hasDetailPane, ref: paneNotPrimaryRef }, children[1])
            : null));
});
