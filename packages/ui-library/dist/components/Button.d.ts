import React from 'react';
import { TouchableOpacityProps } from 'react-native';
export interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'accent' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}
export declare const Button: React.FC<ButtonProps>;
