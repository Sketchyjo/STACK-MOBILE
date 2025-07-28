import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../design/tokens';
import { Icon } from '../atoms/Icon';
export const RoundUpAccumulation = ({ totalSaved, monthlyGoal, currency = 'USD', onWithdraw, onSetGoal, className, testID, style, ...props }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };
    const getProgressPercentage = () => {
        if (!monthlyGoal || monthlyGoal === 0)
            return 0;
        return Math.min((totalSaved / monthlyGoal) * 100, 100);
    };
    const progressPercentage = getProgressPercentage();
    return (_jsxs(TouchableOpacity, { style: [
            {
                backgroundColor: colors.surface.card,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                ...shadows.sm,
            },
            style,
        ], className: className, testID: testID, disabled: !props.onPress, ...props, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.lg
                }, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "ROUND-UP SAVINGS" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.h2.size,
                                        fontWeight: typography.styles.h2.weight,
                                        marginTop: spacing.xs,
                                    },
                                    { color: colors.text.primary }
                                ], children: formatCurrency(totalSaved) })] }), _jsx(View, { style: {
                            backgroundColor: colors.accent.limeGreen + '20', // 20% opacity
                            borderRadius: borderRadius.full,
                            padding: spacing.md,
                        }, children: _jsx(Icon, { name: "trending-up", library: "ionicons", size: 24, color: colors.accent.limeGreen }) })] }), monthlyGoal && monthlyGoal > 0 && (_jsxs(View, { style: { marginBottom: spacing.lg }, children: [_jsxs(View, { style: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.xs
                        }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "Monthly Goal Progress" }), _jsxs(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: [Math.round(progressPercentage), "%"] })] }), _jsx(View, { style: {
                            backgroundColor: colors.surface.light,
                            height: 8,
                            borderRadius: borderRadius.sm,
                            overflow: 'hidden',
                        }, children: _jsx(View, { style: {
                                backgroundColor: colors.accent.limeGreen,
                                height: '100%',
                                width: `${progressPercentage}%`,
                                borderRadius: borderRadius.sm,
                            } }) }), _jsxs(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                                marginTop: spacing.xs,
                            },
                            { color: colors.text.secondary }
                        ], children: ["Goal: ", formatCurrency(monthlyGoal)] })] })), _jsxs(View, { style: { flexDirection: 'row', gap: spacing.md }, children: [onWithdraw && totalSaved > 0 && (_jsxs(TouchableOpacity, { style: {
                            flex: 1,
                            backgroundColor: colors.surface.light,
                            borderRadius: borderRadius.lg,
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, onPress: onWithdraw, testID: `${testID}-withdraw`, children: [_jsx(Icon, { name: "arrow-down", library: "ionicons", size: 16, color: colors.text.primary, style: { marginRight: spacing.xs } }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: "Withdraw" })] })), onSetGoal && (_jsxs(TouchableOpacity, { style: {
                            flex: 1,
                            backgroundColor: monthlyGoal ? colors.surface.light : colors.primary.royalBlue,
                            borderRadius: borderRadius.lg,
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, onPress: onSetGoal, testID: `${testID}-set-goal`, children: [_jsx(Icon, { name: monthlyGoal ? "settings" : "target", library: "ionicons", size: 16, color: monthlyGoal ? colors.text.primary : colors.text.primary, style: { marginRight: spacing.xs } }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: monthlyGoal ? colors.text.primary : colors.text.primary }
                                ], children: monthlyGoal ? 'Edit Goal' : 'Set Goal' })] }))] }), monthlyGoal && progressPercentage >= 100 && (_jsxs(View, { style: {
                    backgroundColor: colors.accent.limeGreen + '20', // 20% opacity
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                }, children: [_jsx(Icon, { name: "trophy", library: "ionicons", size: 20, color: colors.accent.limeGreen, style: { marginRight: spacing.md } }), _jsxs(View, { style: { flex: 1 }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.accent.limeGreen }
                                ], children: "Goal Achieved! \uD83C\uDF89" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "You've reached your monthly savings goal" })] })] }))] }));
};
