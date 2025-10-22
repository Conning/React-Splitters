import * as React from 'react';
import { forwardRef } from 'react';
import { HandleBarProps } from './typings/index';

const HandleBar = forwardRef<HTMLDivElement, HandleBarProps>(({ 
    position, 
    handleMouseDown, 
    allowResize = true 
}, ref) => {
    let allowResizeClass = allowResize ? '' : 'resize-not-allowed';
    return (
        <div
            ref={ref}
            className={`handle-bar ${position} ${allowResizeClass}`} 
            onMouseDown={(e) => handleMouseDown && handleMouseDown(e)} 
            onTouchStart={(e) => handleMouseDown && handleMouseDown(e)}
        >
            <span className="handle-bar_drag" />
        </div>
    );
});

export default HandleBar;