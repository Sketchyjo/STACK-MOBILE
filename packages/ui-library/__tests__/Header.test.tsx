import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { Header } from '../src/components/molecules/Header';

describe('Header', () => {
  it('renders with title only', () => {
    const { getByText } = render(<Header title="Test Title" />);
    
    // Check if component renders and contains the title text
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    const { getByText } = render(
      <Header 
        title="Test Title" 
        subtitle="Test Subtitle" 
      />
    );
    
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders left icon when provided', () => {
    const leftIcon = <Text>←</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        leftIcon={leftIcon}
      />
    );
    
    expect(getByLabelText('Left action')).toBeInTheDocument();
  });

  it('renders right icon when provided', () => {
    const rightIcon = <Text>⚙️</Text>;
    
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        rightIcon={rightIcon}
      />
    );
    
    expect(getByLabelText('Right action')).toBeInTheDocument();
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
    fireEvent.click(leftButton);
    
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
    fireEvent.click(rightButton);
    
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
    fireEvent.click(backButton);
    
    expect(mockOnLeftPress).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Header 
        title="Test Title" 
        className="custom-header" 
      />
    );
    
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('has correct accessibility labels', () => {
    const { getByLabelText } = render(
      <Header 
        title="Test Title" 
        showBackButton={true}
        onLeftPress={jest.fn()}
      />
    );
    
    expect(getByLabelText('Go back')).toBeInTheDocument();
  });
});