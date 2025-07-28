import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Modal as RNModal, TouchableOpacity, Text } from 'react-native';
import { colors, borderRadius } from '../../design/tokens';
export const Modal = ({ isVisible, onClose, children, showCloseButton = true, closeOnBackdrop = true, className, style, }) => {
    const backdropStyle = {
        flex: 1,
        backgroundColor: colors.overlay, // rgba(0, 0, 0, 0.5)
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    };
    const modalContentStyle = {
        backgroundColor: colors.background.main, // #FFFFFF
        borderRadius: borderRadius.modal, // 24px from design.json
        padding: 20,
        maxWidth: '90%',
        maxHeight: '80%',
    };
    const closeButtonStyle = {
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 8,
    };
    const closeButtonTextStyle = {
        fontSize: 18,
        color: colors.text.secondary,
        fontWeight: 'bold',
    };
    const combinedModalStyle = [modalContentStyle, style];
    const handleBackdropPress = () => {
        if (closeOnBackdrop) {
            onClose();
        }
    };
    return (_jsx(RNModal, { visible: isVisible, transparent: true, animationType: "fade", onRequestClose: onClose, children: _jsx(TouchableOpacity, { style: backdropStyle, activeOpacity: 1, onPress: handleBackdropPress, children: _jsx(TouchableOpacity, { activeOpacity: 1, onPress: (e) => e.stopPropagation(), children: _jsxs(View, { className: className, style: combinedModalStyle, children: [showCloseButton && (_jsx(TouchableOpacity, { style: closeButtonStyle, onPress: onClose, accessibilityLabel: "Close modal", accessibilityRole: "button", children: _jsx(Text, { style: closeButtonTextStyle, children: "\u00D7" }) })), children] }) }) }) }));
};
