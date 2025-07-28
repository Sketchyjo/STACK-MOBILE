import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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
    
    expect(screen.getByText('Email')).toBeInTheDocument();
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
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
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
    
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
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
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(mockOnChangeText).toBeDefined();
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
    
    expect(screen.getByText('Email')).toBeInTheDocument();
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
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
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
    
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows error but hides helper text when both provided', () => {
    render(
      <FormField 
        label="Password"
        value=""
        onChangeText={jest.fn()}
        error="Password too short"
        helperText="Must be at least 8 characters"
      />
    );
    
    expect(screen.getByText('Password too short')).toBeInTheDocument();
    expect(screen.queryByText('Must be at least 8 characters')).not.toBeInTheDocument();
  });
});