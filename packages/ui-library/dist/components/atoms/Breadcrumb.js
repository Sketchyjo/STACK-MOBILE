import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { colors, typography, spacing } from '../../design/tokens';
export const Breadcrumb = ({ items, separator, className, testID, }) => {
    const defaultSeparator = (_jsx(Icon, { name: "chevron-forward", library: "ionicons", size: 16, color: colors.text.secondary }));
    return (_jsx(View, { className: `flex-row items-center ${className || ''}`, testID: testID, style: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
        }, children: items.map((item, index) => (_jsxs(React.Fragment, { children: [index > 0 && (_jsx(View, { style: {
                        marginHorizontal: spacing.sm,
                    }, children: separator || defaultSeparator })), item.onPress ? (_jsx(TouchableOpacity, { onPress: item.onPress, accessibilityRole: "button", accessibilityLabel: `Navigate to ${item.label}`, children: _jsx(Text, { style: {
                            fontFamily: typography.fonts.secondary,
                            fontSize: typography.styles.body.size,
                            color: index === items.length - 1
                                ? colors.text.primary
                                : colors.primary.royalBlue,
                            fontWeight: index === items.length - 1 ? '600' : '400',
                        }, children: item.label }) })) : (_jsx(Text, { style: {
                        fontFamily: typography.fonts.secondary,
                        fontSize: typography.styles.body.size,
                        color: colors.text.secondary,
                        fontWeight: '400',
                    }, children: item.label }))] }, index))) }));
};
