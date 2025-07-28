import { jsx as _jsx } from "react/jsx-runtime";
import { Text, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../design/tokens';
export const TextLink = ({ text, variant = 'primary', size = 'medium', underline = false, className, disabled, ...props }) => {
    const getVariantColor = () => {
        switch (variant) {
            case 'primary':
                return colors.primary.royalBlue;
            case 'secondary':
                return colors.text.secondary;
            case 'accent':
                return colors.accent.limeGreen;
            default:
                return colors.primary.royalBlue;
        }
    };
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: typography.styles.caption.size,
                    fontFamily: typography.fonts.secondary,
                };
            case 'medium':
                return {
                    fontSize: typography.styles.label.size,
                    fontFamily: typography.fonts.secondary,
                };
            case 'large':
                return {
                    fontSize: typography.styles.body.size,
                    fontFamily: typography.fonts.secondary,
                };
            default:
                return {
                    fontSize: typography.styles.label.size,
                    fontFamily: typography.fonts.secondary,
                };
        }
    };
    const textColor = disabled ? colors.text.tertiary : getVariantColor();
    const sizeStyles = getSizeStyles();
    return (_jsx(TouchableOpacity, { disabled: disabled, className: `${className || ''}`, accessibilityRole: "link", accessibilityLabel: text, ...props, children: _jsx(Text, { style: {
                color: textColor,
                fontSize: sizeStyles.fontSize,
                fontFamily: sizeStyles.fontFamily,
                fontWeight: typography.weights.medium,
                textDecorationLine: underline ? 'underline' : 'none',
            }, children: text }) }));
};
