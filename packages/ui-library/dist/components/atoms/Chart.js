import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
import { colors, typography, spacing } from '../../design/tokens';
export const Chart = ({ data, type = 'line', height = 120, showLabels = false, showValues = false, title, className, testID, style, ...props }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    const renderLineChart = () => {
        const points = data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / range) * 80 + 10;
            return { x, y, ...point };
        });
        return (_jsxs(View, { style: { height, position: 'relative' }, children: [_jsxs(View, { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: colors.surface.card,
                        borderRadius: 8,
                    }, children: [[0, 25, 50, 75, 100].map(y => (_jsx(View, { style: {
                                position: 'absolute',
                                top: `${y}%`,
                                left: 0,
                                right: 0,
                                height: 1,
                                backgroundColor: colors.border.secondary,
                                opacity: 0.3,
                            } }, y))), points.map((point, index) => (_jsx(View, { style: {
                                position: 'absolute',
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: point.color || colors.accent.limeGreen,
                                transform: [{ translateX: -3 }, { translateY: -3 }],
                            } }, index)))] }), showLabels && (_jsx(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }, children: data.map((point, index) => (_jsx(Text, { style: [{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary }], children: point.label }, index))) }))] }));
    };
    const renderBarChart = () => {
        return (_jsx(View, { style: { height }, children: _jsx(View, { style: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs }, children: data.map((point, index) => {
                    const barHeight = ((point.value - minValue) / range) * 100;
                    return (_jsxs(View, { style: { flex: 1, alignItems: 'center' }, children: [_jsx(View, { style: {
                                    width: '100%',
                                    height: `${barHeight}%`,
                                    backgroundColor: point.color || colors.accent.limeGreen,
                                    borderRadius: 4,
                                    minHeight: 4,
                                } }), showValues && (_jsx(Text, { style: [{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary, marginTop: spacing.xs }], children: point.value })), showLabels && point.label && (_jsx(Text, { style: [{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary, marginTop: spacing.xs }], children: point.label }))] }, index));
                }) }) }));
    };
    const renderProgressChart = () => {
        const totalValue = data.reduce((sum, point) => sum + point.value, 0);
        let accumulatedValue = 0;
        return (_jsxs(View, { style: { height: Math.min(height, 40) }, children: [_jsx(View, { style: { flexDirection: 'row', height: '100%', borderRadius: 20, overflow: 'hidden' }, children: data.map((point, index) => {
                        const percentage = (point.value / totalValue) * 100;
                        accumulatedValue += point.value;
                        return (_jsx(View, { style: {
                                flex: percentage,
                                backgroundColor: point.color || colors.accent.limeGreen,
                                height: '100%',
                            } }, index));
                    }) }), showLabels && (_jsx(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }, children: data.map((point, index) => (_jsxs(Text, { style: [{ fontFamily: typography.fonts.secondary, fontSize: typography.styles.caption.size }, { color: colors.text.secondary }], children: [point.label, ": ", ((point.value / totalValue) * 100).toFixed(1), "%"] }, index))) }))] }));
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
    return (_jsxs(View, { style: [{ padding: spacing.md }, style], className: className, testID: testID, ...props, children: [title && (_jsx(Text, { style: [{ fontFamily: typography.fonts.primary, fontSize: typography.styles.h3.size, fontWeight: typography.styles.h3.weight }, { color: colors.text.primary, marginBottom: spacing.md }], children: title })), renderChart()] }));
};
