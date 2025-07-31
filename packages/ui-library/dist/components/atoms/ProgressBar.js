import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { colors, borderRadius } from '../../design/tokens';
export const ProgressBar = ({ progress, height = 8, backgroundColor = colors.surface.light, // #EAE2FF from design.json
progressColor = colors.primary.royalBlue, // #5852FF from design.json
className, style, color, ...props }) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const containerStyle = {
        height,
        backgroundColor,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    };
    const progressStyle = {
        height: '100%',
        width: `${clampedProgress}%`,
        backgroundColor: progressColor,
        borderRadius: borderRadius.full,
    };
    const combinedStyle = [containerStyle, style];
    return (_jsx(View, { className: className, style: combinedStyle, testID: "progress-bar", accessibilityRole: "progressbar", accessibilityValue: {
            min: 0,
            max: 100,
            now: clampedProgress,
            text: `${clampedProgress}% complete`
        }, ...props, children: _jsx(View, { style: progressStyle }) }));
};
