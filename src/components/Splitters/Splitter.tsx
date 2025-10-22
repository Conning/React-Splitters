import * as React from 'react';
import { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
/********************************
* import files needed for splitter to work
********************************/
import Pane from './Pane';
import HandleBar from './HandleBar';
import { unselectAll, getPrimaryPaneWidth } from './Helpers';
import { SplitterProps } from './typings/index';
import type { handlePositionType } from './typings/index';
import './splitters.css';

// TODO: 
// * uložit stav splitteru do localStorage,nebo někam jinam, bude na to callback funkce

interface SplitterState {
    isDragging: boolean;
    maxMousePosition?: number;
    handleBarOffsetFromParent?: number;
    primaryPane?: number;
    lastX?: number;
    lastY?: number;
    handleBarClonePosition?: number;
    isVisible?: boolean;
    handleMouseMove: (e: Event) => void;
}

export interface SplitterRef {
    getState: () => SplitterState;
    getRoot: () => HTMLDivElement;
    resetState: () => void;
}

export const Splitter = React.forwardRef<SplitterRef, SplitterProps>(({
    position = 'vertical' as handlePositionType,
    postPoned = false,
    dispatchResize = false,
    primaryPaneMaxWidth = '80%',
    primaryPaneMinWidth = 300,
    primaryPaneWidth = '50%',
    primaryPaneMaxHeight = '80%',
    primaryPaneMinHeight = 300,
    primaryPaneHeight = '50%',
    children,
    className,
    primaryPaneClassName,
    secondaryPaneClassName,
    maximizedPrimaryPane,
    minimalizedPrimaryPane,
    allowResize,
    onDragFinished,
    hasDetailPane
}, ref) => {
    const [state, setState] = useState<SplitterState>({
        isDragging: false,
        handleMouseMove: (e) => { console.log(e); }
    });

    const paneWrapperRef = useRef<HTMLDivElement>(null);
    const panePrimaryRef = useRef<HTMLDivElement>(null);
    const handlebarRef = useRef<HTMLDivElement>(null);
    const paneNotPrimaryRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => {
        return {
            getState() { return state; },
            getRoot() { return paneWrapperRef.current as HTMLDivElement; },
            resetState() {
                setState((prev: SplitterState) => ({
                    ...prev,
                    handleBarOffsetFromParent: 0,
                    isDragging: false,
                    lastX: 0,
                    lastY: 0,
                    maxMousePosition: 0,
                    primaryPane: 0
                }));
            }
        };
    }, [state, panePrimaryRef.current]);
    
    const getHandleMouseMove = useCallback((state, position, primaryPaneMinHeight, primaryPaneMinWidth, postPoned) => {
        return (e: MouseEvent | TouchEvent) => {
            /********************************
            * check if the state is still isDragging, if not, stop the function
            * unselectAll - unselect all selected text
            * check position of mouse in the splitter and and set the width or height of primary pane
            * save last positions of X and Y coords (that is necessary for touch screen)
            ********************************/
            if (!state.isDragging) {
                return;
            }
            
            unselectAll();

            const {
                handleBarOffsetFromParent = 0,
                maxMousePosition = 0
            } = state;

            let clientX: number = 0;
            let clientY: number = 0;

            if (e.type === 'mousemove') {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            } else if (e.type === 'touchmove') {
                clientX = (e as TouchEvent).touches[0].clientX;
                clientY = (e as TouchEvent).touches[0].clientY;
            }

            const primaryPanePosition = getPrimaryPaneWidth(position, clientX, clientY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);
            if (postPoned) {
                setState((prev: SplitterState) => ({
                    ...prev,
                    handleBarClonePosition: primaryPanePosition,
                    lastX: clientX,
                    lastY: clientY,
                    isVisible: true
                }));
            } else {
                setState((prev: SplitterState) => ({
                    ...prev,
                    primaryPane: primaryPanePosition,
                    lastX: clientX,
                    lastY: clientY
                }));
            }
        };
    }, []);

    const getSize = useCallback((event, cX?: number, cY?: number) => {
        /********************************
        * This function calculates the max position of a mouse in the current splitter from given percentage.
        /********************************/
        let maxMousePosition: number | undefined;
        let nodeWrapperSize: number;
        let primaryPaneOffset: number;
        
        if (!paneWrapperRef.current || !panePrimaryRef.current) {
            return;
        }

        let wrapper = paneWrapperRef.current.getBoundingClientRect();
        let primaryPane = panePrimaryRef.current.getBoundingClientRect();
        let handleBarSize = handlebarRef.current ? handlebarRef.current.getBoundingClientRect() : { left: 0, top: 0 , width: 0, height: 0};
        const posInHandleBar = position === 'vertical'
            ? handleBarSize.left - (cX || 0)
            : handleBarSize.top - (cY || 0);

        // find only letters from string
        const regEx = new RegExp(/\D+/gi);
         
        if (position === 'vertical') {
            // split the maxWidth/maxHeight string to string and numbers
            let maxWidthStr = primaryPaneMaxWidth!.match(regEx)![0].toLowerCase();
            let maxWidthNum = parseFloat(primaryPaneMaxWidth!.split(regEx)[0]);
            nodeWrapperSize = wrapper.width;
            primaryPaneOffset = primaryPane.left;

            if (maxWidthStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxWidthNum / 100)) + primaryPaneOffset - (handleBarSize.width + posInHandleBar));
            } else if (maxWidthStr === 'px') {
                maxMousePosition =
                    Math.floor((maxWidthNum + primaryPaneOffset) - handleBarSize.width);
            }
        } else {
            let maxHeightStr = primaryPaneMaxHeight!.match(regEx)![0].toLowerCase();
            let maxHeightNum = parseFloat(primaryPaneMaxHeight!.split(regEx)[0]);
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;

            if (maxHeightStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxHeightNum / 100)) + primaryPaneOffset - (handleBarSize.height + posInHandleBar));
            } else if (maxHeightStr === 'px') {
                maxMousePosition =
                    Math.floor((maxHeightNum + primaryPaneOffset) - handleBarSize.height);
            }
        }

        let newPosistionState = {
            maxMousePosition
        };
        setState((prev: SplitterState) => ({
            ...prev,
            ...newPosistionState
        }));
        return newPosistionState;
    }, [position, primaryPaneMaxWidth, primaryPaneMaxHeight]);

    const handleMouseUp = useCallback((e: any) => {
        /********************************
        * Dispatch event is for components which resizes on window resize
        ********************************/
        if (!state.isDragging) {
            return;
        }

        const {
            handleBarOffsetFromParent = 0,
            lastX = 0,
            lastY = 0,
            maxMousePosition = 0
        } = state;

        const primaryPanePosition = getPrimaryPaneWidth(position, lastX, lastY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);

        if (postPoned) {
            setState((prev: SplitterState) => ({
                ...prev,
                isDragging: false,
                isVisible: false,
                primaryPane: primaryPanePosition
            }));
        } else {
            setState((prev: SplitterState) => ({
                ...prev,
                isDragging: false,
                primaryPane: primaryPanePosition
            }));
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
    useEffect(() => {
        /********************************
        * Sets event listeners after component is mounted.
        * If there is only one pane, the resize event listener won't be added
        ********************************/
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        if (React.Children.count(children) > 1) {
            window.addEventListener('resize', getSize);
        }

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
            if (React.Children.count(children) > 1) {
                window.removeEventListener('resize', getSize);
            }
        };
    }, [children, getSize, handleMouseUp]); // Added dependencies

    const handleMouseDown = useCallback((e: any) => {
        /********************************
        * If the right button was clicked - stop the function
        * If there is more then one pane, we get the sizes of panes + max pos of mouse in splitter
        * add event listener for touch move and mouse move
        ********************************/
        if (e.button === 2 || allowResize === false) {
            return;
        }

        let handleBarOffsetFromParent: number | undefined;
        let clientX: number = 0;
        let clientY: number = 0;

        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        let sizeState;
        if (React.Children.count(children) > 1) {
            sizeState = getSize(e, clientX, clientY);
        }

        if (position === 'horizontal') {
            handleBarOffsetFromParent = clientY - e.target.offsetTop;
        } else if (position === 'vertical') {
            handleBarOffsetFromParent = clientX - e.target.offsetLeft;
        }

        const newState = {
            isDragging: true,
            handleBarOffsetFromParent,
            ...sizeState
        };

        const handleMouseMove = getHandleMouseMove({ ...state, ...newState }, position, primaryPaneMinHeight, primaryPaneMinWidth, postPoned);
        setState((prev: SplitterState) => ({
            ...prev,
            ...newState,
            handleMouseMove
        }));

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
    }, [allowResize, children, getSize, position]);

    /********************************
     * set width of primary pane according to props, or state
    ********************************/
    const {
        handleBarClonePosition,
        primaryPane,
        isVisible
    } = state;

    let paneStyle;
    switch (position) {
        case 'vertical': {
            if (maximizedPrimaryPane) {
                paneStyle = {
                    width: '100%',
                    minWidth: primaryPaneMinWidth,
                    maxWidth: '100%'
                };
            } else if (minimalizedPrimaryPane) {
                paneStyle = {
                    width: '0px',
                    minWidth: 0,
                    maxWidth: primaryPaneMaxWidth
                };
            } else {
                paneStyle = {
                    width: primaryPane ? `${primaryPane}px` : primaryPaneWidth,
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
            } else if (minimalizedPrimaryPane) {
                paneStyle = {
                    height: '0px',
                    minHeight: 0,
                    maxHeight: primaryPaneMaxHeight
                };
            } else {
                paneStyle = {
                    height: primaryPane ? `${primaryPane}px` : primaryPaneHeight,
                    minHeight: primaryPaneMinHeight,
                    maxHeight: primaryPaneMaxHeight
                };
            }
            break;
        }

        default:
    }

    let onePaneStyle: any = undefined;
    if (!children[1]) {
        onePaneStyle = {
            width: '100%',
            maxWidth: '100%',
            height: '100%'
        };
    }

    let handlebarClone;
    if (React.Children.count(children) > 1 && postPoned) {
        handlebarClone = {
            [position === 'vertical' ? 'left' : 'top']: handleBarClonePosition + 'px'
        };
    }

    return (
        <div
            className={`splitter ${position === 'vertical' ? 'vertical' : 'horizontal'} ${className || ''}`}
            style={onePaneStyle || null}
            ref={paneWrapperRef}
        >
            <Pane
                className={`primary ${primaryPaneClassName || ''}`}
                position={position}
                style={paneStyle}
                ref={panePrimaryRef}
            >
                {!children[1] ? children : children[0]}
            </Pane>

            {
                children[1]
                    ? <HandleBar
                        position={position}
                        handleMouseDown={handleMouseDown}
                        ref={handlebarRef}
                        allowResize={allowResize}
                    />
                    : null
            }

            {
                postPoned && isVisible
                    ? <div
                        className={`handle-bar handle-bar_clone ${position === 'vertical' ? 'vertical' : 'horizontal'} `}
                        style={handlebarClone}
                    />
                    : null
            }

            {
                children[1]
                    ? <Pane
                        className={secondaryPaneClassName || ''}
                        position={position}
                        hasDetailPane={hasDetailPane}
                        ref={paneNotPrimaryRef}
                    >
                        {children[1]}
                    </Pane>
                    : null
            }
        </div>
    );
});