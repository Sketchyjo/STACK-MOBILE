import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, FlatList } from 'react-native';
import { TransactionItem } from './TransactionItem';
import { colors, typography, spacing } from '@stack/ui-library';
import { Icon } from '@stack/ui-library';
export const TransactionList = ({ transactions, title, onTransactionPress, emptyStateMessage = 'You have no transactions yet.', style, ...props }) => {
    const renderItem = ({ item }) => (_jsx(TransactionItem, { transaction: item, onPress: () => onTransactionPress?.(item) }));
    const renderEmptyState = () => (_jsxs(View, { style: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.xxl,
        }, children: [_jsx(Icon, { name: "file-tray-outline", size: 48, color: colors.text.tertiary }), _jsx(Text, { style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: 16,
                    color: colors.text.secondary,
                    marginTop: spacing.md,
                    textAlign: 'center',
                }, children: emptyStateMessage })] }));
    return (_jsxs(View, { style: style, ...props, children: [title && (_jsx(Text, { style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: 22,
                    fontWeight: typography.weights.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.md,
                }, children: title })), _jsx(FlatList, { data: transactions, renderItem: renderItem, keyExtractor: item => item.id, ListEmptyComponent: renderEmptyState, scrollEnabled: false, ItemSeparatorComponent: () => _jsx(View, { style: { height: spacing.sm } }), contentContainerStyle: { paddingVertical: spacing.sm } })] }));
};
