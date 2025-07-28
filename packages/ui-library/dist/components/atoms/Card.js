import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { colors, borderRadius, spacing } from '../../design/tokens';
export const Card = ({ variant = 'default', padding = 'medium', className, children, style, ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: colors.surface.card, // #F7F7F7
                    borderRadius: borderRadius.xxl, // 20px
                };
            case 'quest':
                return {
                    backgroundColor: colors.surface.card, // #F7F7F7
                    borderRadius: borderRadius.xl, // 16px
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
                return { padding: spacing.md }; // 16px
            case 'large':
                return { padding: spacing.lg }; // 24px
            default:
                return { padding: spacing.md };
        }
    };
    const combinedStyle = [
        getVariantStyles(),
        getPaddingStyles(),
        style,
    ];
    return (_jsx(View, { className: className, style: combinedStyle, ...props, children: children }));
};
