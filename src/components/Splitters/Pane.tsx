import * as React from 'react';
import { forwardRef } from 'react';
import { PaneProps } from './typings/index';

const Pane = forwardRef<HTMLDivElement, PaneProps & { children?: React.ReactNode }>(({ 
    hasDetailPane, 
    id, 
    style, 
    position, 
    className, 
    children 
}, ref) => {
    const isDetailPane = hasDetailPane ? 'bottom-detail-pane' : '';
    return (
        <div ref={ref} id={id} className={`pane ${position} ${isDetailPane} ${className || ''}`} style={style}>
            {children}
        </div>
    );
});

export default Pane;