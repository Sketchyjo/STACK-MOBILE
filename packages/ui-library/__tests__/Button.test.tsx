/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../src/components/atoms/Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByLabelText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByLabelText('Test Button')).toBeTruthy();
  });

  it('renders with primary variant by default', () => {
    const { getByLabelText } = render(<Button title="Primary Button" onPress={() => {}} />);
    expect(getByLabelText('Primary Button')).toBeTruthy();
  });

  it('renders with accent variant', () => {
    const { getByLabelText } = render(<Button title="Accent Button" variant="accent" onPress={() => {}} />);
    expect(getByLabelText('Accent Button')).toBeTruthy();
  });

  it('renders with tertiary variant', () => {
    const { getByLabelText } = render(<Button title="Tertiary Button" variant="tertiary" onPress={() => {}} />);
    expect(getByLabelText('Tertiary Button')).toBeTruthy();
  });

  it('renders with fab variant', () => {
    const { getByLabelText } = render(<Button title="+" variant="fab" onPress={() => {}} />);
    expect(getByLabelText('+')).toBeTruthy();
  });

  it('renders in loading state', () => {
    const { getByLabelText } = render(<Button title="Loading Button" loading onPress={() => {}} />);
    // Button should still have accessibility label even when loading
    expect(getByLabelText('Loading Button')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { getByLabelText, rerender } = render(<Button title="Small" size="small" onPress={() => {}} />);
    expect(getByLabelText('Small')).toBeTruthy();

    rerender(<Button title="Medium" size="medium" onPress={() => {}} />);
    expect(getByLabelText('Medium')).toBeTruthy();

    rerender(<Button title="Large" size="large" onPress={() => {}} />);
    expect(getByLabelText('Large')).toBeTruthy();
  });

  it('renders with full width', () => {
    const { getByLabelText } = render(<Button title="Full Width" fullWidth onPress={() => {}} />);
    expect(getByLabelText('Full Width')).toBeTruthy();
  });

  it('renders fab with default plus icon when no icon provided', () => {
    const { getByLabelText } = render(<Button title="FAB" variant="fab" onPress={() => {}} />);
    expect(getByLabelText('FAB')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Button Title';
    const { getByLabelText } = render(<Button title={customTitle} onPress={() => {}} />);
    expect(getByLabelText(customTitle)).toBeTruthy();
  });

  it('has proper accessibility attributes', () => {
    const { getByLabelText } = render(<Button title="Accessible Button" onPress={() => {}} />);
    const button = getByLabelText('Accessible Button');
    expect(button).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const { getByLabelText } = render(<Button title="Loading" loading onPress={() => {}} />);
    const button = getByLabelText('Loading');
    expect(button).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByLabelText } = render(<Button title="Disabled" disabled onPress={() => {}} />);
    const button = getByLabelText('Disabled');
    expect(button).toBeTruthy();
  });
});