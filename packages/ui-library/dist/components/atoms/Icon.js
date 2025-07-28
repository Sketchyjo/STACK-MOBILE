import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from './SafeIonicons';
import { colors } from '../../design/tokens';
// Safe import for other icon libraries
let MaterialIcons, FontAwesome, AntDesign, Entypo, Feather;
try {
    const vectorIcons = require('@expo/vector-icons');
    MaterialIcons = vectorIcons.MaterialIcons;
    FontAwesome = vectorIcons.FontAwesome;
    AntDesign = vectorIcons.AntDesign;
    Entypo = vectorIcons.Entypo;
    Feather = vectorIcons.Feather;
}
catch (error) {
    console.warn('Failed to load vector icons, using fallbacks:', error);
    // Fallback component for all icon libraries
    const FallbackIcon = ({ name, size = 24, color = '#000', style, ...props }) => {
        return React.createElement(Text, {
            style: [
                {
                    fontSize: size,
                    color,
                    fontFamily: 'System',
                },
                style,
            ],
            ...props,
        }, '●');
    };
    MaterialIcons = FallbackIcon;
    FontAwesome = FallbackIcon;
    AntDesign = FallbackIcon;
    Entypo = FallbackIcon;
    Feather = FallbackIcon;
}
const IconComponents = {
    ionicons: Ionicons,
    material: MaterialIcons,
    fontawesome: FontAwesome,
    antdesign: AntDesign,
    entypo: Entypo,
    feather: Feather,
};
export const Icon = ({ name, library = 'ionicons', size = 24, color = colors.text.primary, className, testID, style, ...props }) => {
    const IconComponent = IconComponents[library];
    return (_jsx(View, { style: [{ alignItems: 'center', justifyContent: 'center' }, style], className: className, testID: testID, ...props, children: _jsx(IconComponent, { name: name, size: size, color: color }) }));
};
