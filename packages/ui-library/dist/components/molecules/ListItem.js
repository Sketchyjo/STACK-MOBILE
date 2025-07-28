import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { typography } from '../../design/tokens';
export const ListItem = ({ title, subtitle, leftIcon, rightIcon, rightText, onPress, showDivider = true, className, ...props }) => {
    const Component = onPress ? TouchableOpacity : View;
    return (_jsxs(_Fragment, { children: [_jsxs(Component, { onPress: onPress, className: `
          flex-row items-center py-4 px-4
          ${onPress ? 'active:bg-[#F7F7F7]' : ''}
          ${className || ''}
        `, accessibilityRole: onPress ? 'button' : undefined, ...props, children: [leftIcon && (_jsx(View, { className: "mr-3", children: leftIcon })), _jsxs(View, { className: "flex-1", children: [_jsx(Text, { className: "text-[#000000] text-base font-normal", style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.body.size,
                                    fontWeight: typography.weights.regular,
                                }, numberOfLines: 1, children: title }), subtitle && (_jsx(Text, { className: "text-[#A0A0A0] text-sm mt-1", style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.label.size,
                                    fontWeight: typography.weights.regular,
                                }, numberOfLines: 2, children: subtitle }))] }), (rightText || rightIcon) && (_jsxs(View, { className: "flex-row items-center ml-3", children: [rightText && (_jsx(Text, { className: "text-[#A0A0A0] text-sm mr-2", style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.label.size,
                                }, children: rightText })), rightIcon && rightIcon] }))] }), showDivider && (_jsx(View, { className: "h-px bg-[#F7F7F7] ml-4" }))] }));
};
