import React from 'react';
import { View } from 'react-native';
import { TransactionList } from '../molecules/TransactionList';
import { Transaction, TransactionType, TransactionStatus } from '../molecules/TransactionItem';

// Example usage of Transaction components
export const TransactionExample: React.FC = () => {
  // Sample transaction data
  const sampleTransactions: Transaction[] = [
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

  const handleTransactionPress = (transaction: Transaction) => {
    console.log('Transaction pressed:', transaction.id);
    // Handle navigation to transaction details
  };

  return (
    <View className="flex-1 bg-background-primary p-4">
      {/* Recent Transactions List */}
      <TransactionList
        transactions={sampleTransactions}
        title="Recent Transactions"
        onTransactionPress={handleTransactionPress}
        className="mb-6"
      />

      {/* Transaction History (All transactions) */}
      <TransactionList
        transactions={sampleTransactions}
        title="Transaction History"
        onTransactionPress={handleTransactionPress}
      />

      {/* Empty State Example */}
      <TransactionList
        transactions={[]}
        title="Investment Transactions"
        emptyStateMessage="Start investing to see your transactions here"
        className="mt-6"
      />
    </View>
  );
};

export default TransactionExample;