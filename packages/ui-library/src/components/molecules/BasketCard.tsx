import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { PerformanceIndicator } from './PerformanceIndicator';
import { colors, typography, spacing } from '../../design/tokens';

export interface BasketCardProps extends Omit<TouchableOpacityProps, 'children'> {
  id: string;
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  iconUrl?: string;
  performanceIndicator?: {
    returnPercentage: number;
    totalInvested: number;
    currentValue: number;
  } | null;
  isCommunity?: boolean;
  onPress?: () => void;
  className?: string;
}

export const BasketCard: React.FC<BasketCardProps> = ({
  id,
  name,
  description,
  riskLevel,
  iconUrl,
  performanceIndicator,
  isCommunity = false,
  onPress,
  className,
  style,
  ...props
}) => {
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'low';
      case 'MEDIUM':
        return 'medium';
      case 'HIGH':
        return 'high';
      default:
        return 'default';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'Low Risk';
      case 'MEDIUM':
        return 'Medium Risk';
      case 'HIGH':
        return 'High Risk';
      default:
        return risk;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className={className}
      activeOpacity={0.7}
      {...props}
    >
      <Card variant="default" padding="large">
        {/* Header Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
          {/* Icon and Title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.sm }}>
            {/* Basket Icon */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.surface.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
              }}
            >
              <Icon
                name="basket-outline"
                library="ionicons"
                size={24}
                color={colors.primary.royalBlue}
              />
            </View>

            {/* Title and Community Badge */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                <Text
                  style={{
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    fontWeight: typography.weights.bold,
                    color: colors.text.primary,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {name}
                </Text>
                {isCommunity && (
                  <Icon
                    name="people-outline"
                    library="ionicons"
                    size={16}
                    color={colors.text.secondary}
                    style={{ marginLeft: spacing.xs }}
                  />
                )}
              </View>
              
              {/* Risk Level Badge */}
              <Badge
                variant={getRiskBadgeVariant(riskLevel)}
                size="small"
              >
                {getRiskLabel(riskLevel)}
              </Badge>
            </View>
          </View>

          {/* Performance Indicator */}
          {performanceIndicator && (
            <PerformanceIndicator
              returnPercentage={performanceIndicator.returnPercentage}
              size="medium"
            />
          )}
        </View>

        {/* Description */}
        <Text
          style={{
            fontFamily: typography.fonts.secondary,
            fontSize: typography.styles.body.size,
            color: colors.text.secondary,
            lineHeight: typography.styles.body.size * typography.lineHeights.normal,
            marginBottom: spacing.md,
          }}
          numberOfLines={2}
        >
          {description}
        </Text>

        {/* Footer Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Investment Summary */}
          {performanceIndicator ? (
            <View>
              <Text
                style={{
                  fontFamily: typography.fonts.secondary,
                  fontSize: typography.styles.caption.size,
                  color: colors.text.tertiary,
                }}
              >
                Current Value
              </Text>
              <Text
                style={{
                  fontFamily: typography.fonts.secondary,
                  fontSize: typography.styles.label.size,
                  fontWeight: typography.weights.medium,
                  color: colors.text.primary,
                }}
              >
                ${performanceIndicator.currentValue.toLocaleString()}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {/* Action Arrow */}
          <Icon
            name="chevron-forward-outline"
            library="ionicons"
            size={20}
            color={colors.text.tertiary}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};