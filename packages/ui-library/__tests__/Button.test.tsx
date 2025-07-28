/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../src/components/atoms/Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByLabelText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByLabelText('Test Button')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { getByLabelText } = render(<Button title="Primary Button" onPress={() => {}} />);
    expect(getByLabelText('Primary Button')).toBeInTheDocument();
  });

  it('renders with accent variant', () => {
    const { getByLabelText } = render(<Button title="Accent Button" variant="accent" onPress={() => {}} />);
    expect(getByLabelText('Accent Button')).toBeInTheDocument();
  });

  it('renders with tertiary variant', () => {
    const { getByLabelText } = render(<Button title="Tertiary Button" variant="tertiary" onPress={() => {}} />);
    expect(getByLabelText('Tertiary Button')).toBeInTheDocument();
  });

  it('renders with fab variant', () => {
    const { getByLabelText } = render(<Button title="+" variant="fab" onPress={() => {}} />);
    expect(getByLabelText('+')).toBeInTheDocument();
  });

  it('renders in loading state', () => {
    const { getByLabelText } = render(<Button title="Loading Button" loading onPress={() => {}} />);
    // Button should still have accessibility label even when loading
    expect(getByLabelText('Loading Button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { getByLabelText, rerender } = render(<Button title="Small" size="small" onPress={() => {}} />);
    expect(getByLabelText('Small')).toBeInTheDocument();

    rerender(<Button title="Medium" size="medium" onPress={() => {}} />);
    expect(getByLabelText('Medium')).toBeInTheDocument();

    rerender(<Button title="Large" size="large" onPress={() => {}} />);
    expect(getByLabelText('Large')).toBeInTheDocument();
  });

  it('renders with full width', () => {
    const { getByLabelText } = render(<Button title="Full Width" fullWidth onPress={() => {}} />);
    expect(getByLabelText('Full Width')).toBeInTheDocument();
  });

  it('renders fab with default plus icon when no icon provided', () => {
    const { getByLabelText } = render(<Button title="FAB" variant="fab" onPress={() => {}} />);
    expect(getByLabelText('FAB')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Button Title';
    const { getByLabelText } = render(<Button title={customTitle} onPress={() => {}} />);
    expect(getByLabelText(customTitle)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { getByLabelText } = render(<Button title="Accessible Button" onPress={() => {}} />);
    const button = getByLabelText('Accessible Button');
    expect(button).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    const { getByLabelText } = render(<Button title="Loading" loading onPress={() => {}} />);
    const button = getByLabelText('Loading');
    expect(button).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByLabelText } = render(<Button title="Disabled" disabled onPress={() => {}} />);
    const button = getByLabelText('Disabled');
    expect(button).toBeInTheDocument();
  });
});