import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../atoms/Card';
import { ProgressBar } from '../atoms/ProgressBar';
import { Icon } from '../atoms/Icon';
import { colors, typography, spacing } from '../../design/tokens';
export const QuestProgress = ({ title, description, progress, totalSteps, currentStep, reward, difficulty = 'medium', timeRemaining, onPress, className, testID, }) => {
    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'easy':
                return colors.semantic.success;
            case 'hard':
                return colors.semantic.danger;
            default:
                return colors.semantic.warning;
        }
    };
    const getDifficultyIcon = () => {
        switch (difficulty) {
            case 'easy':
                return 'star';
            case 'hard':
                return 'flame';
            default:
                return 'trophy';
        }
    };
    return (_jsx(TouchableOpacity, { onPress: onPress, disabled: !onPress, testID: testID, accessibilityRole: onPress ? 'button' : undefined, accessibilityLabel: `Quest: ${title}, ${progress}% complete`, children: _jsxs(Card, { className: `p-4 ${className || ''}`, children: [_jsxs(View, { className: "flex-row items-start justify-between mb-3", children: [_jsxs(View, { className: "flex-1 mr-3", children: [_jsx(Text, { style: {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.h3.size,
                                        fontWeight: typography.weights.bold,
                                        color: colors.text.primary,
                                        marginBottom: spacing.xs,
                                    }, children: title }), _jsx(Text, { style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.body.size,
                                        color: colors.text.secondary,
                                        lineHeight: typography.lineHeights.normal * typography.styles.body.size,
                                    }, children: description })] }), _jsxs(View, { className: "flex-row items-center px-2 py-1 rounded-full", style: {
                                backgroundColor: getDifficultyColor(),
                            }, children: [_jsx(Icon, { name: getDifficultyIcon(), library: "ionicons", size: 12, color: colors.text.onPrimary }), _jsx(Text, { className: "ml-1", style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: 10,
                                        fontWeight: typography.weights.semibold,
                                        color: colors.text.onPrimary,
                                        textTransform: 'uppercase',
                                    }, children: difficulty })] })] }), _jsxs(View, { className: "mb-3", children: [_jsxs(View, { className: "flex-row items-center justify-between mb-2", children: [_jsxs(Text, { style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.weights.medium,
                                        color: colors.text.primary,
                                    }, children: ["Progress: ", currentStep, "/", totalSteps] }), _jsxs(Text, { style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                        fontWeight: typography.weights.semibold,
                                        color: colors.primary.royalBlue,
                                    }, children: [progress, "%"] })] }), _jsx(ProgressBar, { progress: progress, height: 8, progressColor: colors.primary.royalBlue, backgroundColor: colors.surface.card })] }), _jsxs(View, { className: "flex-row items-center justify-between", children: [reward && (_jsxs(View, { className: "flex-row items-center", children: [_jsx(Icon, { name: "gift", library: "ionicons", size: 16, color: colors.accent.limeGreen }), _jsx(Text, { className: "ml-1", style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        fontWeight: typography.weights.medium,
                                        color: colors.text.secondary,
                                    }, children: reward })] })), timeRemaining && (_jsxs(View, { className: "flex-row items-center", children: [_jsx(Icon, { name: "time", library: "ionicons", size: 16, color: colors.text.tertiary }), _jsx(Text, { className: "ml-1", style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.caption.size,
                                        color: colors.text.tertiary,
                                    }, children: timeRemaining })] }))] })] }) }));
};
