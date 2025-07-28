import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, typography } from '../../design/tokens';
export const NavigationBar = ({ tabs, activeTabId, backgroundColor = colors.background.main, className, }) => {
    return (_jsx(SafeAreaView, { style: { backgroundColor }, children: _jsx(View, { className: `
          flex-row items-center justify-around py-2 px-4
          border-t border-[#F7F7F7]
          ${className || ''}
        `, style: { backgroundColor }, children: tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (_jsxs(TouchableOpacity, { onPress: tab.onPress, className: "flex-1 items-center py-2", accessibilityRole: "tab", accessibilityState: { selected: isActive }, accessibilityLabel: tab.label, children: [_jsxs(View, { className: "relative mb-1", children: [tab.icon && (_jsx(View, { className: isActive ? 'opacity-100' : 'opacity-60', children: tab.icon })), tab.badge && (_jsx(View, { className: "absolute -top-1 -right-1 bg-[#DC3545] rounded-full min-w-[16px] h-4 items-center justify-center px-1", children: _jsx(Text, { className: "text-white text-xs font-medium", style: {
                                            fontFamily: typography.fonts.secondary,
                                            fontSize: 10,
                                            fontWeight: typography.weights.medium,
                                        }, children: typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge }) }))] }), _jsx(Text, { className: `text-xs font-medium ${isActive ? 'text-[#5852FF]' : 'text-[#A0A0A0]'}`, style: {
                                fontFamily: typography.fonts.secondary,
                                fontSize: 10,
                                fontWeight: typography.weights.medium,
                            }, numberOfLines: 1, children: tab.label })] }, tab.id));
            }) }) }));
};
