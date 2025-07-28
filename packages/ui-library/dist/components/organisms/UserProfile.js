import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { typography } from '../../design/tokens';
export const UserProfile = ({ name, email, avatar, bio, stats, actions, onEditPress, className, }) => {
    return (_jsxs(Card, { className: `p-6 ${className || ''}`, children: [_jsxs(View, { className: "flex-row items-start justify-between mb-4", children: [_jsxs(View, { className: "flex-row items-center flex-1", children: [avatar && (_jsx(View, { className: "mr-4", children: avatar })), _jsxs(View, { className: "flex-1", children: [_jsx(Text, { className: "text-[#000000] text-xl font-bold", style: {
                                            fontFamily: typography.fonts.primary,
                                            fontSize: typography.styles.h2.size,
                                            fontWeight: typography.weights.bold,
                                        }, numberOfLines: 2, children: name }), email && (_jsx(Text, { className: "text-[#A0A0A0] text-sm mt-1", style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.label.size,
                                        }, numberOfLines: 1, children: email }))] })] }), onEditPress && (_jsx(TouchableOpacity, { onPress: onEditPress, className: "p-2 -mr-2", accessibilityRole: "button", accessibilityLabel: "Edit profile", children: _jsx(Text, { className: "text-[#5852FF] text-sm font-medium", children: "Edit" }) }))] }), bio && (_jsx(Text, { className: "text-[#545454] text-base mb-4", style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.body.size,
                    lineHeight: typography.lineHeights.relaxed * typography.styles.body.size,
                }, children: bio })), stats && stats.length > 0 && (_jsx(View, { className: "flex-row justify-around py-4 border-t border-b border-[#F7F7F7] mb-4", children: stats.map((stat, index) => (_jsxs(View, { className: "items-center", children: [_jsx(Text, { className: "text-[#000000] text-lg font-bold", style: {
                                fontFamily: typography.fonts.primary,
                                fontSize: typography.styles.h3.size,
                                fontWeight: typography.weights.bold,
                            }, children: stat.value }), _jsx(Text, { className: "text-[#A0A0A0] text-sm", style: {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.label.size,
                            }, children: stat.label })] }, index))) })), actions && actions.length > 0 && (_jsx(View, { className: "space-y-3", children: actions.map((action, index) => (_jsx(Button, { title: action.label, variant: action.variant || 'primary', onPress: action.onPress, fullWidth: true }, index))) }))] }));
};
