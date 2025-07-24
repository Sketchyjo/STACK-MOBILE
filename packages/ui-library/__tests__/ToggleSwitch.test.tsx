import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToggleSwitch } from '../src/components/atoms/ToggleSwitch';

describe('ToggleSwitch Component', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders correctly', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle).toBeTruthy();
  });

  it('shows correct accessibility state when off', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.accessibilityState.checked).toBe(false);
  });

  it('shows correct accessibility state when on', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={true} onValueChange={mockOnValueChange} />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.accessibilityState.checked).toBe(true);
  });

  it('shows correct accessibility state when disabled', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.accessibilityState.disabled).toBe(true);
  });

  it('calls onValueChange when pressed', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    fireEvent.press(toggle);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('does not call onValueChange when disabled', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    fireEvent.press(toggle);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('applies small size correctly', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="small" />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 40,
          height: 24,
        })
      ])
    );
  });

  it('applies medium size correctly', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="medium" />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 48,
          height: 28,
        })
      ])
    );
  });

  it('applies large size correctly', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} size="large" />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 56,
          height: 32,
        })
      ])
    );
  });

  it('applies custom className', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch 
        value={false} 
        onValueChange={mockOnValueChange} 
        className="custom-class" 
      />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.className).toBe('custom-class');
  });

  it('uses design system colors correctly', () => {
    const { UNSAFE_getByProps, rerender } = render(
      <ToggleSwitch value={false} onValueChange={mockOnValueChange} />
    );
    
    let toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#EAE2FF', // colors.surface.light
        })
      ])
    );

    rerender(
      <ToggleSwitch value={true} onValueChange={mockOnValueChange} />
    );
    
    toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#5852FF', // colors.primary.royalBlue
        })
      ])
    );
  });

  it('applies opacity when disabled', () => {
    const { UNSAFE_getByProps } = render(
      <ToggleSwitch 
        value={false} 
        onValueChange={mockOnValueChange} 
        disabled 
      />
    );
    
    const toggle = UNSAFE_getByProps({ accessibilityRole: 'switch' });
    expect(toggle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: 0.5,
        })
      ])
    );
  });
});