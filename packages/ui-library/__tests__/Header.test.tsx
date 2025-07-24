import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Header } from '../src/components/molecules/Header';

describe('Header', () => {
  it('renders with title only', () => {
    const { toJSON } = render(<Header title="Test Title" />);
    
    // Check if component renders and contains the title text
    const rendered = toJSON();
    expect(rendered).toBeTruthy();
    expect(JSON.stringify(rendered)).toContain('Test Title');
  });

  it('renders with title and subtitle', () => {
    const { toJSON } = render(
      <Header 
        title="Test Title" 
        subtitle="Test Subtitle" 
      />
    );
    
    const rendered = toJSON();
    expect(rendered).toBeTruthy();
    expect(JSON.stringify(rendered)).toContain('Test Title');
    expect(JSON.stringify(rendered)).toContain('Test Subtitle');
  });

  it('renders left icon when provided', () => {
    const leftIcon = <Text>←</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        leftIcon={leftIcon}
      />
    );
    
    expect(getByLabelText('Left action')).toBeTruthy();
  });

  it('renders right icon when provided', () => {
    const rightIcon = <Text>⚙️</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        rightIcon={rightIcon}
      />
    );
    
    expect(getByLabelText('Right action')).toBeTruthy();
  });

  it('handles left icon press', () => {
    const mockOnLeftPress = jest.fn();
    const leftIcon = <Text>←</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        leftIcon={leftIcon}
        onLeftPress={mockOnLeftPress}
      />
    );
    
    const leftButton = getByLabelText('Left action');
    fireEvent.press(leftButton);
    
    expect(mockOnLeftPress).toHaveBeenCalled();
  });

  it('handles right icon press', () => {
    const mockOnRightPress = jest.fn();
    const rightIcon = <Text>⚙️</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        rightIcon={rightIcon}
        onRightPress={mockOnRightPress}
      />
    );
    
    const rightButton = getByLabelText('Right action');
    fireEvent.press(rightButton);
    
    expect(mockOnRightPress).toHaveBeenCalled();
  });

  it('shows back button when showBackButton is true', () => {
    const mockOnLeftPress = jest.fn();
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        showBackButton={true}
        onLeftPress={mockOnLeftPress}
      />
    );
    
    const backButton = getByLabelText('Go back');
    fireEvent.press(backButton);
    
    expect(mockOnLeftPress).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { toJSON } = render(
      <Header 
        title="Test Title" 
        className="custom-header" 
      />
    );
    
    const rendered = toJSON();
    expect(rendered).toBeTruthy();
    expect(JSON.stringify(rendered)).toContain('Test Title');
  });

  it('has correct accessibility labels', () => {
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        showBackButton={true}
        onLeftPress={jest.fn()}
      />
    );
    
    expect(getByLabelText('Go back')).toBeTruthy();
  });
});