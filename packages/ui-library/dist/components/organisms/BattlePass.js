import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../atoms/Card';
import { ProgressBar } from '../atoms/ProgressBar';
import { Icon } from '../atoms/Icon';
import { colors, typography, spacing } from '../../design/tokens';
export const BattlePass = ({ currentLevel, currentXP, xpToNextLevel, totalXP, tiers, hasPremium = false, onTierPress, onUpgradePress, className, testID, }) => {
    const progressPercentage = totalXP > 0 ? (currentXP / totalXP) * 100 : 0;
    const renderTier = (tier) => {
        const isActive = tier.level === currentLevel;
        const canClaim = tier.isUnlocked && !tier.isClaimed;
        return (_jsxs(TouchableOpacity, { onPress: () => onTierPress?.(tier), disabled: !onTierPress, className: "items-center mx-2", accessibilityRole: onTierPress ? 'button' : undefined, accessibilityLabel: `Tier ${tier.level}, ${tier.reward}, ${tier.isClaimed ? 'claimed' : tier.isUnlocked ? 'available' : 'locked'}`, children: [_jsxs(View, { className: "relative items-center justify-center w-16 h-16 rounded-full mb-2", style: {
                        backgroundColor: tier.isUnlocked
                            ? tier.isPremium
                                ? colors.accent.limeGreen
                                : colors.primary.royalBlue
                            : colors.surface.card,
                        borderWidth: isActive ? 3 : 1,
                        borderColor: isActive
                            ? colors.primary.royalBlue
                            : tier.isUnlocked
                                ? colors.border.primary
                                : colors.border.secondary,
                    }, children: [tier.isClaimed && (_jsx(View, { className: "absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center", style: { backgroundColor: colors.semantic.success }, children: _jsx(Icon, { name: "checkmark", library: "ionicons", size: 12, color: colors.text.onPrimary }) })), canClaim && (_jsx(View, { className: "absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center animate-pulse", style: { backgroundColor: colors.accent.limeGreen }, children: _jsx(Icon, { name: "gift", library: "ionicons", size: 12, color: colors.text.onPrimary }) })), _jsx(Icon, { name: tier.icon || (tier.isPremium ? 'diamond' : 'trophy'), library: "ionicons", size: 24, color: tier.isUnlocked ? colors.text.onPrimary : colors.text.tertiary })] }), _jsx(Text, { style: {
                        fontFamily: typography.fonts.secondary,
                        fontSize: 10,
                        fontWeight: typography.weights.bold,
                        color: isActive ? colors.primary.royalBlue : colors.text.secondary,
                        textAlign: 'center',
                    }, children: tier.level }), _jsx(Text, { style: {
                        fontFamily: typography.fonts.secondary,
                        fontSize: typography.styles.caption.size,
                        color: colors.text.tertiary,
                        textAlign: 'center',
                        marginTop: spacing.xs,
                    }, numberOfLines: 2, children: tier.reward }), tier.isPremium && !hasPremium && (_jsx(View, { className: "absolute top-0 left-0 right-0 bottom-0 rounded-full items-center justify-center", style: {
                        backgroundColor: colors.overlay,
                    }, children: _jsx(Icon, { name: "lock-closed", library: "ionicons", size: 16, color: colors.text.onPrimary }) }))] }, tier.id));
    };
    return (_jsxs(Card, { className: `p-4 ${className || ''}`, testID: testID, children: [_jsxs(View, { className: "flex-row items-center justify-between mb-4", children: [_jsxs(View, { children: [_jsx(Text, { style: {
                                    fontFamily: typography.fonts.primary,
                                    fontSize: typography.styles.h3.size,
                                    fontWeight: typography.weights.bold,
                                    color: colors.text.primary,
                                }, children: "Battle Pass" }), _jsxs(Text, { style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.body.size,
                                    color: colors.text.secondary,
                                }, children: ["Level ", currentLevel] })] }), !hasPremium && onUpgradePress && (_jsx(TouchableOpacity, { onPress: onUpgradePress, className: "px-4 py-2 rounded-full", style: { backgroundColor: colors.accent.limeGreen }, accessibilityRole: "button", accessibilityLabel: "Upgrade to premium battle pass", children: _jsx(Text, { style: {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.label.size,
                                fontWeight: typography.weights.semibold,
                                color: colors.text.onPrimary,
                            }, children: "Upgrade" }) })), hasPremium && (_jsx(View, { className: "px-3 py-1 rounded-full", style: { backgroundColor: colors.accent.limeGreen }, children: _jsx(Text, { style: {
                                fontFamily: typography.fonts.secondary,
                                fontSize: typography.styles.caption.size,
                                fontWeight: typography.weights.semibold,
                                color: colors.text.onPrimary,
                            }, children: "PREMIUM" }) }))] }), _jsxs(View, { className: "mb-4", children: [_jsxs(View, { className: "flex-row items-center justify-between mb-2", children: [_jsxs(Text, { style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.label.size,
                                    fontWeight: typography.weights.medium,
                                    color: colors.text.primary,
                                }, children: [currentXP.toLocaleString(), " / ", xpToNextLevel.toLocaleString(), " XP"] }), _jsxs(Text, { style: {
                                    fontFamily: typography.fonts.secondary,
                                    fontSize: typography.styles.label.size,
                                    fontWeight: typography.weights.semibold,
                                    color: colors.primary.royalBlue,
                                }, children: [Math.round(progressPercentage), "%"] })] }), _jsx(ProgressBar, { progress: progressPercentage, height: 8, progressColor: colors.primary.royalBlue, backgroundColor: colors.surface.card })] }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, className: "flex-row", contentContainerStyle: { paddingHorizontal: spacing.sm }, children: tiers.map(renderTier) })] }));
};
