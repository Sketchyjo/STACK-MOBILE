import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { colors, typography, spacing, shadows, animations, } from '../../design/tokens';
export const VirtualCreditCard = ({ cardTitle, cardNumber, cardholderName, expiryDate, cvc, cardType = 'visa', balance = 0, currency = 'USD', card, }) => {
    // Use card object values as fallbacks if direct props aren't provided
    const resolvedCardType = cardType || card?.cardType || 'visa';
    const resolvedCardNumber = cardNumber || card?.cardNumber || '';
    const resolvedBalance = balance || card?.balance || 0;
    const resolvedCurrency = currency || card?.currency || 'USD';
    const [isFlipped, setIsFlipped] = useState(false);
    const rotationAnim = useRef(new Animated.Value(0)).current;
    const formatCardNumber = (num) => {
        if (!num)
            return '';
        return `**** **** **** ${num.slice(-4)}`;
    };
    const formatBalance = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: resolvedCurrency,
        }).format(amount);
    };
    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };
    const backAnimatedStyle = {
        transform: [
            {
                rotateY: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
    };
    const flipCard = () => {
        Animated.timing(rotationAnim, {
            toValue: isFlipped ? 0 : 1,
            duration: animations.normal,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };
    return (_jsx(TouchableOpacity, { onPress: flipCard, activeOpacity: 0.9, children: _jsxs(View, { style: { height: 230, width: '100%' }, children: [_jsx(Animated.View, { style: [
                        shadows.lg,
                        {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                        },
                        frontAnimatedStyle,
                    ], children: _jsxs(Card, { padding: "medium", style: {
                            height: '100%',
                            backgroundColor: colors.accent.limeGreen,
                            justifyContent: 'space-between',
                        }, children: [_jsxs(View, { style: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }, children: [_jsx(Text, { style: [
                                            {
                                                fontFamily: typography.fonts.secondary,
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: colors.text.onAccent,
                                            },
                                        ], children: cardTitle || 'Virtual Card' }), _jsx(Icon, { name: resolvedCardType === 'visa' ? 'cc-visa' : 'cc-mastercard', library: "fontawesome", size: 28, color: colors.text.onAccent })] }), _jsxs(View, { children: [_jsx(Text, { style: [
                                            {
                                                fontSize: typography.styles.body.size,
                                                color: colors.text.onAccent,
                                                letterSpacing: 2,
                                                marginBottom: spacing.md,
                                                fontFamily: 'monospace',
                                            },
                                        ], children: formatCardNumber(resolvedCardNumber) }), _jsx(View, { style: {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }, children: _jsx(Text, { style: [
                                                {
                                                    fontFamily: typography.fonts.primary,
                                                    fontSize: typography.styles.caption.size,
                                                    color: colors.text.onAccent,
                                                },
                                            ], children: cardholderName || '' }) })] }), _jsxs(View, { children: [_jsx(Text, { style: [
                                            {
                                                fontFamily: typography.fonts.primary,
                                                fontSize: typography.styles.caption.size,
                                                color: colors.text.secondary,
                                            },
                                        ], children: "Balance" }), _jsx(Text, { style: [
                                            {
                                                fontFamily: typography.fonts.secondary,
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: colors.text.onAccent,
                                            },
                                        ], children: formatBalance(resolvedBalance) })] })] }) }), _jsx(Animated.View, { style: [
                        shadows.lg,
                        {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                        },
                        backAnimatedStyle,
                    ], children: _jsxs(Card, { padding: "medium", style: {
                            height: '100%',
                            backgroundColor: colors.accent.limeGreen,
                            justifyContent: 'space-between',
                        }, children: [_jsxs(View, { children: [_jsx(View, { style: {
                                            backgroundColor: colors.text.onAccent,
                                            height: 50,
                                            marginTop: spacing.lg,
                                        } }), _jsx(View, { style: {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: spacing.md,
                                            backgroundColor: colors.text.onAccent,
                                            padding: spacing.sm,
                                            borderRadius: spacing.xs,
                                        }, children: _jsx(Text, { style: {
                                                flex: 1,
                                                textAlign: 'right',
                                                color: colors.text.onPrimary,
                                                fontFamily: 'monospace',
                                                fontSize: 16,
                                            }, children: cvc || '***' }) }), _jsx(Text, { style: {
                                            color: "black",
                                            fontSize: 12,
                                            marginTop: spacing.lg,
                                            alignSelf: 'flex-end',
                                        }, children: expiryDate ? `Expires: ${expiryDate}` : 'Expires: MM/YY' })] }), _jsx(Icon, { name: resolvedCardType === 'visa' ? 'cc-visa' : 'cc-mastercard', library: "fontawesome", size: 28, color: "black", style: { alignSelf: 'flex-end' } })] }) })] }) }));
};
