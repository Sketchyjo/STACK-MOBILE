import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
const getTransactionIcon = (type) => {
    switch (type) {
        case 'CARD_PURCHASE':
            return '💳';
        case 'INVESTMENT':
            return '📈';
        case 'WITHDRAWAL':
            return '💸';
        case 'DEPOSIT':
            return '💰';
        case 'TRANSFER':
            return '🔄';
        case 'LOAN_DISBURSEMENT':
            return '🏦';
        case 'LOAN_REPAYMENT':
            return '💸';
        case 'REWARD':
            return '🎁';
        case 'REFUND':
            return '↩️';
        case 'FEE':
            return '📋';
        default:
            return '💱';
    }
};
const getTransactionTypeLabel = (type) => {
    switch (type) {
        case 'CARD_PURCHASE':
            return 'Card Purchase';
        case 'INVESTMENT':
            return 'Investment';
        case 'WITHDRAWAL':
            return 'Withdrawal';
        case 'DEPOSIT':
            return 'Deposit';
        case 'TRANSFER':
            return 'Transfer';
        case 'LOAN_DISBURSEMENT':
            return 'Loan Disbursement';
        case 'LOAN_REPAYMENT':
            return 'Loan Repayment';
        case 'REWARD':
            return 'Reward';
        case 'REFUND':
            return 'Refund';
        case 'FEE':
            return 'Fee';
        default:
            return 'Transaction';
    }
};
const getAmountColor = (type, status) => {
    if (status === 'FAILED' || status === 'REVERSED') {
        return 'text-gray-400';
    }
    switch (type) {
        case 'CARD_PURCHASE':
        case 'WITHDRAWAL':
        case 'FEE':
        case 'LOAN_REPAYMENT':
        case 'TRANSFER': // Outgoing transfer
            return 'text-red-400';
        case 'DEPOSIT':
        case 'INVESTMENT':
        case 'LOAN_DISBURSEMENT':
        case 'REWARD':
        case 'REFUND':
            return 'text-green-400';
        default:
            return 'text-white';
    }
};
const getStatusIndicator = (status) => {
    switch (status) {
        case 'PENDING':
            return { color: 'bg-yellow-500', label: 'Pending' };
        case 'PROCESSING':
            return { color: 'bg-blue-500', label: 'Processing' };
        case 'COMPLETED':
            return { color: 'bg-green-500', label: 'Completed' };
        case 'FAILED':
            return { color: 'bg-red-500', label: 'Failed' };
        case 'CANCELLED':
            return { color: 'bg-gray-500', label: 'Cancelled' };
        case 'REVERSED':
            return { color: 'bg-orange-500', label: 'Reversed' };
        default:
            return { color: 'bg-gray-500', label: 'Unknown' };
    }
};
const formatAmount = (amount, currency, type) => {
    // Format the absolute amount first
    const absAmount = Math.abs(amount);
    let formattedAmount;
    // Handle different currencies with specific formatting
    if (currency === 'USD') {
        formattedAmount = `$${absAmount.toFixed(2)}`;
    }
    else if (currency === 'EUR') {
        formattedAmount = `€${absAmount.toFixed(2)}`;
    }
    else {
        // Use Intl.NumberFormat for other currencies
        formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(absAmount);
    }
    // Add thousands separator for large amounts
    if (absAmount >= 1000) {
        const parts = absAmount.toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const decimalPart = parts[1];
        if (currency === 'USD') {
            formattedAmount = `$${integerPart}.${decimalPart}`;
        }
        else if (currency === 'EUR') {
            formattedAmount = `€${integerPart}.${decimalPart}`;
        }
    }
    // Add sign based on transaction type
    switch (type) {
        case 'CARD_PURCHASE':
        case 'WITHDRAWAL':
        case 'FEE':
        case 'LOAN_REPAYMENT':
        case 'TRANSFER': // Outgoing transfer
            return `-${formattedAmount}`;
        case 'DEPOSIT':
        case 'INVESTMENT':
        case 'LOAN_DISBURSEMENT':
        case 'REWARD':
        case 'REFUND':
            return `+${formattedAmount}`;
        default:
            return formattedAmount;
    }
};
const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    else if (diffInHours < 168) { // 7 days
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
};
export const TransactionItem = ({ transaction, onPress, showDate = true, compact = false, }) => {
    const statusInfo = getStatusIndicator(transaction.status);
    const amountColor = getAmountColor(transaction.type, transaction.status);
    const transactionDate = new Date(transaction.createdAt);
    const handlePress = () => {
        if (onPress) {
            onPress(transaction);
        }
    };
    const Component = onPress ? TouchableOpacity : View;
    return (_jsxs(Component, { onPress: onPress ? handlePress : undefined, className: `
        flex-row items-center justify-between p-4 
        bg-neutral-light rounded-lg mb-2
        ${onPress ? 'active:bg-neutral-light/80' : ''}
        ${compact ? 'py-3' : 'py-4'}
      `, accessibilityRole: onPress ? 'button' : 'text', accessibilityLabel: `${getTransactionTypeLabel(transaction.type)} transaction for ${formatAmount(Number(transaction.amount), transaction.currency, transaction.type)}`, children: [_jsxs(View, { className: "flex-row items-center flex-1", children: [_jsx(View, { className: "w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3", children: _jsx(Text, { className: "text-lg", children: getTransactionIcon(transaction.type) }) }), _jsxs(View, { className: "flex-1", children: [_jsxs(View, { className: "flex-row items-center", children: [_jsx(Text, { className: "text-white font-medium text-base mr-2", children: getTransactionTypeLabel(transaction.type) }), transaction.status !== 'COMPLETED' && (_jsx(View, { className: `w-2 h-2 rounded-full ${statusInfo.color}` }))] }), _jsx(Text, { className: "text-gray-400 text-sm mt-1", numberOfLines: 1, children: transaction.description }), showDate && !compact && (_jsx(Text, { className: "text-gray-500 text-xs mt-1", children: formatDate(transactionDate) }))] })] }), _jsxs(View, { className: "items-end", children: [_jsx(Text, { className: `font-bold text-base ${amountColor}`, children: formatAmount(Number(transaction.amount), transaction.currency, transaction.type) }), showDate && compact && (_jsx(Text, { className: "text-gray-500 text-xs mt-1", children: formatDate(transactionDate) })), transaction.status !== 'COMPLETED' && !compact && (_jsx(Text, { className: "text-gray-400 text-xs mt-1", children: statusInfo.label }))] })] }));
};
export default TransactionItem;
