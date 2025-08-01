import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity, } from 'react-native';
import { colors, typography, spacing } from '@stack/ui-library';
import { Icon } from '@stack/ui-library';
// --- Helper Functions ---
const getTransactionDetails = (type) => {
    switch (type) {
        case 'DEBIT':
            return {
                iconName: 'arrow-up-right',
                iconColor: colors.semantic.danger,
                amountColor: colors.text.primary,
                sign: '-',
            };
        case 'CREDIT':
            return {
                iconName: 'arrow-down-left',
                iconColor: colors.semantic.success,
                amountColor: colors.semantic.success,
                sign: '+',
            };
        case 'SWAP':
            return {
                iconName: 'repeat',
                iconColor: colors.semantic.success,
                amountColor: colors.text.primary,
                sign: '',
            };
        default:
            return {
                iconName: 'help-circle',
                iconColor: colors.text.secondary,
                amountColor: colors.text.primary,
                sign: '',
            };
    }
};
/**
 * FIXED: Replaced `formatToParts` with a compatible method using `format()`
 * to avoid crashes on the React Native Hermes engine.
 */
const formatCurrency = (amount, currency = 'NGN', sign) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const formattedString = formatter.format(Math.abs(amount));
    // Extract symbol and number part. This is a robust way to handle various currency formats.
    const value = formattedString.replace(/[^0-9.,]/g, '');
    const symbol = formattedString.replace(/[0-9.,]/g, '').trim();
    // Custom placement for Nigerian Naira (₦) as seen in reference.
    if (currency === 'NGN') {
        return `${sign}${symbol}${value}`;
    }
    // Default format for others (e.g., USD)
    return `${sign}${symbol}${value}`;
};
const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
// --- Main Component ---
export const TransactionItem = ({ transaction, ...props }) => {
    const { iconName, iconColor, amountColor, sign } = getTransactionDetails(transaction.type);
    const formattedAmount = formatCurrency(transaction.amount, transaction.currency, sign);
    return (_jsxs(TouchableOpacity, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.sm,
        }, accessibilityLabel: `Transaction: ${transaction.title}, Amount: ${formattedAmount}`, ...props, children: [_jsx(View, { style: {
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: `${colors.semantic.success}1A`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing.md,
                }, children: _jsx(Icon, { library: "feather", name: iconName, size: 22, color: iconColor }) }), _jsxs(View, { style: { flex: 1, justifyContent: 'center' }, children: [_jsx(Text, { style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: 16,
                            fontWeight: typography.weights.medium,
                            color: colors.text.primary,
                        }, numberOfLines: 1, children: transaction.title }), _jsx(Text, { style: {
                            fontFamily: typography.fonts.secondary,
                            fontSize: 14,
                            color: colors.text.secondary,
                            marginTop: 2,
                        }, numberOfLines: 1, children: `${transaction.category} • ${formatDate(transaction.createdAt)}` })] }), _jsx(Text, { style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: 16,
                    fontWeight: typography.weights.medium,
                    color: amountColor,
                    marginLeft: spacing.sm,
                }, children: formattedAmount })] }));
};
