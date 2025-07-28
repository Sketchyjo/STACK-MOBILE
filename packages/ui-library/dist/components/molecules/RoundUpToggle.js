import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../design/tokens';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import { Icon } from '../atoms/Icon';
export const RoundUpToggle = ({ isEnabled, onToggle, roundUpAmount = 0, currency = 'USD', onInfoPress, className, testID, }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };
    return (_jsxs(View, { style: {
            backgroundColor: colors.surface.card,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
        }, className: className, testID: testID, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.md
                }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', flex: 1 }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.body.size,
                                        fontWeight: typography.styles.body.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: "Round-up Savings" }), onInfoPress && (_jsx(TouchableOpacity, { onPress: onInfoPress, style: { marginLeft: spacing.xs }, testID: `${testID}-info`, children: _jsx(Icon, { name: "information-circle-outline", library: "ionicons", size: 20, color: colors.text.secondary }) }))] }), _jsx(ToggleSwitch, { value: isEnabled, onValueChange: onToggle })] }), _jsx(Text, { style: [
                    {
                        fontFamily: typography.fonts.secondary,
                        fontSize: typography.styles.caption.size,
                        fontWeight: typography.styles.caption.weight,
                        marginBottom: spacing.md,
                    },
                    { color: colors.text.secondary }
                ], children: isEnabled
                    ? 'Automatically round up purchases and save the spare change'
                    : 'Turn on to start saving spare change from your purchases' }), isEnabled && roundUpAmount > 0 && (_jsxs(View, { style: {
                    backgroundColor: colors.accent.limeGreen + '20', // 20% opacity
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                }, children: [_jsx(Icon, { name: "trending-up", library: "ionicons", size: 16, color: colors.accent.limeGreen, style: { marginRight: spacing.xs } }), _jsxs(View, { style: { flex: 1 }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.secondary }
                                ], children: "Total saved this month" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: colors.accent.limeGreen }
                                ], children: formatCurrency(roundUpAmount) })] })] })), isEnabled && (_jsxs(View, { style: {
                    backgroundColor: colors.surface.light,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.md,
                }, children: [_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                                marginBottom: spacing.xs,
                            },
                            { color: colors.text.secondary }
                        ], children: "Example:" }), _jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between' }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.text.primary }
                                ], children: "Purchase: $4.25" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                    },
                                    { color: colors.accent.limeGreen }
                                ], children: "Round-up: $0.75" })] })] }))] }));
};
