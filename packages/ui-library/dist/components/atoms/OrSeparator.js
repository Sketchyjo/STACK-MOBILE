import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from 'react-native';
export const OrSeparator = ({ text = 'OR' }) => {
    return (_jsxs(View, { className: "flex-row items-center my-6", children: [_jsx(View, { className: "flex-1 h-px bg-text-tertiary" }), _jsx(Text, { className: "font-caption text-caption text-text-tertiary mx-4", children: text }), _jsx(View, { className: "flex-1 h-px bg-text-tertiary" })] }));
};
