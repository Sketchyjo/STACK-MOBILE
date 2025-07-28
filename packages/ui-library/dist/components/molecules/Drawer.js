import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from '../atoms/Icon';
import { colors, typography, spacing, shadows } from '../../design/tokens';
const { width: screenWidth } = Dimensions.get('window');
export const Drawer = ({ isVisible, onClose, items, header, footer, width = screenWidth * 0.8, position = 'left', className, testID, }) => {
    const slideAnim = useRef(new Animated.Value(position === 'left' ? -width : width)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: position === 'left' ? -width : width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isVisible, slideAnim, overlayAnim, width, position]);
    if (!isVisible) {
        return null;
    }
    return (_jsxs(View, { className: `absolute inset-0 z-50 ${className || ''}`, testID: testID, children: [_jsx(TouchableWithoutFeedback, { onPress: onClose, children: _jsx(Animated.View, { className: "absolute inset-0", style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: overlayAnim,
                    } }) }), _jsx(Animated.View, { className: "absolute top-0 bottom-0", style: [
                    {
                        width,
                        backgroundColor: colors.surface.light,
                        transform: [{ translateX: slideAnim }],
                        ...shadows.md,
                    },
                    position === 'left' ? { left: 0 } : { right: 0 },
                ], children: _jsxs(SafeAreaView, { className: "flex-1", children: [header && (_jsx(View, { style: {
                                padding: spacing.lg,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border.secondary,
                            }, children: header })), _jsx(View, { className: "flex-row justify-end", style: {
                                padding: spacing.md,
                            }, children: _jsx(TouchableOpacity, { onPress: onClose, className: "p-2", accessibilityRole: "button", accessibilityLabel: "Close drawer", children: _jsx(Icon, { name: "close", library: "ionicons", size: 24, color: colors.text.secondary }) }) }), _jsx(ScrollView, { className: "flex-1", children: items.map((item) => (_jsxs(TouchableOpacity, { onPress: item.onPress, disabled: item.disabled, className: `flex-row items-center px-6 py-4 ${item.disabled ? 'opacity-50' : ''}`, accessibilityRole: "button", accessibilityLabel: item.label, children: [item.icon && (_jsx(View, { className: "mr-4", children: _jsx(Icon, { name: item.icon, library: item.iconLibrary || 'ionicons', size: 24, color: item.disabled ? colors.text.tertiary : colors.text.primary }) })), _jsx(Text, { className: "flex-1", style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: typography.styles.body.size,
                                            color: item.disabled ? colors.text.tertiary : colors.text.primary,
                                            fontWeight: '500',
                                        }, children: item.label }), item.badge && (_jsx(View, { className: "rounded-full px-2 py-1 ml-2", style: {
                                            backgroundColor: colors.accent.limeGreen,
                                            minWidth: 20,
                                            alignItems: 'center',
                                        }, children: _jsx(Text, { style: {
                                                fontFamily: typography.fonts.secondary,
                                                fontSize: 12,
                                                color: colors.text.onPrimary,
                                                fontWeight: '600',
                                            }, children: item.badge }) }))] }, item.id))) }), footer && (_jsx(View, { style: {
                                padding: spacing.lg,
                                borderTopWidth: 1,
                                borderTopColor: colors.border.secondary,
                            }, children: footer }))] }) })] }));
};
