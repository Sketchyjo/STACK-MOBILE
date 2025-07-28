import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { colors } from '../../design/tokens';
export const Illustration = ({ type, size = 'medium', children, className, ...props }) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    width: 120,
                    height: 120,
                };
            case 'medium':
                return {
                    width: 200,
                    height: 200,
                };
            case 'large':
                return {
                    width: 280,
                    height: 280,
                };
            default:
                return {
                    width: 200,
                    height: 200,
                };
        }
    };
    const getIllustrationContent = () => {
        switch (type) {
            case 'welcome':
                return (_jsx(View, { testID: "illustration-welcome", className: "items-center justify-center rounded-full", style: {
                        backgroundColor: colors.surface.light,
                        ...getSizeStyles(),
                    }, children: _jsx(View, { className: "rounded-full", style: {
                            width: getSizeStyles().width * 0.6,
                            height: getSizeStyles().height * 0.6,
                            backgroundColor: colors.primary.royalBlue,
                        } }) }));
            case 'gift':
                return (_jsx(View, { testID: "illustration-gift", className: "items-center justify-center rounded-full", style: {
                        backgroundColor: colors.surface.light,
                        ...getSizeStyles(),
                    }, children: _jsx(View, { className: "rounded-lg", style: {
                            width: getSizeStyles().width * 0.5,
                            height: getSizeStyles().height * 0.5,
                            backgroundColor: colors.accent.limeGreen,
                        } }) }));
            case 'custom':
                return children;
            default:
                return (_jsx(View, { className: "items-center justify-center rounded-full", style: {
                        backgroundColor: colors.surface.light,
                        ...getSizeStyles(),
                    } }));
        }
    };
    return (_jsx(View, { className: `items-center justify-center ${className || ''}`, ...props, children: getIllustrationContent() }));
};
