import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { colors, typography } from '../../design/tokens';
export const SearchBar = ({ placeholder = 'Search...', value: controlledValue, onChangeText, onSearch, onClear, disabled = false, autoFocus = false, className, }) => {
    const [internalValue, setInternalValue] = useState('');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const handleChangeText = (text) => {
        if (!isControlled) {
            setInternalValue(text);
        }
        onChangeText?.(text);
    };
    const handleSearch = () => {
        onSearch?.(value);
    };
    const handleClear = () => {
        if (!isControlled) {
            setInternalValue('');
        }
        onClear?.();
        onChangeText?.('');
    };
    const handleSubmitEditing = () => {
        handleSearch();
    };
    return (_jsxs(View, { className: `
        flex-row items-center bg-[#F7F7F7] rounded-[12px] px-4 py-3
        ${disabled ? 'opacity-50' : ''}
        ${className || ''}
      `, children: [_jsx(View, { className: "mr-3", children: _jsx(Text, { className: "text-[#A0A0A0] text-base", children: "\uD83D\uDD0D" }) }), _jsx(TextInput, { value: value, onChangeText: handleChangeText, onSubmitEditing: handleSubmitEditing, placeholder: placeholder, placeholderTextColor: colors.text.tertiary, editable: !disabled, autoFocus: autoFocus, returnKeyType: "search", className: "flex-1 text-base text-[#000000] font-normal", style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.body.size,
                }, accessibilityLabel: "Search input", accessibilityHint: "Enter text to search" }), value.length > 0 && (_jsx(TouchableOpacity, { onPress: handleClear, className: "ml-3 p-1", accessibilityLabel: "Clear search", accessibilityRole: "button", children: _jsx(Text, { className: "text-[#A0A0A0] text-base", children: "\u2715" }) }))] }));
};
