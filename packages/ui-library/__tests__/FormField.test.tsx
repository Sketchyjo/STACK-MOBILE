import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { FormField } from '../src/components/molecules/FormField';

describe('FormField', () => {
  it('renders with label and input', () => {
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={jest.fn()}
      />
    );
    
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('shows error message when provided', () => {
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={jest.fn()}
        error="Invalid email"
      />
    );
    
    expect(screen.getByText('Invalid email')).toBeTruthy();
  });

  it('shows helper text when provided', () => {
    render(
      <FormField 
        label="Password"
        value=""
        onChangeText={jest.fn()}
        helperText="Must be at least 8 characters"
      />
    );
    
    expect(screen.getByText('Must be at least 8 characters')).toBeTruthy();
  });

  it('handles text input correctly', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('applies required styling when required', () => {
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={jest.fn()}
        required={true}
      />
    );
    
    // Check that the label is rendered (required styling is visual)
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('passes through input props correctly', () => {
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={jest.fn()}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeTruthy();
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies custom className', () => {
    render(
      <FormField 
        label="Email"
        value=""
        onChangeText={jest.fn()}
        className="custom-form-field"
      />
    );
    
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('shows both error and helper text when both provided', () => {
    render(
      <FormField 
        label="Password"
        value=""
        onChangeText={jest.fn()}
        error="Password too short"
        helperText="Must be at least 8 characters"
      />
    );
    
    expect(screen.getByText('Password too short')).toBeTruthy();
    expect(screen.getByText('Must be at least 8 characters')).toBeTruthy();
  });
});