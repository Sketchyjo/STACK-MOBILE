import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../design/tokens';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'accent' | 'tertiary' | 'fab';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#5852FF] shadow-lg active:bg-[#5852FF]/90';
      case 'accent':
        return 'bg-[#B9FF4B] shadow-lg active:bg-[#B9FF4B]/90';
      case 'tertiary':
        return 'bg-transparent border border-[#A0A0A0] active:bg-[#F7F7F7]';
      case 'fab':
        return 'bg-[#B9FF4B] shadow-lg rounded-[28px] w-14 h-14 active:bg-[#B9FF4B]/90';
      default:
        return 'bg-[#5852FF] shadow-lg active:bg-[#5852FF]/90';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'accent':
        return 'text-black';
      case 'tertiary':
        return 'text-black';
      case 'fab':
        return 'text-black';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    if (variant === 'fab') return 'p-0'; // FAB has fixed size
    
    switch (size) {
      case 'small':
        return 'px-4 py-2';
      case 'medium':
        return 'px-6 py-4'; // 16px 24px as per design.json
      case 'large':
        return 'px-8 py-5';
      default:
        return 'px-6 py-4';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-xs'; // 12px
      case 'medium':
        return 'text-sm'; // 14px as per design.json label style
      case 'large':
        return 'text-base'; // 16px
      default:
        return 'text-sm';
    }
  };

  const isDisabled = disabled || loading;
  const isFab = variant === 'fab';

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${isFab ? 'rounded-[28px] items-center justify-center' : 'rounded-[12px] flex-row items-center justify-center'}
        ${fullWidth && !isFab ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className || ''}
      `}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={title}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'tertiary' ? colors.primary.royalBlue : colors.text.onPrimary} 
        />
      ) : (
        <>
          {icon && !isFab && <>{icon}</>}
          {isFab ? (
            icon || <Text className={`font-medium ${getTextStyles()}`}>+</Text>
          ) : (
            <Text className={`font-medium ${getTextStyles()} ${getTextSizeStyles()}`}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};