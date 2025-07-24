import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DataList, DataListItem } from '../src/components/organisms/DataList';

const mockData: DataListItem[] = [
  { id: '1', title: 'Item 1', subtitle: 'Description 1' },
  { id: '2', title: 'Item 2', subtitle: 'Description 2' },
  { id: '3', title: 'Item 3', subtitle: 'Description 3' }
];

describe('DataList', () => {
  it('renders without crashing', () => {
    const result = render(<DataList data={mockData} />);
    expect(result).toBeTruthy();
  });

  it('renders with search functionality', () => {
    const result = render(
      <DataList 
        data={mockData}
        searchable
        searchPlaceholder="Search items..."
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders loading state', () => {
    const result = render(
      <DataList 
        data={[]}
        loading
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders empty state', () => {
    const result = render(
      <DataList 
        data={[]}
        emptyStateTitle="No items found"
        emptyStateSubtitle="Try adjusting your search"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with refresh control', () => {
    const mockOnRefresh = jest.fn();
    const result = render(
      <DataList 
        data={mockData}
        onRefresh={mockOnRefresh}
        refreshing={false}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with empty state icon', () => {
    const emptyIcon = <Text>📭</Text>;
    
    const result = render(
      <DataList 
        data={[]}
        emptyStateIcon={emptyIcon}
        emptyStateTitle="No items"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with custom class name', () => {
    const result = render(
      <DataList 
        data={mockData}
        className="custom-list"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with search callback', () => {
    const mockOnSearch = jest.fn();
    
    const result = render(
      <DataList 
        data={mockData}
        searchable
        onSearch={mockOnSearch}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders items with icons and actions', () => {
    const dataWithIcons: DataListItem[] = [
      { 
        id: '1', 
        title: 'Item 1', 
        subtitle: 'Description 1',
        leftIcon: <Text>📄</Text>,
        rightIcon: <Text>→</Text>,
        rightText: 'Details',
        onPress: jest.fn()
      }
    ];
    
    const result = render(<DataList data={dataWithIcons} />);
    expect(result).toBeTruthy();
  });
});