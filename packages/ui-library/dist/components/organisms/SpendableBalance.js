import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../design/tokens';
import { Icon } from '../atoms/Icon';
export const SpendableBalance = ({ balance, currency = 'USD', isLoading = false, onAddFunds, onViewDetails, className, testID, style, ...props }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };
    return (_jsxs(TouchableOpacity, { style: [
            {
                backgroundColor: colors.surface.card,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                ...shadows.sm,
            },
            style,
        ], className: className, testID: testID, onPress: onViewDetails, disabled: !onViewDetails, ...props, children: [_jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }, children: [_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                            },
                            { color: colors.text.secondary }
                        ], children: "SPENDABLE BALANCE" }), onViewDetails && (_jsx(Icon, { name: "chevron-forward", library: "ionicons", size: 16, color: colors.text.secondary }))] }), _jsxs(View, { style: { marginBottom: spacing.lg }, children: [isLoading ? (_jsx(View, { style: {
                            backgroundColor: colors.surface.light,
                            height: 40,
                            borderRadius: borderRadius.md,
                            marginBottom: spacing.sm
                        } })) : (_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.primary,
                                fontSize: typography.styles.h1.size,
                                fontWeight: typography.styles.h1.weight,
                            },
                            { color: colors.text.primary }
                        ], children: formatCurrency(balance) })), _jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                            },
                            { color: colors.text.secondary }
                        ], children: "Available for spending" })] }), _jsxs(View, { style: { flexDirection: 'row', gap: spacing.md }, children: [onAddFunds && (_jsxs(TouchableOpacity, { style: {
                            flex: 1,
                            backgroundColor: colors.primary.royalBlue,
                            borderRadius: borderRadius.lg,
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, onPress: onAddFunds, testID: `${testID}-add-funds`, children: [_jsx(Icon, { name: "add", library: "ionicons", size: 20, color: colors.text.primary, style: { marginRight: spacing.xs } }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: "Add Funds" })] })), _jsxs(TouchableOpacity, { style: {
                            flex: 1,
                            backgroundColor: colors.surface.light,
                            borderRadius: borderRadius.lg,
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, onPress: () => { }, testID: `${testID}-spend`, children: [_jsx(Icon, { name: "card", library: "ionicons", size: 20, color: colors.text.primary, style: { marginRight: spacing.xs } }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: "Spend" })] })] }), balance < 10 && !isLoading && (_jsxs(View, { style: {
                    backgroundColor: colors.semantic.warning + '20', // 20% opacity
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                }, children: [_jsx(Icon, { name: "warning", library: "ionicons", size: 16, color: colors.semantic.warning, style: { marginRight: spacing.xs } }), _jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                                flex: 1,
                            },
                            { color: colors.semantic.warning }
                        ], children: "Low balance. Add funds to continue spending." })] }))] }));
};
