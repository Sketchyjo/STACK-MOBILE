import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from '../src/components/atoms/InputField';

describe('InputField', () => {
  it('renders without crashing', () => {
    const { container } = render(<InputField label="Test Label" />);
    expect(container).toBeTruthy();
  });

  it('renders with label and placeholder text', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField label="Name" placeholder="Enter your name" />
    );
    
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('handles text input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <InputField label="Test" onChangeText={mockOnChangeText} />
    );
    
    const input = getByDisplayValue('');
    fireEvent.change(input, { target: { value: 'test input' } });
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('renders with controlled value', () => {
    const { getByDisplayValue } = render(
      <InputField label="Test" value="controlled value" />
    );
    
    expect(getByDisplayValue('controlled value')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    const { getByText } = render(
      <InputField label="Required Field" required />
    );
    
    expect(getByText('Required Field')).toBeInTheDocument();
    expect(getByText('*')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    const { getByText } = render(
      <InputField label="Test" error="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with email type', () => {
    const { container } = render(
      <InputField label="Email" type="email" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with phone type', () => {
    const { container } = render(
      <InputField label="Phone" type="phone" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with password type', () => {
    const { container } = render(
      <InputField label="Password" type="password" />
    );
    
    expect(container).toBeTruthy();
  });

  it('handles focus and blur events', () => {
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();
    const { getByDisplayValue } = render(
      <InputField label="Test" onFocus={mockOnFocus} onBlur={mockOnBlur} />
    );
    
    const input = getByDisplayValue('');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(mockOnFocus).toHaveBeenCalled();
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('renders with icon', () => {
    const { container } = render(
      <InputField label="Search" icon="search" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with multiline support', () => {
    const { container } = render(
      <InputField label="Description" multiline />
    );
    
    expect(container).toBeTruthy();
  });
});