import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from './SafeIonicons';
// Country codes with flags and dial codes
const COUNTRY_CODES = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359' },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370' },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356' },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
];
export function PhoneNumberInput({ label, placeholder = "Enter phone number", value = '', onChangeText, onCountryChange, error, required = false, defaultCountry = 'US' }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    // Find default country or fallback to US
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES.find(country => country.code === defaultCountry) || COUNTRY_CODES[0]);
    const filteredCountries = COUNTRY_CODES.filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery));
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsModalVisible(false);
        setSearchQuery('');
        onCountryChange?.(country);
        // Update phone number with new country code if current value starts with old country code
        if (value.startsWith(selectedCountry.dialCode)) {
            const numberWithoutCode = value.substring(selectedCountry.dialCode.length);
            onChangeText(country.dialCode + numberWithoutCode);
        }
        else if (!value.startsWith('+')) {
            // If no country code present, add the new one
            onChangeText(country.dialCode + value);
        }
    };
    const handlePhoneNumberChange = (text) => {
        // Ensure the country code is always present
        if (!text.startsWith(selectedCountry.dialCode)) {
            // If user deleted the country code, add it back
            if (text.length < selectedCountry.dialCode.length) {
                onChangeText(selectedCountry.dialCode);
                return;
            }
            // If user is typing without country code, prepend it
            onChangeText(selectedCountry.dialCode + text);
        }
        else {
            onChangeText(text);
        }
    };
    const renderCountryItem = ({ item }) => (_jsxs(Pressable, { onPress: () => handleCountrySelect(item), className: "flex-row items-center px-4 py-3 border-b border-gray-100", children: [_jsx(Text, { className: "text-2xl mr-3", children: item.flag }), _jsxs(View, { className: "flex-1", children: [_jsx(Text, { className: "text-base text-text-primary font-heading-regular", children: item.name }), _jsx(Text, { className: "text-sm text-text-tertiary font-heading-regular", children: item.dialCode })] })] }));
    return (_jsxs(View, { className: "space-y-2", children: [label && (_jsxs(View, { className: "flex-row items-center", children: [_jsx(Text, { className: "text-sm font-heading-medium text-text-primary", children: label }), required && (_jsx(Text, { className: "text-sm text-red-500 ml-1", children: "*" }))] })), _jsxs(View, { className: `
        flex-row items-center border rounded-xl bg-white
        ${error ? 'border-red-500' : 'border-gray-300'}
      `, children: [_jsxs(Pressable, { onPress: () => setIsModalVisible(true), className: "flex-row items-center px-3 py-4 border-r border-gray-300", children: [_jsx(Text, { className: "text-lg mr-2", children: selectedCountry.flag }), _jsx(Text, { className: "text-base text-text-primary font-heading-regular mr-1", children: selectedCountry.dialCode }), _jsx(Ionicons, { name: "chevron-down", size: 16, color: "#A0A0A0" })] }), _jsx(TextInput, { value: value, onChangeText: handlePhoneNumberChange, placeholder: placeholder, placeholderTextColor: "#A0A0A0", keyboardType: "phone-pad", className: "flex-1 px-4 py-4 text-base font-heading-regular text-text-primary" })] }), error && (_jsx(Text, { className: "text-sm text-red-500 font-heading-regular", children: error })), _jsx(Modal, { visible: isModalVisible, animationType: "slide", presentationStyle: "pageSheet", children: _jsxs(View, { className: "flex-1 bg-white", children: [_jsxs(View, { className: "flex-row items-center justify-between px-4 py-4 border-b border-gray-200", children: [_jsx(Text, { className: "text-lg font-heading-bold text-text-primary", children: "Select Country Code" }), _jsx(Pressable, { onPress: () => setIsModalVisible(false), className: "p-2", children: _jsx(Ionicons, { name: "close", size: 24, color: "#000000" }) })] }), _jsx(View, { className: "px-4 py-3 border-b border-gray-200", children: _jsxs(View, { className: "flex-row items-center px-4 py-3 border border-gray-300 rounded-xl bg-gray-50", children: [_jsx(Ionicons, { name: "search", size: 20, color: "#A0A0A0" }), _jsx(TextInput, { value: searchQuery, onChangeText: setSearchQuery, placeholder: "Search countries or codes...", className: "flex-1 ml-3 text-base font-heading-regular text-text-primary", placeholderTextColor: "#A0A0A0" })] }) }), _jsx(FlatList, { data: filteredCountries, renderItem: renderCountryItem, keyExtractor: (item) => item.code, showsVerticalScrollIndicator: false, className: "flex-1" })] }) })] }));
}
