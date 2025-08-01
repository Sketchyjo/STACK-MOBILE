import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
import { LineChart, BarChart, PieChart, } from 'react-native-gifted-charts';
import { colors, typography, spacing } from '../../design/tokens';
export const Chart = ({ data, type = 'line', height = 120, showLabels = false, showValues = false, title, className, testID, style, color = colors.accent.limeGreen, animationDuration = 800, width = 120, areaColor = colors.accent.limeGreen, startFillColor = colors.accent.limeGreen, endFillColor = colors.accent.limeGreen, ...props }) => {
    const giftedData = data.map(point => ({
        value: point.value,
        label: '', // hide labels
        frontColor: point.color || color,
    }));
    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (_jsx(BarChart, { data: giftedData, barWidth: 20, frontColor: color, spacing: 20, isAnimated: true, animationDuration: animationDuration, height: height, yAxisThickness: 0, xAxisThickness: 0, hideRules: true, xAxisLabelTextStyle: { display: 'none' }, yAxisTextStyle: { display: 'none' } }));
            case 'pie':
                return (_jsx(PieChart, { data: giftedData, showText: false, radius: height / 2, innerRadius: height / 4, isAnimated: true, animationDuration: animationDuration }));
            case 'line':
            default:
                return (_jsx(LineChart
                // curved
                , { 
                    // curved
                    startFillColor: startFillColor || color, endFillColor: endFillColor || areaColor || '#FFFFFF', 
                    // curveType={CurveType.QUADRATIC}
                    data: giftedData, thickness: 3, color: color, hideDataPoints: !showValues, yAxisThickness: 0, xAxisThickness: 0, isAnimated: true, animationDuration: animationDuration, hideRules: true, hideYAxisText: true, height: height, width: width, adjustToWidth: !width, 
                    // areaChart
                    initialSpacing: 0, endSpacing: 0 }));
        }
    };
    return (_jsxs(View, { style: [{ height, width: width || '100%' }, style], className: className, testID: testID, ...props, children: [title && (_jsx(Text, { style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    fontWeight: typography.styles.h3.weight,
                    color: colors.text.primary,
                    marginBottom: spacing.md,
                }, children: title })), renderChart()] }));
};
