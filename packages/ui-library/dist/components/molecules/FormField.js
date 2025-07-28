import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
import { InputField } from '../atoms/InputField';
import { typography } from '../../design/tokens';
export const FormField = ({ label, error, required = false, helperText, type = 'text', icon, className, ...inputProps }) => {
    const hasError = !!error;
    return (_jsxs(View, { className: `${className || ''}`, children: [_jsx(InputField, { label: label, error: error, required: required, type: type, icon: icon, ...inputProps }), helperText && !hasError && (_jsx(Text, { className: "text-[#A0A0A0] text-xs mt-1 -mb-4", style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.caption.size,
                }, children: helperText }))] }));
};
