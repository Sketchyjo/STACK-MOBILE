import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, typography } from '../../design/tokens';
import { Icon } from '../atoms';
export const Header = ({ title, subtitle, leftIcon, rightIcon, onLeftPress, onRightPress, showBackButton = false, backgroundColor = colors.background.main, className, }) => {
    return (_jsx(SafeAreaView, { style: { backgroundColor }, children: _jsxs(View, { className: `
          flex-row items-center justify-between px-4 py-3
          ${className || ''}
        `, style: { backgroundColor }, children: [_jsxs(View, { className: "flex-row items-center flex-1", children: [(leftIcon || showBackButton) && (_jsx(TouchableOpacity, { onPress: onLeftPress, className: "mr-3 p-2 -ml-2", accessibilityRole: "button", accessibilityLabel: showBackButton ? 'Go back' : 'Left action', children: leftIcon ||
                                (showBackButton && (_jsx(Icon, { library: "ionicons", name: "arrow-back", size: 24, color: colors.text.primary }))) })), _jsxs(View, { className: "flex-1", children: [_jsx(Text, { className: "text-[#000000] text-lg font-bold", style: {
                                        fontFamily: typography.fonts.primary,
                                        fontSize: typography.styles.h3.size,
                                        fontWeight: typography.weights.bold,
                                    }, numberOfLines: 1, children: title }), subtitle && (_jsx(Text, { className: "text-[#A0A0A0] text-sm", style: {
                                        fontFamily: typography.fonts.secondary,
                                        fontSize: typography.styles.label.size,
                                    }, numberOfLines: 1, children: subtitle }))] })] }), rightIcon && (_jsx(TouchableOpacity, { onPress: onRightPress, className: "p-2 -mr-2", accessibilityRole: "button", accessibilityLabel: "Right action", children: rightIcon }))] }) }));
};
