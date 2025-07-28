import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
import { Card } from '../atoms/Card';
import { colors, typography } from '../../design/tokens';
export const FeatureCard = ({ icon, title, description, className, ...props }) => {
    return (_jsxs(Card, { variant: "default", padding: "large", className: `items-center text-center ${className || ''}`, ...props, children: [_jsx(View, { className: "mb-4", children: icon }), _jsx(Text, { className: "font-bold text-h3 text-text-primary text-center mb-2", style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    color: colors.text.primary,
                }, children: title }), _jsx(Text, { className: "font-body text-body text-text-secondary text-center", style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.body.size,
                    color: colors.text.secondary,
                    lineHeight: typography.styles.body.size * typography.lineHeights.normal,
                }, children: description })] }));
};
