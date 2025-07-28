import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../design/tokens';
import { Icon } from '../atoms/Icon';
export const CollateralValueCard = ({ assetName, assetSymbol, currentValue, collateralValue, collateralRatio, currency = 'USD', trend = 'neutral', trendPercentage, onPress, className, testID, style, ...props }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };
    const formatPercentage = (percentage) => {
        return `${percentage.toFixed(1)}%`;
    };
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return 'trending-up';
            case 'down':
                return 'trending-down';
            default:
                return 'remove';
        }
    };
    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return colors.semantic.success;
            case 'down':
                return colors.semantic.danger;
            default:
                return colors.text.secondary;
        }
    };
    return (_jsxs(TouchableOpacity, { style: [
            {
                backgroundColor: colors.surface.card,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                ...shadows.sm,
            },
            style,
        ], className: className, testID: testID, onPress: onPress, disabled: !onPress, ...props, children: [_jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.h3.size,
                                        fontWeight: typography.styles.h3.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: assetName }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: assetSymbol })] }), trendPercentage !== undefined && (_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(Icon, { name: getTrendIcon(), library: "ionicons", size: 16, color: getTrendColor() }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                        marginLeft: spacing.xs,
                                    },
                                    { color: getTrendColor() }
                                ], children: formatPercentage(Math.abs(trendPercentage)) })] }))] }), _jsxs(View, { style: { marginBottom: spacing.lg }, children: [_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                                marginBottom: spacing.xs,
                            },
                            { color: colors.text.secondary }
                        ], children: "CURRENT VALUE" }), _jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.primary,
                                fontSize: typography.styles.h2.size,
                                fontWeight: typography.styles.h2.weight,
                            },
                            { color: colors.text.primary }
                        ], children: formatCurrency(currentValue) })] }), _jsxs(View, { style: {
                    backgroundColor: colors.surface.light,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.md
                }, children: [_jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "COLLATERAL VALUE" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: formatCurrency(collateralValue) })] }), _jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "COLLATERAL RATIO" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.primary.royalBlue }
                                ], children: formatPercentage(collateralRatio) })] })] }), onPress && (_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, children: [_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                            },
                            { color: colors.text.secondary }
                        ], children: "Tap to view details" }), _jsx(Icon, { name: "chevron-forward", library: "ionicons", size: 16, color: colors.text.secondary, style: { marginLeft: spacing.xs } })] }))] }));
};
