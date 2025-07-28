import React from 'react';
import { render } from '@testing-library/react-native';
import { FinancialDashboard } from '../../src/components/organisms/FinancialDashboard';

describe('FinancialDashboard', () => {
  const mockMetrics = [
    {
      id: '1',
      label: 'Portfolio Value',
      value: '$12,345.67',
      change: 5.2,
      trend: 'up' as const,
      icon: 'trending-up',
    },
    {
      id: '2',
      label: 'Daily P&L',
      value: '+$234.56',
      change: 2.1,
      trend: 'up' as const,
      icon: 'arrow-up',
    },
    {
      id: '3',
      label: 'Cash Balance',
      value: '$1,234.56',
      change: -1.5,
      trend: 'down' as const,
      icon: 'wallet',
    },
  ];

  const defaultProps = {
    totalBalance: '$12,345.67',
    totalGains: '+$2,345.67',
    totalGainsPercentage: 23.4,
    metrics: mockMetrics,
  };

  it('renders without crashing', () => {
    const component = render(<FinancialDashboard {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('renders component structure', () => {
    const component = render(<FinancialDashboard {...defaultProps} />);
    expect(component.unmount).toBeDefined();
  });
});