import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity, useWindowDimensions, } from 'react-native';
import { Card } from '../atoms/Card';
import { colors, typography, spacing } from '../../design/tokens';
import { Chart } from '../atoms/Chart';
import { Icon } from '../atoms/Icon';
export const BalanceCard = ({ balance, currency = 'USD', onPress, className, chartData, performanceText, ...props }) => {
    const { width: screenWidth } = useWindowDimensions();
    // Calculate chart width to be the full width of the card, accounting for screen padding.
    const chartWidth = screenWidth - 28; // Screen width minus the horizontal margin of the card.
    return (_jsxs(Card, { variant: "default", padding: "none" // Remove default padding from the card
        , className: `${className || ''}`, ...props, style: {
            backgroundColor: colors.primary.royalBlue,
            overflow: 'hidden', // Add overflow hidden to contain the chart
        }, children: [_jsxs(View, { style: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }, children: [_jsx(View, { className: "mb-2", children: _jsx(Text, { style: {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.label.size,
                                color: colors.text.onPrimary,
                                textTransform: 'uppercase',
                            }, children: "Portfolio Value" }) }), _jsxs(View, { className: "mb-3", children: [_jsx(Text, { style: {
                                    fontSize: 28,
                                    color: colors.text.onPrimary,
                                    fontFamily: typography.fonts.primary,
                                    fontWeight: 'bold',
                                }, children: balance }), _jsxs(View, { className: "flex-row items-center gap-x-2 mt-1", children: [_jsx(Icon, { library: "feather", name: "eye", size: 16, color: colors.text.onPrimary }), _jsxs(Text, { className: "text-sm", style: {
                                            fontFamily: typography.fonts.secondary,
                                            color: colors.text.onPrimary,
                                        }, children: [currency, " Balance"] })] })] })] }), _jsx(Chart, { data: chartData, type: "line", height: 190, width: chartWidth, color: colors.accent.limeGreen, startFillColor: colors.primary.lavender, endFillColor: colors.primary.royalBlue }), _jsx(View, { style: {
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.lg,
                    paddingTop: spacing.sm,
                }, children: _jsxs(View, { className: "flex-row items-center justify-between mt-2", children: [_jsxs(View, { className: "flex-row items-center gap-x-1", children: [_jsx(Icon, { library: "feather", name: "trending-up", size: 14, color: colors.accent.limeGreen }), _jsx(Text, { className: "text-[14px]", style: {
                                        color: colors.accent.limeGreen,
                                        fontFamily: typography.fonts.secondary,
                                    }, children: performanceText })] }), _jsxs(TouchableOpacity, { onPress: onPress, className: "flex-row items-center gap-x-1", children: [_jsx(Text, { style: {
                                        color: colors.text.onPrimary,
                                        fontFamily: typography.fonts.secondary,
                                    }, className: "text-[14px]", children: "View Portfolio" }), _jsx(Icon, { library: "feather", name: "chevron-right", size: 14, color: colors.text.onPrimary })] })] }) })] }));
};
