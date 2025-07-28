import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from './SafeIonicons';
export const SocialLoginButton = ({ provider, onPress, disabled = false, }) => {
    const getProviderConfig = () => {
        switch (provider) {
            case 'google':
                return {
                    icon: 'logo-google',
                    text: 'Continue with Google',
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    borderColor: '#E5E5E5',
                };
            case 'apple':
                return {
                    icon: 'logo-apple',
                    text: 'Continue with Apple',
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    borderColor: '#000000',
                };
            case 'facebook':
                return {
                    icon: 'logo-facebook',
                    text: 'Continue with Facebook',
                    backgroundColor: '#1877F2',
                    textColor: '#FFFFFF',
                    borderColor: '#1877F2',
                };
            default:
                return {
                    icon: 'logo-google',
                    text: 'Continue',
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    borderColor: '#E5E5E5',
                };
        }
    };
    const config = getProviderConfig();
    return (_jsxs(TouchableOpacity, { testID: `social-login-${provider}`, onPress: onPress, disabled: disabled, className: `
        flex-row items-center justify-center
        px-6 py-4 rounded-xl
        border
        ${disabled ? 'opacity-50' : ''}
        mb-3
      `, style: {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
        }, children: [_jsx(Ionicons, { name: config.icon, size: 20, color: config.textColor, style: { marginRight: 12 } }), _jsx(Text, { className: "font-label text-label font-medium", style: { color: config.textColor }, children: config.text })] }));
};
export const SocialLoginButtons = ({ onGooglePress, onApplePress, onFacebookPress, disabled = false, }) => {
    return (_jsxs(View, { children: [onGooglePress && (_jsx(SocialLoginButton, { provider: "google", onPress: onGooglePress, disabled: disabled })), onApplePress && (_jsx(SocialLoginButton, { provider: "apple", onPress: onApplePress, disabled: disabled })), onFacebookPress && (_jsx(SocialLoginButton, { provider: "facebook", onPress: onFacebookPress, disabled: disabled }))] }));
};
