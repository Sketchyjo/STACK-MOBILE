import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../design/tokens';
import { Icon } from '../atoms/Icon';
export const VirtualCardDisplay = ({ cardNumber, cardholderName, expiryDate, balance, currency = 'USD', cardType = 'visa', isActive = true, onPress, onToggleVisibility, isNumberVisible = false, className, testID, style, ...props }) => {
    const formatCardNumber = (number) => {
        if (!isNumberVisible) {
            return `•••• •••• •••• ${number.slice(-4)}`;
        }
        return number.replace(/(.{4})/g, '$1 ').trim();
    };
    const formatBalance = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };
    const getCardTypeIcon = () => {
        switch (cardType) {
            case 'visa':
                return 'card';
            case 'mastercard':
                return 'card';
            case 'amex':
                return 'card';
            default:
                return 'card';
        }
    };
    return (_jsxs(TouchableOpacity, { style: [
            {
                backgroundColor: isActive ? colors.primary.royalBlue : colors.surface.light,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                minHeight: 200,
                ...shadows.md,
            },
            style,
        ], className: className, testID: testID, onPress: onPress, disabled: !onPress, ...props, children: [_jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(Icon, { name: getCardTypeIcon(), library: "ionicons", size: 24, color: isActive ? colors.text.onPrimary : colors.text.primary }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                        marginLeft: spacing.sm,
                                    },
                                    { color: isActive ? colors.text.onPrimary : colors.text.primary }
                                ], children: cardType.toUpperCase() })] }), onToggleVisibility && (_jsx(TouchableOpacity, { onPress: onToggleVisibility, children: _jsx(Icon, { name: isNumberVisible ? 'eye-off' : 'eye', library: "ionicons", size: 20, color: isActive ? colors.text.onPrimary : colors.text.secondary }) }))] }), _jsx(View, { style: { marginBottom: spacing.lg }, children: _jsx(Text, { style: [
                        {
                            fontFamily: typography.fonts.primary,
                            fontSize: 18,
                            fontWeight: typography.weights.medium,
                            letterSpacing: 2,
                        },
                        { color: isActive ? colors.text.onPrimary : colors.text.primary }
                    ], children: formatCardNumber(cardNumber) }) }), _jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                        marginBottom: spacing.xs,
                                    },
                                    { color: isActive ? colors.text.onPrimary : colors.text.secondary }
                                ], children: "CARDHOLDER NAME" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: isActive ? colors.text.onPrimary : colors.text.primary }
                                ], children: cardholderName.toUpperCase() })] }), _jsxs(View, { style: { alignItems: 'flex-end' }, children: [_jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.styles.caption.weight,
                                        marginBottom: spacing.xs,
                                    },
                                    { color: isActive ? colors.text.onPrimary : colors.text.secondary }
                                ], children: "EXPIRES" }), _jsx(Text, { style: [
                                    {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.styles.label.weight,
                                    },
                                    { color: isActive ? colors.text.onPrimary : colors.text.primary }
                                ], children: expiryDate })] })] }), _jsxs(View, { style: { marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: isActive ? colors.text.onPrimary : colors.border.primary }, children: [_jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.styles.caption.weight,
                                marginBottom: spacing.xs,
                            },
                            { color: isActive ? colors.text.onPrimary : colors.text.secondary }
                        ], children: "AVAILABLE BALANCE" }), _jsx(Text, { style: [
                            {
                                fontFamily: typography.fonts.primary,
                                fontSize: typography.styles.h2.size,
                                fontWeight: typography.styles.h2.weight,
                            },
                            { color: isActive ? colors.text.onPrimary : colors.text.primary }
                        ], children: formatBalance(balance) })] })] }));
};
