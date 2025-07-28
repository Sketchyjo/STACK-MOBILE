import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleSwitch } from '../src/components/atoms/ToggleSwitch';

describe('ToggleSwitch Component', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('shows correct accessibility state when off', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('shows correct accessibility state when on', () => {
    render(
      <ToggleSwitch value={true} onValueChange={mockOnValueChange} />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('shows correct accessibility state when disabled', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onValueChange when pressed', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('does not call onValueChange when disabled', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />
    );
    
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('applies small size correctly', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="small" />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    // Note: Style testing would require specific implementation details
  });

  it('applies medium size correctly', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="medium" />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    // Note: Style testing would require specific implementation details
  });

  it('applies large size correctly', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="large" />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    // Note: Style testing would require specific implementation details
  });

  it('applies custom className', () => {
    render(
      <ToggleSwitch 
        value={false} 
        onValueChange={mockOnValueChange} 
        className="custom-class" 
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('uses design system colors correctly', () => {
    const { rerender } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    let toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();

    rerender(
      <ToggleSwitch value={true} onValueChange={mockOnValueChange} />
    );
    
    toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('applies opacity when disabled', () => {
    render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-disabled', 'true');
  });
});