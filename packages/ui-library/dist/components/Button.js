import { jsx as _jsx } from "react/jsx-runtime";
import { Text, TouchableOpacity } from 'react-native';
export const Button = ({ title, variant = 'primary', size = 'medium', className = '', ...props }) => {
    // Base classes with 12px corner radius as per design.json
    const baseClasses = 'rounded-xl items-center justify-center';
    // Variant classes matching design.json specifications exactly
    const variantClasses = {
        primary: 'bg-primary active:bg-primary/90', // royalBlue from design.json
        accent: 'bg-accent active:bg-accent/90', // limeGreen from design.json
        tertiary: 'bg-transparent border border-text-tertiary active:bg-surface-card', // tertiary with border
    };
    // Size classes with padding matching design.json (16px 24px for medium)
    const sizeClasses = {
        small: 'px-4 py-2', // 12px 16px
        medium: 'px-6 py-4', // 16px 24px as per design.json
        large: 'px-8 py-5', // 20px 32px
    };
    // Text variant classes matching design.json color specifications
    const textVariantClasses = {
        primary: 'text-text-on-primary font-medium', // onPrimary color
        accent: 'text-text-on-accent font-medium', // onAccent color
        tertiary: 'text-text-primary font-medium', // primary text color
    };
    // Text size classes matching design.json label typography (14px medium)
    const textSizeClasses = {
        small: 'text-xs', // 12px
        medium: 'text-sm', // 14px as per design.json label style
        large: 'text-base', // 16px
    };
    return (_jsx(TouchableOpacity, { className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, ...props, children: _jsx(Text, { className: `${textVariantClasses[variant]} ${textSizeClasses[size]}`, children: title }) }));
};
