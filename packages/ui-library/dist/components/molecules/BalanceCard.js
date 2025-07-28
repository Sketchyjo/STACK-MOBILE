import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { colors, typography } from '../../design/tokens';
export const BalanceCard = ({ balance, currency = 'USD', onTopUpPress, className, ...props }) => {
    return (_jsxs(Card, { variant: "default", padding: "large", className: `${className || ''}`, ...props, children: [_jsxs(View, { className: "mb-6", children: [_jsx(Text, { className: "font-label text-label text-text-secondary mb-1", style: {
                            fontFamily: typography.fonts.secondary,
                            fontSize: typography.styles.label.size,
                            color: colors.text.secondary,
                        }, children: "Portfolio Value" }), _jsxs(Text, { className: "font-bold text-h1 text-text-primary", style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: typography.styles.h1.size,
                            color: colors.text.primary,
                        }, children: ["$", balance, " ", currency] })] }), onTopUpPress && (_jsx(Button, { title: "Top Up", variant: "accent", size: "medium", onPress: onTopUpPress, fullWidth: true }))] }));
};
