import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { MotiView } from 'moti';
import { colors, borderRadius, spacing } from '../../design/tokens';
export const Card = ({ variant = 'default', padding = 'medium', motion, className, children, style, ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: colors.surface.card,
                    borderRadius: borderRadius.xxl,
                };
            case 'quest':
                return {
                    backgroundColor: colors.surface.card,
                    borderRadius: borderRadius.xl,
                };
            default:
                return {
                    backgroundColor: colors.surface.card,
                    borderRadius: borderRadius.xxl,
                };
        }
    };
    const getPaddingStyles = () => {
        switch (padding) {
            case 'none':
                return {};
            case 'small':
                return { padding: 12 };
            case 'medium':
                return { padding: spacing.md };
            case 'large':
                return { padding: spacing.lg };
            default:
                return { padding: spacing.md };
        }
    };
    const combinedStyle = [getVariantStyles(), getPaddingStyles(), style];
    // Use MotiView if motion props are provided, otherwise use a regular View
    const Component = motion ? MotiView : View;
    return (_jsx(Component, { ...(motion || {}), className: className, style: combinedStyle, ...props, children: children }));
};
