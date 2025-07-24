import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputField } from '../src/components/atoms/InputField';

describe('InputField', () => {
  it('renders without crashing', () => {
    const result = render(<InputField label="Test Label" />);
    expect(result).toBeTruthy();
  });

  it('renders with label and placeholder text', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField label="Name" placeholder="Enter your name" />
    );
    
    expect(getByText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
  });

  it('handles text input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <InputField label="Test" onChangeText={mockOnChangeText} />
    );
    
    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'test input');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('renders with controlled value', () => {
    const { getByDisplayValue } = render(
      <InputField label="Test" value="controlled value" />
    );
    
    expect(getByDisplayValue('controlled value')).toBeTruthy();
  });

  it('renders with required indicator', () => {
    const { getByText } = render(
      <InputField label="Required Field" required />
    );
    
    expect(getByText('Required Field')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });

  it('renders with error state', () => {
    const { getByText } = render(
      <InputField label="Test" error="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders with email type', () => {
    const { getByDisplayValue } = render(
      <InputField label="Email" type="email" />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('renders with phone type', () => {
    const { getByDisplayValue } = render(
      <InputField label="Phone" type="phone" />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('renders with password type', () => {
    const { getByDisplayValue } = render(
      <InputField label="Password" type="password" />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('handles focus and blur events', () => {
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();
    const { getByDisplayValue } = render(
      <InputField label="Test" onFocus={mockOnFocus} onBlur={mockOnBlur} />
    );
    
    const input = getByDisplayValue('');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    
    expect(mockOnFocus).toHaveBeenCalled();
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('renders with icon', () => {
    const result = render(
      <InputField label="Search" icon="search" />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with multiline support', () => {
    const { getByDisplayValue } = render(
      <InputField label="Description" multiline />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.multiline).toBe(true);
  });
});