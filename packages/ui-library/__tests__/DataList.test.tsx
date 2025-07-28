import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { DataList, DataListItem } from '../src/components/organisms/DataList';

const mockData: DataListItem[] = [
  { id: '1', title: 'Item 1', subtitle: 'Description 1' },
  { id: '2', title: 'Item 2', subtitle: 'Description 2' },
  { id: '3', title: 'Item 3', subtitle: 'Description 3' }
];

describe('DataList', () => {
  it('renders without crashing', () => {
    render(<DataList data={mockData} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('renders with search functionality', () => {
    render(
      <DataList 
        data={mockData}
        searchable
        searchPlaceholder="Search items..."
      />
    );
    
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <DataList 
        data={[]}
        loading
      />
    );
    
    // Check for loading indicator or spinner
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <DataList 
        data={[]}
        emptyStateTitle="No items found"
        emptyStateSubtitle="Try adjusting your search"
      />
    );
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search')).toBeInTheDocument();
  });

  it('renders with refresh control', () => {
    const mockOnRefresh = jest.fn();
    render(
      <DataList 
        data={mockData}
        onRefresh={mockOnRefresh}
        refreshing={false}
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with empty state icon', () => {
    const emptyIcon = <Text>📭</Text>;
    
    render(
      <DataList 
        data={[]}
        emptyStateIcon={emptyIcon}
        emptyStateTitle="No items"
      />
    );
    
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('renders with custom class name', () => {
    render(
      <DataList 
        data={mockData}
        className="custom-list"
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with search callback', () => {
    const mockOnSearch = jest.fn();
    
    render(
      <DataList 
        data={mockData}
        searchable
        onSearch={mockOnSearch}
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
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
    
    render(<DataList data={dataWithIcons} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('📄')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});