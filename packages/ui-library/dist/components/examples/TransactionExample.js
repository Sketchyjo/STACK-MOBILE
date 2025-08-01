import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { TransactionList } from '../molecules/TransactionList';
// Example usage of Transaction components
export const TransactionExample = () => {
    // Sample transaction data
    const sampleTransactions = [
        {
            id: '1',
            title: 'Coffee Shop Purchase',
            category: 'Food & Drink',
            amount: 4.75,
            currency: 'USD',
            type: 'DEBIT',
            status: 'COMPLETED',
            createdAt: new Date('2024-01-15T10:30:00Z'),
        },
        {
            id: '2',
            title: 'Tech Basket Investment',
            category: 'Investment',
            amount: 250.0,
            currency: 'USD',
            type: 'DEBIT',
            status: 'COMPLETED',
            createdAt: new Date('2024-01-14T15:45:00Z'),
        },
        {
            id: '3',
            title: 'Bank Transfer',
            category: 'Deposit',
            amount: 1000.0,
            currency: 'USD',
            type: 'CREDIT',
            status: 'PENDING',
            createdAt: new Date('2024-01-13T09:15:00Z'),
        },
        {
            id: '4',
            title: 'Micro Loan Disbursement',
            category: 'Loan',
            amount: 500.0,
            currency: 'USD',
            type: 'CREDIT',
            status: 'COMPLETED',
            createdAt: new Date('2024-01-12T14:20:00Z'),
        },
        {
            id: '5',
            title: 'Round-up Investment',
            category: 'Investment',
            amount: 15.75,
            currency: 'USD',
            type: 'DEBIT',
            status: 'COMPLETED',
            createdAt: new Date('2024-01-11T18:30:00Z'),
        },
    ];
    const handleTransactionPress = (transaction) => {
        console.log('Transaction pressed:', transaction.id);
        // Handle navigation to transaction details
    };
    return (_jsxs(View, { className: "flex-1 bg-background-primary p-4", children: [_jsx(TransactionList, { transactions: sampleTransactions, title: "Recent Transactions", onTransactionPress: handleTransactionPress, className: "mb-6" }), _jsx(TransactionList, { transactions: sampleTransactions, title: "Transaction History", onTransactionPress: handleTransactionPress }), _jsx(TransactionList, { transactions: [], title: "Investment Transactions", emptyStateMessage: "Start investing to see your transactions here", className: "mt-6" })] }));
};
export default TransactionExample;
