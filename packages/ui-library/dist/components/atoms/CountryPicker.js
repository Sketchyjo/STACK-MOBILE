import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from './SafeIonicons';
// Common countries list with flags
const COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹' },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
];
export function CountryPicker({ label, placeholder = "Select your country", value, onSelect, error, required = false }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedCountry = COUNTRIES.find(country => country.name === value);
    const filteredCountries = COUNTRIES.filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleCountrySelect = (country) => {
        onSelect(country);
        setIsModalVisible(false);
        setSearchQuery('');
    };
    const renderCountryItem = ({ item }) => (_jsxs(Pressable, { onPress: () => handleCountrySelect(item), className: "flex-row items-center px-4 py-3 border-b border-gray-100", children: [_jsx(Text, { className: "text-2xl mr-3", children: item.flag }), _jsx(Text, { className: "text-base text-text-primary font-heading-regular flex-1", children: item.name })] }));
    return (_jsxs(View, { className: "space-y-2", children: [label && (_jsxs(View, { className: "flex-row items-center", children: [_jsx(Text, { className: "text-sm font-heading-medium text-text-primary", children: label }), required && (_jsx(Text, { className: "text-sm text-red-500 ml-1", children: "*" }))] })), _jsxs(Pressable, { onPress: () => setIsModalVisible(true), className: `
          flex-row items-center justify-between px-4 py-4 
          border rounded-xl bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${selectedCountry ? '' : ''}
        `, children: [_jsx(View, { className: "flex-row items-center flex-1", children: selectedCountry ? (_jsxs(_Fragment, { children: [_jsx(Text, { className: "text-2xl mr-3", children: selectedCountry.flag }), _jsx(Text, { className: "text-base text-text-primary font-heading-regular", children: selectedCountry.name })] })) : (_jsx(Text, { className: "text-base text-text-tertiary font-heading-regular", children: placeholder })) }), _jsx(Ionicons, { name: "chevron-down", size: 20, color: "#A0A0A0" })] }), error && (_jsx(Text, { className: "text-sm text-red-500 font-heading-regular", children: error })), _jsx(Modal, { visible: isModalVisible, animationType: "slide", presentationStyle: "pageSheet", children: _jsxs(View, { className: "flex-1 bg-white", children: [_jsxs(View, { className: "flex-row items-center justify-between px-4 py-4 border-b border-gray-200", children: [_jsx(Text, { className: "text-lg font-heading-bold text-text-primary", children: "Select Country" }), _jsx(Pressable, { onPress: () => setIsModalVisible(false), className: "p-2", children: _jsx(Ionicons, { name: "close", size: 24, color: "#000000" }) })] }), _jsx(View, { className: "px-4 py-3 border-b border-gray-200", children: _jsxs(View, { className: "flex-row items-center px-4 py-3 border border-gray-300 rounded-xl bg-gray-50", children: [_jsx(Ionicons, { name: "search", size: 20, color: "#A0A0A0" }), _jsx(TextInput, { value: searchQuery, onChangeText: setSearchQuery, placeholder: "Search countries...", className: "flex-1 ml-3 text-base font-heading-regular text-text-primary", placeholderTextColor: "#A0A0A0" })] }) }), _jsx(FlatList, { data: filteredCountries, renderItem: renderCountryItem, keyExtractor: (item) => item.code, showsVerticalScrollIndicator: false, className: "flex-1" })] }) })] }));
}
