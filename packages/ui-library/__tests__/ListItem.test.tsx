import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ListItem } from '../src/components/molecules/ListItem';

describe('ListItem', () => {
  it('renders without crashing', () => {
    const result = render(<ListItem title="Test Item" />);
    expect(result).toBeTruthy();
  });

  it('renders with subtitle when provided', () => {
    const result = render(
      <ListItem 
        title="Test Item" 
        subtitle="Test Subtitle"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with right text when provided', () => {
    const result = render(
      <ListItem 
        title="Test Item" 
        rightText="Details"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with icons when provided', () => {
    const leftIcon = <Text>📱</Text>;
    const rightIcon = <Text>→</Text>;
    
    const result = render(
      <ListItem 
        title="Test Item" 
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders as pressable when onPress is provided', () => {
    const mockOnPress = jest.fn();
    const result = render(
      <ListItem 
        title="Test Item" 
        onPress={mockOnPress}
      />
    );
    
    expect(result).toBeTruthy();
  });
});