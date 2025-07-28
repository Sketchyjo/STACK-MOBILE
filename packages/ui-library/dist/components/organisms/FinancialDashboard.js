import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, ScrollView } from 'react-native';
import { Card } from '../atoms/Card';
import { Chart } from '../atoms/Chart';
import { Icon } from '../atoms/Icon';
import { colors, typography, spacing } from '../../design/tokens';
export const FinancialDashboard = ({ totalBalance, totalGains, totalGainsPercentage, metrics, chartData, className, testID, }) => {
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up':
                return colors.semantic.success;
            case 'down':
                return colors.semantic.danger;
            default:
                return colors.text.secondary;
        }
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return 'trending-up';
            case 'down':
                return 'trending-down';
            default:
                return 'remove';
        }
    };
    const renderMetric = (metric) => (_jsxs(Card, { className: "p-4 flex-1 mx-1", children: [_jsxs(View, { className: "flex-row items-center justify-between mb-2", children: [_jsx(Icon, { name: metric.icon, library: "ionicons", size: 24, color: colors.primary.royalBlue }), _jsx(Icon, { name: getTrendIcon(metric.trend), library: "ionicons", size: 16, color: getTrendColor(metric.trend) })] }), _jsx(Text, { style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.caption.size,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                }, children: metric.label }), _jsx(Text, { style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    fontWeight: typography.weights.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                }, children: metric.value }), _jsx(View, { className: "flex-row items-center", children: _jsxs(Text, { style: {
                        fontFamily: typography.fonts.secondary,
                        fontSize: typography.styles.caption.size,
                        fontWeight: typography.weights.medium,
                        color: getTrendColor(metric.trend),
                    }, children: [metric.change > 0 ? '+' : '', metric.change.toFixed(2), "%"] }) })] }, metric.id));
    return (_jsxs(ScrollView, { className: className, testID: testID, showsVerticalScrollIndicator: false, children: [_jsxs(Card, { className: "p-6 mb-4", children: [_jsx(Text, { style: {
                            fontFamily: typography.fonts.secondary,
                            fontSize: typography.styles.body.size,
                            color: colors.text.secondary,
                            marginBottom: spacing.sm,
                        }, children: "Total Portfolio Value" }), _jsx(Text, { style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: typography.styles.h1.size,
                            fontWeight: typography.weights.bold,
                            color: colors.text.primary,
                            marginBottom: spacing.sm,
                        }, children: totalBalance }), _jsxs(View, { className: "flex-row items-center", children: [_jsx(Icon, { name: totalGainsPercentage >= 0 ? 'trending-up' : 'trending-down', library: "ionicons", size: 16, color: totalGainsPercentage >= 0 ? colors.semantic.success : colors.semantic.danger }), _jsxs(Text, { className: "ml-1", style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.body.size,
                                    fontWeight: typography.weights.medium,
                                    color: totalGainsPercentage >= 0 ? colors.semantic.success : colors.semantic.danger,
                                }, children: [totalGains, " (", totalGainsPercentage >= 0 ? '+' : '', totalGainsPercentage.toFixed(2), "%)"] })] })] }), chartData && (_jsxs(Card, { className: "p-4 mb-4", children: [_jsx(Text, { style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: typography.styles.h3.size,
                            fontWeight: typography.weights.bold,
                            color: colors.text.primary,
                            marginBottom: spacing.md,
                        }, children: "Portfolio Performance" }), _jsx(Chart, { type: "line", data: chartData, height: 200, showLabels: true })] })), _jsxs(View, { className: "mb-4", children: [_jsx(Text, { style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: typography.styles.h3.size,
                            fontWeight: typography.weights.bold,
                            color: colors.text.primary,
                            marginBottom: spacing.md,
                        }, children: "Key Metrics" }), _jsx(View, { className: "flex-row flex-wrap -mx-1", children: metrics.map(renderMetric) })] }), _jsxs(Card, { className: "p-4", children: [_jsx(Text, { style: {
                            fontFamily: typography.fonts.primary,
                            fontSize: typography.styles.h3.size,
                            fontWeight: typography.weights.bold,
                            color: colors.text.primary,
                            marginBottom: spacing.md,
                        }, children: "Quick Actions" }), _jsxs(View, { className: "flex-row justify-around", children: [_jsxs(View, { className: "items-center", children: [_jsx(View, { className: "w-12 h-12 rounded-full items-center justify-center mb-2", style: { backgroundColor: colors.primary.royalBlue }, children: _jsx(Icon, { name: "add", library: "ionicons", size: 24, color: colors.text.onPrimary }) }), _jsx(Text, { style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.caption.size,
                                            color: colors.text.secondary,
                                            textAlign: 'center',
                                        }, children: "Power Up" })] }), _jsxs(View, { className: "items-center", children: [_jsx(View, { className: "w-12 h-12 rounded-full items-center justify-center mb-2", style: { backgroundColor: colors.accent.limeGreen }, children: _jsx(Icon, { name: "cash", library: "ionicons", size: 24, color: colors.text.onPrimary }) }), _jsx(Text, { style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.caption.size,
                                            color: colors.text.secondary,
                                            textAlign: 'center',
                                        }, children: "Cash Out" })] }), _jsxs(View, { className: "items-center", children: [_jsx(View, { className: "w-12 h-12 rounded-full items-center justify-center mb-2", style: { backgroundColor: colors.text.secondary }, children: _jsx(Icon, { name: "analytics", library: "ionicons", size: 24, color: colors.text.onPrimary }) }), _jsx(Text, { style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.caption.size,
                                            color: colors.text.secondary,
                                            textAlign: 'center',
                                        }, children: "Analytics" })] }), _jsxs(View, { className: "items-center", children: [_jsx(View, { className: "w-12 h-12 rounded-full items-center justify-center mb-2", style: { backgroundColor: colors.text.tertiary }, children: _jsx(Icon, { name: "settings", library: "ionicons", size: 24, color: colors.text.onPrimary }) }), _jsx(Text, { style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.caption.size,
                                            color: colors.text.secondary,
                                            textAlign: 'center',
                                        }, children: "Settings" })] })] })] })] }));
};
