import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, FlatList } from 'react-native';
import { TransactionItem } from './TransactionItem';
import { colors, typography } from '../../design/tokens';
export const TransactionList = ({ transactions, title = 'Recent Transactions', emptyMessage = 'No transactions yet', onTransactionPress, className, ...props }) => {
    const renderTransaction = ({ item }) => (_jsx(TransactionItem, { transaction: item, onPress: onTransactionPress ? () => onTransactionPress(item) : undefined }));
    const renderEmptyState = () => (_jsx(View, { className: "py-8 items-center", children: _jsx(Text, { className: "text-body text-text-secondary text-center", style: {
                fontFamily: typography.fonts.primary,
                fontSize: typography.styles.body.size,
                color: colors.text.secondary,
            }, children: emptyMessage }) }));
    return (_jsxs(View, { className: `${className || ''}`, ...props, children: [_jsx(Text, { className: "font-semibold text-h3 text-text-primary mb-4", style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    color: colors.text.primary,
                }, children: title }), _jsx(FlatList, { data: transactions, renderItem: renderTransaction, keyExtractor: (item) => item.id, ListEmptyComponent: renderEmptyState, showsVerticalScrollIndicator: false, scrollEnabled: false, ItemSeparatorComponent: () => (_jsx(View, { className: "h-px bg-border-tertiary mx-4", style: { backgroundColor: colors.border.tertiary } })) })] }));
};
