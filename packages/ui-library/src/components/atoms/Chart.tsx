import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { colors, typography, spacing } from '../../design/tokens';

export interface ChartDataPoint {
  value: number;
  label?: string;
  color?: string;
}

export interface ChartProps extends ViewProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'progress';
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  title?: string;
  className?: string;
  testID?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'line',
  height = 120,
  showLabels = false,
  showValues = false,
  title,
  className,
  testID,
  style,
  ...props
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((maxValue - point.value) / range) * 80 + 10;
      return { x, y, ...point };
    });

    return (
      <View style={{ height, position: 'relative' }}>
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surface.card,
            borderRadius: 8,
          }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <View
              key={y}
              style={{
                position: 'absolute',
                top: `${y}%`,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: colors.border.secondary,
                opacity: 0.3,
              }}
            />
          ))}
          
          {/* Data visualization */}
          {points.map((point, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: point.color || colors.accent.limeGreen,
                transform: [{ translateX: -3 }, { translateY: -3 }],
              }}
            />
          ))}
        </View>
        
        {showLabels && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
            {data.map((point, index) => (
              <Text
                key={index}
                style={[{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary }]}
              >
                {point.label}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderBarChart = () => {
    return (
      <View style={{ height }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs }}>
          {data.map((point, index) => {
            const barHeight = ((point.value - minValue) / range) * 100;
            return (
              <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: '100%',
                    height: `${barHeight}%`,
                    backgroundColor: point.color || colors.accent.limeGreen,
                    borderRadius: 4,
                    minHeight: 4,
                  }}
                />
                {showValues && (
                  <Text style={[{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary, marginTop: spacing.xs }]}>
                    {point.value}
                  </Text>
                )}
                {showLabels && point.label && (
                  <Text style={[{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary, marginTop: spacing.xs }]}>
                    {point.label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderProgressChart = () => {
    const totalValue = data.reduce((sum, point) => sum + point.value, 0);
    let accumulatedValue = 0;

    return (
      <View style={{ height: Math.min(height, 40) }}>
        <View style={{ flexDirection: 'row', height: '100%', borderRadius: 20, overflow: 'hidden' }}>
          {data.map((point, index) => {
            const percentage = (point.value / totalValue) * 100;
            accumulatedValue += point.value;
            
            return (
              <View
                key={index}
                style={{
                  flex: percentage,
                  backgroundColor: point.color || colors.accent.limeGreen,
                  height: '100%',
                }}
              />
            );
          })}
        </View>
        
        {showLabels && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
            {data.map((point, index) => (
              <Text
                key={index}
                style={[{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary }]}
              >
                {point.label}: {((point.value / totalValue) * 100).toFixed(1)}%
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'progress':
        return renderProgressChart();
      case 'line':
      default:
        return renderLineChart();
    }
  };

  return (
    <View 
      style={[{ padding: spacing.md }, style]}
      className={className}
      testID={testID}
      {...props}
    >
      {title && (
        <Text style={[{ fontFamily: typography.fonts.primary, fontSize: typography.styles.h3.size, fontWeight: typography.styles.h3.weight }, { color: colors.text.primary, marginBottom: spacing.md }]}>
          {title}
        </Text>
      )}
      {renderChart()}
    </View>
  );
};