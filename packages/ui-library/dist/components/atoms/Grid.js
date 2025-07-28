import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../design/tokens';
export const Grid = ({ columns = 2, gap = 'md', children, className, style, ...props }) => {
    const gapValue = spacing[gap];
    return (_jsx(View, { className: `flex-row flex-wrap ${className || ''}`, style: [
            {
                marginHorizontal: -gapValue / 2,
            },
            style,
        ], ...props, children: React.Children.map(children, (child, index) => (_jsx(View, { style: {
                width: `${100 / columns}%`,
                paddingHorizontal: gapValue / 2,
                marginBottom: gapValue,
            }, children: child }, index))) }));
};
export const GridItem = ({ span = 1, children, className, style, ...props }) => {
    return (_jsx(View, { className: className, style: [
            {
                flex: span,
            },
            style,
        ], ...props, children: children }));
};
