import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { ListItem } from '../molecules/ListItem';
import { SearchBar } from '../molecules/SearchBar';
import { colors, typography } from '../../design/tokens';
export const DataList = ({ data, searchable = false, searchPlaceholder = 'Search...', onSearch, emptyStateTitle = 'No items found', emptyStateSubtitle = 'Try adjusting your search or filters', emptyStateIcon, loading = false, onRefresh, refreshing = false, className, ...flatListProps }) => {
    const renderItem = ({ item, index }) => (_jsx(ListItem, { title: item.title, subtitle: item.subtitle, leftIcon: item.leftIcon, rightIcon: item.rightIcon, rightText: item.rightText, onPress: item.onPress, showDivider: index < data.length - 1 }));
    const renderEmptyState = () => (_jsxs(View, { className: "flex-1 items-center justify-center py-12 px-6", children: [emptyStateIcon && (_jsx(View, { className: "mb-4", children: emptyStateIcon })), _jsx(Text, { className: "text-[#000000] text-lg font-bold text-center mb-2", style: {
                    fontFamily: typography.fonts.primary,
                    fontSize: typography.styles.h3.size,
                    fontWeight: typography.weights.bold,
                }, children: emptyStateTitle }), _jsx(Text, { className: "text-[#A0A0A0] text-base text-center", style: {
                    fontFamily: typography.fonts.secondary,
                    fontSize: typography.styles.body.size,
                    lineHeight: typography.lineHeights.relaxed * typography.styles.body.size,
                }, children: emptyStateSubtitle })] }));
    const renderLoadingState = () => (_jsx(View, { className: "flex-1 items-center justify-center py-12", children: _jsx(Text, { className: "text-[#A0A0A0] text-base", style: {
                fontFamily: typography.fonts.secondary,
                fontSize: typography.styles.body.size,
            }, children: "Loading..." }) }));
    return (_jsxs(View, { className: `flex-1 ${className || ''}`, children: [searchable && (_jsx(View, { className: "px-4 py-3 bg-white", children: _jsx(SearchBar, { placeholder: searchPlaceholder, onSearch: onSearch }) })), loading ? (renderLoadingState()) : (_jsx(FlatList, { data: data, renderItem: renderItem, keyExtractor: (item) => item.id, ListEmptyComponent: renderEmptyState, refreshControl: onRefresh ? (_jsx(RefreshControl, { refreshing: refreshing, onRefresh: onRefresh, tintColor: colors.primary.royalBlue, colors: [colors.primary.royalBlue] })) : undefined, showsVerticalScrollIndicator: false, ...flatListProps }))] }));
};
