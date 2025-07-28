import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BattlePass } from '../../src/components/organisms/BattlePass';

describe('BattlePass', () => {
  const mockTiers = [
    {
      id: '1',
      level: 1,
      reward: '100 coins',
      isUnlocked: true,
      isClaimed: true,
      isPremium: false,
      icon: 'trophy',
    },
    {
      id: '2',
      level: 2,
      reward: '200 coins',
      isUnlocked: true,
      isClaimed: false,
      isPremium: false,
      icon: 'star',
    },
    {
      id: '3',
      level: 3,
      reward: 'Premium Badge',
      isUnlocked: false,
      isClaimed: false,
      isPremium: true,
      icon: 'diamond',
    },
    {
      id: '4',
      level: 4,
      reward: '500 coins',
      isUnlocked: false,
      isClaimed: false,
      isPremium: false,
      icon: 'trophy',
    },
  ];

  const defaultProps = {
    currentLevel: 2,
    currentXP: 1500,
    xpToNextLevel: 500,
    totalXP: 10000,
    tiers: mockTiers,
    hasPremium: false,
    onTierPress: jest.fn(),
    onUpgradePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const component = render(<BattlePass {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('renders with testID', () => {
    const component = render(<BattlePass {...defaultProps} testID="battle-pass" />);
    expect(component).toBeTruthy();
  });
});