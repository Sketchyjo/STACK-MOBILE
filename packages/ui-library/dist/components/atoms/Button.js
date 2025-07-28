import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../design/tokens';
export const Button = ({ title, variant = 'primary', size = 'medium', loading = false, fullWidth = false, icon, disabled, className, ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: colors.primary.royalBlue,
                    ...shadows.md,
                };
            case 'accent':
                return {
                    backgroundColor: colors.accent.limeGreen,
                    ...shadows.md,
                };
            case 'tertiary':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border.secondary,
                };
            case 'fab':
                return {
                    backgroundColor: colors.accent.limeGreen,
                    ...shadows.md,
                    borderRadius: borderRadius.fab,
                    width: 56,
                    height: 56,
                };
            default:
                return {
                    backgroundColor: colors.primary.royalBlue,
                    ...shadows.md,
                };
        }
    };
    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return colors.text.onPrimary;
            case 'accent':
                return colors.text.onAccent;
            case 'tertiary':
                return colors.text.primary;
            case 'fab':
                return colors.text.onAccent;
            default:
                return colors.text.onPrimary;
        }
    };
    const getSizeStyles = () => {
        if (variant === 'fab')
            return {}; // FAB has fixed size
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                };
            case 'medium':
                return {
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                };
            case 'large':
                return {
                    paddingHorizontal: spacing.xl,
                    paddingVertical: spacing.md + 4,
                };
            default:
                return {
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                };
        }
    };
    const getTextSize = () => {
        switch (size) {
            case 'small':
                return typography.styles.caption.size;
            case 'medium':
                return typography.styles.label.size;
            case 'large':
                return typography.styles.body.size;
            default:
                return typography.styles.label.size;
        }
    };
    const isDisabled = disabled || loading;
    const isFab = variant === 'fab';
    const buttonStyle = {
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: isFab ? borderRadius.fab : borderRadius.lg,
        flexDirection: isFab ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth && !isFab ? '100%' : undefined,
        opacity: isDisabled ? 0.5 : 1,
    };
    const textStyle = {
        color: getTextColor(),
        fontSize: getTextSize(),
        fontWeight: typography.weights.medium,
        fontFamily: typography.fonts.secondary,
    };
    return (_jsx(TouchableOpacity, { disabled: isDisabled, style: buttonStyle, accessibilityRole: "button", accessibilityState: { disabled: isDisabled }, accessibilityLabel: title, ...props, children: loading ? (_jsx(ActivityIndicator, { size: "small", color: variant === 'tertiary' ? colors.primary.royalBlue : colors.text.onPrimary })) : (_jsxs(_Fragment, { children: [icon && !isFab && icon, isFab ? (icon || _jsx(Text, { style: textStyle, children: "+" })) : (_jsx(Text, { style: textStyle, children: title }))] })) }));
};
