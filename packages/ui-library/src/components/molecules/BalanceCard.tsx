import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { colors, typography, spacing } from '../../design/tokens';

export interface BalanceCardProps extends ViewProps {
  balance: string;
  currency?: string;
  onTopUpPress?: () => void;
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency = 'USD',
  onTopUpPress,
  className,
  ...props
}) => {
  return (
    <Card
      variant="default"
      padding="large"
      className={`${className || ''}`}
      {...props}
    >
      {/* Balance Section */}
      <View className="mb-6">
        <Text 
          className="font-label text-label text-text-secondary mb-1"
          style={{
            fontFamily: typography.fonts.secondary,
            fontSize: typography.styles.label.size,
            color: colors.text.secondary,
          }}
        >
          Portfolio Value
        </Text>
        
        <Text 
          className="font-bold text-h1 text-text-primary"
          style={{
            fontFamily: typography.fonts.primary,
            fontSize: typography.styles.h1.size,
            color: colors.text.primary,
          }}
        >
          ${balance} {currency}
        </Text>
      </View>

      {/* Top Up Button */}
      {onTopUpPress && (
        <Button
          title="Top Up"
          variant="accent"
          size="medium"
          onPress={onTopUpPress}
          fullWidth
        />
      )}
    </Card>
  );
};